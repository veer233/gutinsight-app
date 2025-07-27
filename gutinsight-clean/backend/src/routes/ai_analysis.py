from flask import Blueprint, jsonify, request
from src.models.user import Assessment, User, Product, db
from src.services.ai_analysis import GutHealthAnalyzer
import json

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/analyze', methods=['POST'])
def analyze_responses():
    """
    Analyze user responses and generate gut health recommendations
    """
    try:
        data = request.json
        
        # Validate required fields
        if 'responses' not in data:
            return jsonify({'error': 'Responses are required'}), 400
        
        responses = data['responses']
        user_id = data.get('user_id')
        
        # Get user info if user_id provided
        user_info = {}
        if user_id:
            user = User.query.get(user_id)
            if user:
                user_info = {
                    'full_name': user.full_name,
                    'email': user.email
                }
        
        # Initialize AI analyzer
        analyzer = GutHealthAnalyzer()
        
        # Perform analysis
        analysis_result = analyzer.analyze_responses(responses, user_info)
        
        if not analysis_result['success']:
            return jsonify({
                'error': 'Analysis failed',
                'details': analysis_result.get('error', 'Unknown error')
            }), 500
        
        # Get product recommendations
        products = Product.query.filter_by(is_active=True).all()
        product_list = [product.to_dict() for product in products]
        
        product_recommendations = analyzer.get_product_recommendations(
            analysis_result['structured_data'], 
            product_list
        )
        
        # Prepare response
        response_data = {
            'analysis': analysis_result['analysis'],
            'gut_health_score': analysis_result['gut_health_score'],
            'priority_areas': analysis_result['priority_areas'],
            'recommendations': analysis_result['recommendations'],
            'product_recommendations': product_recommendations,
            'structured_data': analysis_result['structured_data']
        }
        
        # Save analysis to database if user_id provided
        if user_id and user:
            assessment = Assessment.query.filter_by(user_id=user_id).order_by(Assessment.completed_at.desc()).first()
            if assessment:
                assessment.ai_analysis = analysis_result['analysis']
                assessment.recommendations = json.dumps({
                    'gut_health_score': analysis_result['gut_health_score'],
                    'priority_areas': analysis_result['priority_areas'],
                    'recommendations': analysis_result['recommendations'],
                    'product_recommendations': product_recommendations
                })
                db.session.commit()
        
        return jsonify(response_data), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@ai_bp.route('/analyze/assessment/<int:assessment_id>', methods=['POST'])
def analyze_assessment(assessment_id):
    """
    Analyze a specific assessment by ID
    """
    try:
        assessment = Assessment.query.get_or_404(assessment_id)
        user = User.query.get(assessment.user_id)
        
        # Parse responses
        responses = json.loads(assessment.responses) if assessment.responses else {}
        
        user_info = {
            'full_name': user.full_name,
            'email': user.email
        } if user else {}
        
        # Initialize AI analyzer
        analyzer = GutHealthAnalyzer()
        
        # Perform analysis
        analysis_result = analyzer.analyze_responses(responses, user_info)
        
        if not analysis_result['success']:
            return jsonify({
                'error': 'Analysis failed',
                'details': analysis_result.get('error', 'Unknown error')
            }), 500
        
        # Get product recommendations
        products = Product.query.filter_by(is_active=True).all()
        product_list = [product.to_dict() for product in products]
        
        product_recommendations = analyzer.get_product_recommendations(
            analysis_result['structured_data'], 
            product_list
        )
        
        # Update assessment with analysis
        assessment.ai_analysis = analysis_result['analysis']
        assessment.recommendations = json.dumps({
            'gut_health_score': analysis_result['gut_health_score'],
            'priority_areas': analysis_result['priority_areas'],
            'recommendations': analysis_result['recommendations'],
            'product_recommendations': product_recommendations
        })
        db.session.commit()
        
        # Prepare response
        response_data = {
            'assessment_id': assessment_id,
            'analysis': analysis_result['analysis'],
            'gut_health_score': analysis_result['gut_health_score'],
            'priority_areas': analysis_result['priority_areas'],
            'recommendations': analysis_result['recommendations'],
            'product_recommendations': product_recommendations,
            'structured_data': analysis_result['structured_data']
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@ai_bp.route('/test-analysis', methods=['POST'])
def test_analysis():
    """
    Test endpoint for AI analysis with sample data
    """
    try:
        # Sample responses for testing
        sample_responses = {
            'bloating_frequency': 7,
            'gas_frequency': 6,
            'stomach_pain': 4,
            'diet_type': 'Standard Western Diet',
            'fiber_intake': 3,
            'stress_level': 8,
            'sleep_quality': 4,
            'exercise_frequency': '1-2 times',
            'bowel_movement_frequency': '3-6 times per week',
            'stool_consistency': 'Hard lumps',
            'primary_goal': 'Reduce bloating'
        }
        
        # Use provided responses or sample data
        data = request.json or {}
        responses = data.get('responses', sample_responses)
        
        # Initialize AI analyzer
        analyzer = GutHealthAnalyzer()
        
        # Perform analysis
        analysis_result = analyzer.analyze_responses(responses, {'full_name': 'Test User'})
        
        return jsonify({
            'test_mode': True,
            'sample_responses': responses,
            'analysis_result': analysis_result
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Test analysis failed',
            'details': str(e)
        }), 500

