from flask import Blueprint, jsonify, request
from src.models.user import Question, db
import json

question_bp = Blueprint('question', __name__)

@question_bp.route('/questions', methods=['GET'])
def get_questions():
    questions = Question.query.filter_by(is_active=True).order_by(Question.order_index).all()
    return jsonify([question.to_dict() for question in questions])

@question_bp.route('/questions/all', methods=['GET'])
def get_all_questions():
    questions = Question.query.order_by(Question.order_index).all()
    return jsonify([question.to_dict() for question in questions])

@question_bp.route('/questions', methods=['POST'])
def create_question():
    data = request.json
    
    # Check if question_id already exists
    existing_question = Question.query.filter_by(question_id=data['question_id']).first()
    if existing_question:
        return jsonify({'error': 'Question with this ID already exists'}), 400
    
    question = Question(
        question_id=data['question_id'],
        text=data['text'],
        section=data['section'],
        question_type=data['question_type'],
        options=json.dumps(data.get('options', [])),
        order_index=data['order_index']
    )
    db.session.add(question)
    db.session.commit()
    return jsonify(question.to_dict()), 201

@question_bp.route('/questions/<int:question_id>', methods=['GET'])
def get_question(question_id):
    question = Question.query.get_or_404(question_id)
    return jsonify(question.to_dict())

@question_bp.route('/questions/by-id/<question_id>', methods=['GET'])
def get_question_by_id(question_id):
    question = Question.query.filter_by(question_id=question_id).first()
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    return jsonify(question.to_dict())

@question_bp.route('/questions/section/<section>', methods=['GET'])
def get_questions_by_section(section):
    questions = Question.query.filter_by(section=section, is_active=True).order_by(Question.order_index).all()
    return jsonify([question.to_dict() for question in questions])

@question_bp.route('/questions/<int:question_id>', methods=['PUT'])
def update_question(question_id):
    question = Question.query.get_or_404(question_id)
    data = request.json
    
    question.text = data.get('text', question.text)
    question.section = data.get('section', question.section)
    question.question_type = data.get('question_type', question.question_type)
    question.order_index = data.get('order_index', question.order_index)
    question.is_active = data.get('is_active', question.is_active)
    
    if 'options' in data:
        question.options = json.dumps(data['options'])
    
    db.session.commit()
    return jsonify(question.to_dict())

@question_bp.route('/questions/<int:question_id>/toggle', methods=['POST'])
def toggle_question_status(question_id):
    question = Question.query.get_or_404(question_id)
    question.is_active = not question.is_active
    db.session.commit()
    return jsonify(question.to_dict())

@question_bp.route('/questions/<int:question_id>', methods=['DELETE'])
def delete_question(question_id):
    question = Question.query.get_or_404(question_id)
    db.session.delete(question)
    db.session.commit()
    return '', 204

@question_bp.route('/questions/seed', methods=['POST'])
def seed_questions():
    """Seed the database with default questions"""
    default_questions = [
        {
            'question_id': 'bloating_frequency',
            'text': 'How often do you experience bloating?',
            'section': 'Digestive Symptoms',
            'question_type': 'scale',
            'options': [],
            'order_index': 1
        },
        {
            'question_id': 'gas_frequency',
            'text': 'How often do you experience gas or flatulence?',
            'section': 'Digestive Symptoms',
            'question_type': 'scale',
            'options': [],
            'order_index': 2
        },
        {
            'question_id': 'stomach_pain',
            'text': 'How often do you experience stomach pain or cramping?',
            'section': 'Digestive Symptoms',
            'question_type': 'scale',
            'options': [],
            'order_index': 3
        },
        {
            'question_id': 'diet_type',
            'text': 'Which best describes your current diet?',
            'section': 'Dietary Patterns',
            'question_type': 'multiple_choice',
            'options': ['Standard Western Diet', 'Mediterranean', 'Vegetarian', 'Vegan', 'Keto/Low-carb', 'Paleo', 'Other'],
            'order_index': 4
        },
        {
            'question_id': 'fiber_intake',
            'text': 'How would you rate your daily fiber intake?',
            'section': 'Dietary Patterns',
            'question_type': 'scale',
            'options': [],
            'order_index': 5
        },
        {
            'question_id': 'stress_level',
            'text': 'What is your typical stress level?',
            'section': 'Lifestyle Factors',
            'question_type': 'scale',
            'options': [],
            'order_index': 6
        },
        {
            'question_id': 'sleep_quality',
            'text': 'How would you rate your sleep quality?',
            'section': 'Lifestyle Factors',
            'question_type': 'scale',
            'options': [],
            'order_index': 7
        },
        {
            'question_id': 'exercise_frequency',
            'text': 'How often do you exercise per week?',
            'section': 'Lifestyle Factors',
            'question_type': 'multiple_choice',
            'options': ['Never', '1-2 times', '3-4 times', '5-6 times', 'Daily'],
            'order_index': 8
        },
        {
            'question_id': 'bowel_movement_frequency',
            'text': 'How often do you have bowel movements?',
            'section': 'Bowel Health',
            'question_type': 'multiple_choice',
            'options': ['Less than 3 times per week', '3-6 times per week', 'Once daily', '2-3 times daily', 'More than 3 times daily'],
            'order_index': 9
        },
        {
            'question_id': 'stool_consistency',
            'text': 'What best describes your typical stool consistency?',
            'section': 'Bowel Health',
            'question_type': 'multiple_choice',
            'options': ['Hard lumps', 'Lumpy sausage', 'Sausage with cracks', 'Smooth sausage', 'Soft blobs', 'Fluffy pieces', 'Watery'],
            'order_index': 10
        },
        {
            'question_id': 'primary_goal',
            'text': 'What is your primary health goal?',
            'section': 'Health Goals',
            'question_type': 'multiple_choice',
            'options': ['Reduce bloating', 'Improve digestion', 'Increase energy', 'Better sleep', 'Weight management', 'Overall wellness'],
            'order_index': 11
        }
    ]
    
    created_count = 0
    for q_data in default_questions:
        existing = Question.query.filter_by(question_id=q_data['question_id']).first()
        if not existing:
            question = Question(
                question_id=q_data['question_id'],
                text=q_data['text'],
                section=q_data['section'],
                question_type=q_data['question_type'],
                options=json.dumps(q_data['options']),
                order_index=q_data['order_index']
            )
            db.session.add(question)
            created_count += 1
    
    db.session.commit()
    return jsonify({'message': f'Created {created_count} questions'}), 201

