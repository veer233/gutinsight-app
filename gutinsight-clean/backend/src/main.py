import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db

# Create Flask app
app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app, origins="*")

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Register blueprints
from src.routes.user import user_bp
from src.routes.assessment import assessment_bp
from src.routes.question import question_bp
from src.routes.product import product_bp
# from src.routes.ai_analysis import ai_bp  # Temporarily disabled for deployment
from src.routes.payment import payment_bp
from src.routes.admin import admin_bp

app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(assessment_bp, url_prefix='/api/assessments')
app.register_blueprint(question_bp, url_prefix='/api/questions')
app.register_blueprint(product_bp, url_prefix='/api/products')
# app.register_blueprint(ai_bp, url_prefix='/api/ai')  # Temporarily disabled
app.register_blueprint(payment_bp, url_prefix='/api/payment')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

# Initialize database
with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

# Health check endpoint
@app.route('/api/health')
def health_check():
    return {'status': 'healthy', 'message': 'GutWise API is running'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

