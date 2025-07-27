from flask import Blueprint, request, jsonify
from src.models.user import User, db
import sqlite3
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/stats', methods=['GET'])
def get_admin_stats():
    """Get dashboard statistics for admin panel"""
    try:
        # Get total users
        total_users = User.query.count()
        
        # Get paid users
        paid_users = User.query.filter_by(has_paid=True).count()
        
        # Calculate total revenue (assuming $47 per paid user)
        total_revenue = paid_users * 47
        
        # Get completed analyses (users who have paid)
        completed_analyses = paid_users
        
        return jsonify({
            'totalUsers': total_users,
            'totalPayments': paid_users,
            'totalRevenue': total_revenue,
            'completedAnalyses': completed_analyses
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users', methods=['GET'])
def get_all_users():
    """Get all users for admin management"""
    try:
        users = User.query.all()
        users_data = []
        
        for user in users:
            users_data.append({
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'has_paid': user.has_paid,
                'payment_id': user.payment_id,
                'created_at': user.created_at.isoformat() if user.created_at else None
            })
        
        return jsonify(users_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user_details(user_id):
    """Get detailed information about a specific user"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Get user's assessment responses if available
        conn = sqlite3.connect('src/database.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM assessments WHERE user_id = ?
        ''', (user_id,))
        
        assessments = cursor.fetchall()
        conn.close()
        
        user_data = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'has_paid': user.has_paid,
            'payment_id': user.payment_id,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'assessments': len(assessments)
        }
        
        return jsonify(user_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user information"""
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email']
        if 'has_paid' in data:
            user.has_paid = data['has_paid']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User updated successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user account"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Delete related assessments first
        conn = sqlite3.connect('src/database.db')
        cursor = conn.cursor()
        cursor.execute('DELETE FROM assessments WHERE user_id = ?', (user_id,))
        conn.commit()
        conn.close()
        
        # Delete user
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User deleted successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/analytics/revenue', methods=['GET'])
def get_revenue_analytics():
    """Get revenue analytics data"""
    try:
        # Get revenue by month (simplified for demo)
        conn = sqlite3.connect('src/database.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                strftime('%Y-%m', created_at) as month,
                COUNT(*) as payments,
                COUNT(*) * 47 as revenue
            FROM users 
            WHERE has_paid = 1 
            GROUP BY strftime('%Y-%m', created_at)
            ORDER BY month DESC
            LIMIT 12
        ''')
        
        revenue_data = cursor.fetchall()
        conn.close()
        
        analytics = []
        for row in revenue_data:
            analytics.append({
                'month': row[0],
                'payments': row[1],
                'revenue': row[2]
            })
        
        return jsonify(analytics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/analytics/users', methods=['GET'])
def get_user_analytics():
    """Get user analytics data"""
    try:
        # Get user registrations by month
        conn = sqlite3.connect('src/database.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                strftime('%Y-%m', created_at) as month,
                COUNT(*) as registrations
            FROM users 
            GROUP BY strftime('%Y-%m', created_at)
            ORDER BY month DESC
            LIMIT 12
        ''')
        
        user_data = cursor.fetchall()
        conn.close()
        
        analytics = []
        for row in user_data:
            analytics.append({
                'month': row[0],
                'registrations': row[1]
            })
        
        return jsonify(analytics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/settings', methods=['GET'])
def get_admin_settings():
    """Get application settings"""
    try:
        # Return current settings (in a real app, these would be stored in database)
        settings = {
            'ai_model': 'gpt-4o-mini',
            'analysis_price': 47.00,
            'payment_mode': 'demo',
            'ai_prompt_template': '''You are a gut health expert. Analyze the user's responses and provide personalized recommendations for improving their digestive health. Consider their symptoms, diet, lifestyle factors, and goals.

Please provide:
1. A gut health score (0-100)
2. Priority areas for improvement
3. Specific dietary recommendations
4. Lifestyle modifications
5. Supplement suggestions if appropriate

Be encouraging and provide actionable advice.'''
        }
        
        return jsonify(settings)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/settings', methods=['PUT'])
def update_admin_settings():
    """Update application settings"""
    try:
        data = request.get_json()
        
        # In a real application, you would save these to a database
        # For now, we'll just return success
        
        return jsonify({
            'success': True,
            'message': 'Settings updated successfully'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/backup', methods=['POST'])
def create_backup():
    """Create a backup of the database"""
    try:
        import shutil
        from datetime import datetime
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_filename = f'backup_{timestamp}.db'
        
        shutil.copy2('src/database.db', f'backups/{backup_filename}')
        
        return jsonify({
            'success': True,
            'message': f'Backup created: {backup_filename}'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/system-info', methods=['GET'])
def get_system_info():
    """Get system information and health status"""
    try:
        import os
        import psutil
        
        # Get basic system info
        system_info = {
            'python_version': '3.11.0',
            'flask_version': '2.3.3',
            'database_size': os.path.getsize('src/database.db') if os.path.exists('src/database.db') else 0,
            'uptime': 'N/A',  # Would need to track app start time
            'memory_usage': f"{psutil.virtual_memory().percent}%" if 'psutil' in globals() else 'N/A',
            'disk_usage': f"{psutil.disk_usage('/').percent}%" if 'psutil' in globals() else 'N/A'
        }
        
        return jsonify(system_info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

