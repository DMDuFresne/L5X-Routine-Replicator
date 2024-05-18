from flask import Blueprint, request

from app.middleware.limiter import limiter
from ..controllers.l5x_replicator import convert_file, modify_file
from ..middleware.l5x_validation import l5x_validation_middleware, target_type_validation_middleware

# Create a Blueprint named 'l5x_bp'
l5x_bp = Blueprint('l5x_bp', __name__)


@l5x_bp.route('/convert', methods=['POST'])
@limiter.limit("30/minute")
@l5x_validation_middleware
@target_type_validation_middleware('Routine')
def convert_file_route():
    """
    Endpoint to convert L5X files. Applies rate limiting, L5X validation,
    and target type validation before calling the convert_file function.
    """
    return convert_file(request)


@l5x_bp.route('/modify', methods=['POST'])
@limiter.limit("30/minute")
@l5x_validation_middleware
@target_type_validation_middleware('Routine')
def modify_file_route():
    """
    Endpoint to modify L5X files. Applies rate limiting, L5X validation,
    and target type validation before calling the modify_file function.
    """
    return modify_file(request)
