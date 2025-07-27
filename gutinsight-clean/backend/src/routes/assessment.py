from flask import Blueprint, jsonify, request
from src.models.user import Assessment, User, db
import json

assessment_bp = Blueprint('assessment', __name__)

@assessment_bp.route('/assessments', methods=['GET'])
def get_assessments():
    assessments = Assessment.query.all()
    return jsonify([assessment.to_dict() for assessment in assessments])

@assessment_bp.route('/assessments', methods=['POST'])
def create_assessment():
    data = request.json
    
    # Validate user exists
    user = User.query.get(data['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    assessment = Assessment(
        user_id=data['user_id'],
        responses=json.dumps(data['responses'])
    )
    db.session.add(assessment)
    db.session.commit()
    return jsonify(assessment.to_dict()), 201

@assessment_bp.route('/assessments/<int:assessment_id>', methods=['GET'])
def get_assessment(assessment_id):
    assessment = Assessment.query.get_or_404(assessment_id)
    return jsonify(assessment.to_dict())

@assessment_bp.route('/assessments/user/<int:user_id>', methods=['GET'])
def get_user_assessments(user_id):
    assessments = Assessment.query.filter_by(user_id=user_id).all()
    return jsonify([assessment.to_dict() for assessment in assessments])

@assessment_bp.route('/assessments/user/<int:user_id>/latest', methods=['GET'])
def get_latest_user_assessment(user_id):
    assessment = Assessment.query.filter_by(user_id=user_id).order_by(Assessment.completed_at.desc()).first()
    if not assessment:
        return jsonify({'error': 'No assessment found for user'}), 404
    return jsonify(assessment.to_dict())

@assessment_bp.route('/assessments/<int:assessment_id>', methods=['PUT'])
def update_assessment(assessment_id):
    assessment = Assessment.query.get_or_404(assessment_id)
    data = request.json
    
    if 'responses' in data:
        assessment.responses = json.dumps(data['responses'])
    if 'ai_analysis' in data:
        assessment.ai_analysis = data['ai_analysis']
    if 'recommendations' in data:
        assessment.recommendations = json.dumps(data['recommendations'])
    
    db.session.commit()
    return jsonify(assessment.to_dict())

@assessment_bp.route('/assessments/<int:assessment_id>/analysis', methods=['POST'])
def update_analysis(assessment_id):
    assessment = Assessment.query.get_or_404(assessment_id)
    data = request.json
    
    assessment.ai_analysis = data.get('ai_analysis')
    assessment.recommendations = json.dumps(data.get('recommendations', []))
    
    db.session.commit()
    return jsonify(assessment.to_dict())

@assessment_bp.route('/assessments/<int:assessment_id>', methods=['DELETE'])
def delete_assessment(assessment_id):
    assessment = Assessment.query.get_or_404(assessment_id)
    db.session.delete(assessment)
    db.session.commit()
    return '', 204

