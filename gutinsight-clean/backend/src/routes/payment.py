from flask import Blueprint, jsonify, request
from src.models.user import User, db
import json
import uuid
import time

payment_bp = Blueprint('payment', __name__)

# Mock Stripe configuration for MVP
MOCK_STRIPE_CONFIG = {
    'analysis_price': 4700,  # $47.00 in cents
    'currency': 'usd',
    'success_rate': 0.95  # 95% success rate for demo
}

@payment_bp.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    """
    Create a payment intent for the gut health analysis
    """
    try:
        data = request.json
        user_id = data.get('user_id')
        amount = data.get('amount', MOCK_STRIPE_CONFIG['analysis_price'])
        
        # Validate user exists
        if user_id:
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
        
        # Create mock payment intent
        payment_intent = {
            'id': f'pi_mock_{uuid.uuid4().hex[:16]}',
            'client_secret': f'pi_mock_{uuid.uuid4().hex[:16]}_secret_{uuid.uuid4().hex[:8]}',
            'amount': amount,
            'currency': MOCK_STRIPE_CONFIG['currency'],
            'status': 'requires_payment_method',
            'created': int(time.time()),
            'metadata': {
                'user_id': str(user_id) if user_id else None,
                'product': 'gut_health_analysis'
            }
        }
        
        return jsonify({
            'payment_intent': payment_intent,
            'publishable_key': 'pk_test_mock_key_for_demo',
            'amount': amount,
            'currency': MOCK_STRIPE_CONFIG['currency']
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to create payment intent',
            'details': str(e)
        }), 500

@payment_bp.route('/confirm-payment', methods=['POST'])
def confirm_payment():
    """
    Confirm payment and update user status (Mock implementation)
    """
    try:
        data = request.json
        payment_intent_id = data.get('payment_intent_id')
        user_id = data.get('user_id')
        
        if not payment_intent_id or not user_id:
            return jsonify({'error': 'Payment intent ID and user ID are required'}), 400
        
        # Get user
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Mock payment processing (simulate success/failure)
        import random
        success = random.random() < MOCK_STRIPE_CONFIG['success_rate']
        
        if success:
            # Update user payment status
            user.has_paid = True
            user.payment_id = payment_intent_id
            db.session.commit()
            
            return jsonify({
                'success': True,
                'payment_status': 'succeeded',
                'payment_intent_id': payment_intent_id,
                'user_id': user_id,
                'message': 'Payment confirmed successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'payment_status': 'failed',
                'error': 'Payment processing failed. Please try again.',
                'error_code': 'card_declined'
            }), 400
        
    except Exception as e:
        return jsonify({
            'error': 'Payment confirmation failed',
            'details': str(e)
        }), 500

@payment_bp.route('/payment-status/<int:user_id>', methods=['GET'])
def get_payment_status(user_id):
    """
    Get payment status for a user
    """
    try:
        user = User.query.get_or_404(user_id)
        
        return jsonify({
            'user_id': user_id,
            'has_paid': user.has_paid,
            'payment_id': user.payment_id,
            'can_access_results': user.has_paid
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to get payment status',
            'details': str(e)
        }), 500

@payment_bp.route('/webhook', methods=['POST'])
def payment_webhook():
    """
    Handle payment webhooks (Mock implementation)
    """
    try:
        # In a real implementation, this would verify the webhook signature
        # and process actual Stripe events
        
        data = request.json
        event_type = data.get('type', 'payment_intent.succeeded')
        
        if event_type == 'payment_intent.succeeded':
            payment_intent = data.get('data', {}).get('object', {})
            payment_intent_id = payment_intent.get('id')
            user_id = payment_intent.get('metadata', {}).get('user_id')
            
            if user_id and payment_intent_id:
                user = User.query.get(int(user_id))
                if user:
                    user.has_paid = True
                    user.payment_id = payment_intent_id
                    db.session.commit()
        
        return jsonify({'received': True}), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Webhook processing failed',
            'details': str(e)
        }), 500

@payment_bp.route('/refund', methods=['POST'])
def process_refund():
    """
    Process a refund (Mock implementation for admin use)
    """
    try:
        data = request.json
        user_id = data.get('user_id')
        payment_id = data.get('payment_id')
        reason = data.get('reason', 'requested_by_customer')
        
        if not user_id or not payment_id:
            return jsonify({'error': 'User ID and payment ID are required'}), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.payment_id != payment_id:
            return jsonify({'error': 'Payment ID does not match user records'}), 400
        
        # Mock refund processing
        refund_id = f're_mock_{uuid.uuid4().hex[:16]}'
        
        # Update user status
        user.has_paid = False
        user.payment_id = None
        db.session.commit()
        
        return jsonify({
            'success': True,
            'refund_id': refund_id,
            'amount_refunded': MOCK_STRIPE_CONFIG['analysis_price'],
            'currency': MOCK_STRIPE_CONFIG['currency'],
            'reason': reason,
            'status': 'succeeded'
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Refund processing failed',
            'details': str(e)
        }), 500

@payment_bp.route('/config', methods=['GET'])
def get_payment_config():
    """
    Get payment configuration for frontend
    """
    return jsonify({
        'publishable_key': 'pk_test_mock_key_for_demo',
        'analysis_price': MOCK_STRIPE_CONFIG['analysis_price'],
        'currency': MOCK_STRIPE_CONFIG['currency'],
        'price_display': '$47.00',
        'is_mock': True,
        'demo_cards': {
            'success': '4242424242424242',
            'decline': '4000000000000002',
            'insufficient_funds': '4000000000009995'
        }
    }), 200

@payment_bp.route('/demo-payment', methods=['POST'])
def demo_payment():
    """
    Demo payment endpoint for testing without real payment processing
    """
    try:
        data = request.json
        user_id = data.get('user_id')
        card_number = data.get('card_number', '4242424242424242')
        
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Simulate different outcomes based on card number
        if card_number == '4242424242424242':
            # Success
            payment_id = f'pi_demo_success_{uuid.uuid4().hex[:12]}'
            user.has_paid = True
            user.payment_id = payment_id
            db.session.commit()
            
            return jsonify({
                'success': True,
                'payment_id': payment_id,
                'message': 'Demo payment successful! You now have access to your results.'
            }), 200
        elif card_number == '4000000000000002':
            # Decline
            return jsonify({
                'success': False,
                'error': 'Your card was declined.',
                'error_code': 'card_declined'
            }), 400
        else:
            # Default success for any other number
            payment_id = f'pi_demo_success_{uuid.uuid4().hex[:12]}'
            user.has_paid = True
            user.payment_id = payment_id
            db.session.commit()
            
            return jsonify({
                'success': True,
                'payment_id': payment_id,
                'message': 'Demo payment successful! You now have access to your results.'
            }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Demo payment failed',
            'details': str(e)
        }), 500

