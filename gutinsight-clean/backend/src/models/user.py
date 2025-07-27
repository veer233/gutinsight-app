from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    has_paid = db.Column(db.Boolean, default=False)
    payment_id = db.Column(db.String(255), nullable=True)
    
    # Relationship to assessments
    assessments = db.relationship('Assessment', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.full_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'has_paid': self.has_paid,
            'payment_id': self.payment_id
        }

class Assessment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    responses = db.Column(db.Text, nullable=False)  # JSON string of responses
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    ai_analysis = db.Column(db.Text, nullable=True)  # AI-generated analysis
    recommendations = db.Column(db.Text, nullable=True)  # JSON string of recommendations
    
    def __repr__(self):
        return f'<Assessment {self.id} for User {self.user_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'responses': json.loads(self.responses) if self.responses else {},
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'ai_analysis': self.ai_analysis,
            'recommendations': json.loads(self.recommendations) if self.recommendations else []
        }

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.String(50), unique=True, nullable=False)
    text = db.Column(db.Text, nullable=False)
    section = db.Column(db.String(50), nullable=False)
    question_type = db.Column(db.String(20), nullable=False)  # 'scale', 'multiple_choice', 'text'
    options = db.Column(db.Text, nullable=True)  # JSON string for multiple choice options
    order_index = db.Column(db.Integer, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    
    def __repr__(self):
        return f'<Question {self.question_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'question_id': self.question_id,
            'text': self.text,
            'section': self.section,
            'question_type': self.question_type,
            'options': json.loads(self.options) if self.options else [],
            'order_index': self.order_index,
            'is_active': self.is_active
        }

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.String(20), nullable=False)
    affiliate_link = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Product {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'price': self.price,
            'affiliate_link': self.affiliate_link,
            'image_url': self.image_url,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
