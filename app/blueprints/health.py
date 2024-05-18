from flask import Blueprint, jsonify

# Create a Blueprint named 'health_bp'
health_bp = Blueprint('health', __name__)


@health_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify(status='healthy'), 200
