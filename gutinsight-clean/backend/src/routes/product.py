from flask import Blueprint, jsonify, request
from src.models.user import Product, db

product_bp = Blueprint('product', __name__)

@product_bp.route('/products', methods=['GET'])
def get_products():
    products = Product.query.filter_by(is_active=True).all()
    return jsonify([product.to_dict() for product in products])

@product_bp.route('/products/all', methods=['GET'])
def get_all_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])

@product_bp.route('/products', methods=['POST'])
def create_product():
    data = request.json
    
    product = Product(
        name=data['name'],
        category=data['category'],
        description=data.get('description', ''),
        price=data['price'],
        affiliate_link=data['affiliate_link'],
        image_url=data.get('image_url', '')
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201

@product_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())

@product_bp.route('/products/category/<category>', methods=['GET'])
def get_products_by_category(category):
    products = Product.query.filter_by(category=category, is_active=True).all()
    return jsonify([product.to_dict() for product in products])

@product_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.json
    
    product.name = data.get('name', product.name)
    product.category = data.get('category', product.category)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.affiliate_link = data.get('affiliate_link', product.affiliate_link)
    product.image_url = data.get('image_url', product.image_url)
    product.is_active = data.get('is_active', product.is_active)
    
    db.session.commit()
    return jsonify(product.to_dict())

@product_bp.route('/products/<int:product_id>/toggle', methods=['POST'])
def toggle_product_status(product_id):
    product = Product.query.get_or_404(product_id)
    product.is_active = not product.is_active
    db.session.commit()
    return jsonify(product.to_dict())

@product_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return '', 204

@product_bp.route('/products/seed', methods=['POST'])
def seed_products():
    """Seed the database with default products"""
    default_products = [
        {
            'name': 'Premium Probiotic Complex',
            'category': 'Probiotics',
            'description': 'High-potency probiotic with 50 billion CFU and 15 strains for optimal gut health',
            'price': '$34.99',
            'affiliate_link': 'https://amazon.com/dp/example1',
            'image_url': 'https://example.com/probiotic.jpg'
        },
        {
            'name': 'Digestive Enzyme Blend',
            'category': 'Enzymes',
            'description': 'Comprehensive enzyme formula to support healthy digestion and nutrient absorption',
            'price': '$28.99',
            'affiliate_link': 'https://amazon.com/dp/example2',
            'image_url': 'https://example.com/enzymes.jpg'
        },
        {
            'name': 'Omega-3 Fish Oil',
            'category': 'Supplements',
            'description': 'Pure, molecularly distilled fish oil for anti-inflammatory support',
            'price': '$24.99',
            'affiliate_link': 'https://amazon.com/dp/example3',
            'image_url': 'https://example.com/omega3.jpg'
        },
        {
            'name': 'Fiber Supplement',
            'category': 'Fiber',
            'description': 'Organic psyllium husk fiber for digestive regularity and gut health',
            'price': '$19.99',
            'affiliate_link': 'https://amazon.com/dp/example4',
            'image_url': 'https://example.com/fiber.jpg'
        },
        {
            'name': 'Gut Health Tea Blend',
            'category': 'Herbal',
            'description': 'Soothing herbal tea blend with ginger, chamomile, and peppermint',
            'price': '$16.99',
            'affiliate_link': 'https://amazon.com/dp/example5',
            'image_url': 'https://example.com/tea.jpg'
        },
        {
            'name': 'Magnesium Glycinate',
            'category': 'Supplements',
            'description': 'Highly bioavailable magnesium for muscle relaxation and digestive support',
            'price': '$22.99',
            'affiliate_link': 'https://amazon.com/dp/example6',
            'image_url': 'https://example.com/magnesium.jpg'
        }
    ]
    
    created_count = 0
    for p_data in default_products:
        existing = Product.query.filter_by(name=p_data['name']).first()
        if not existing:
            product = Product(
                name=p_data['name'],
                category=p_data['category'],
                description=p_data['description'],
                price=p_data['price'],
                affiliate_link=p_data['affiliate_link'],
                image_url=p_data['image_url']
            )
            db.session.add(product)
            created_count += 1
    
    db.session.commit()
    return jsonify({'message': f'Created {created_count} products'}), 201

