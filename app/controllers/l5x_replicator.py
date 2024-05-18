import logging
import os

from flask import jsonify, send_file

from ..services.l5x_service import process_conversion, process_modification
from ..utils.request_utils import validate_file_request, parse_json_replacements, handle_error_response

# Configure logging
log_level = os.getenv('LOG_LEVEL', 'DEBUG').upper()
logging.basicConfig(level=getattr(logging, log_level, logging.DEBUG))
logger = logging.getLogger(__name__)


def convert_file(req):
    """
    Handle the file conversion request.
    """
    # Validate the file in the request
    file, error_response = validate_file_request(req)
    if error_response:
        return error_response

    logging.debug(f"Converting file: {file.filename}")
    try:
        # Process the file conversion
        result = process_conversion(file)
        return jsonify(result), 200
    except Exception as e:
        logging.exception("Exception occurred while converting file:")
        return handle_error_response(f'Error converting file: {e}', 500)


def modify_file(req):
    """
    Handle the file modification request.
    """
    # Validate the file in the request
    file, error_response = validate_file_request(req)
    if error_response:
        return error_response

    # Parse JSON replacements from the request
    replacements, error_response = parse_json_replacements(req, None)
    if error_response:
        return error_response

    # Get the program name from the request form data
    program_name = req.form.get('programName', 'Imported_Program')
    try:
        # Process the file modification
        result = process_modification(file, replacements, program_name)
        return send_file(result, as_attachment=True, download_name='modified_file.l5x', mimetype='application/xml')
    except Exception as e:
        logging.exception("Exception occurred while modifying file:")
        return handle_error_response(f'Error modifying file: {e}', 500)
