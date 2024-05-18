import logging
import os

from flask import request, jsonify, current_app
from lxml import etree

from ..utils.xml_parser import get_xml_parser

# Configure logging
log_level = os.getenv('LOG_LEVEL', 'DEBUG').upper()
logging.basicConfig(level=getattr(logging, log_level, logging.DEBUG))
logger = logging.getLogger(__name__)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'l5x'}


def allowed_file(filename):
    """
    Check if the file has an allowed extension.
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_target_type(xml_content):
    """
    Extract the TargetType attribute from the XML content.
    """
    try:
        parser = get_xml_parser()
        xml = etree.fromstring(xml_content, parser)
        root = xml

        if root.tag != 'RSLogix5000Content':
            raise ValueError('Missing RSLogix5000Content tag')

        target_type = root.get('TargetType')
        if not target_type:
            raise ValueError('Missing TargetType attribute')
        
        return target_type
    except Exception as e:
        logging.error(f"Error extracting TargetType: {e}")
        return None


def is_valid_l5x(xml_content):
    """
    Validate the L5X XML content.
    """
    try:
        parser = get_xml_parser()
        xml = etree.fromstring(xml_content, parser)
        root = xml

        if root.tag != 'RSLogix5000Content':
            raise ValueError('Missing RSLogix5000Content tag')
    except etree.XMLSyntaxError as e:
        error_position = e.position
        snippet_start = max(error_position[0] - 50, 0)
        snippet_end = min(error_position[0] + 50, len(xml_content))
        snippet = xml_content[snippet_start:snippet_end]
        logging.error(f"XML syntax error at line {error_position[0]}: {e}. Snippet: {snippet}")
        return False, f'XML syntax error at line {error_position[0]}: {e}'
    except ValueError as ve:
        logging.error(f"Validation error: {ve}")
        return False, str(ve)
    except Exception as ex:
        logging.error(f"Unexpected validation error: {ex}")
        return False, str(ex)

    return True, None


def l5x_validation_middleware(func):
    """
    Middleware to validate L5X files in the request.
    """
    def wrapper(*args, **kwargs):
        logging.debug("Middleware engaged: l5x validation middleware")

        if 'file' not in request.files:
            logging.warning("Request does not contain file part")
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']

        logging.info(f"Received file: {file.filename}")

        file.seek(0, os.SEEK_END)
        file_length = file.tell()

        logging.info(f"File size: {file_length} bytes")

        if file_length > current_app.config['MAX_CONTENT_LENGTH']:
            logging.error("File size exceeds maximum limit")
            return jsonify({'error': 'File too large'}), 413

        file.seek(0)

        if not allowed_file(file.filename):
            logging.error("File type is not allowed")
            return jsonify({'error': 'File type not allowed'}), 400

        file.seek(0)
        file_content = file.read()
        file.seek(0)

        is_l5x, error_message = is_valid_l5x(file_content)
        if not is_l5x:
            logging.error(f"L5X validation failed: {error_message}")
            return jsonify({'error': error_message}), 400

        logging.debug("File passed middleware validation, proceeding to function")

        return func(*args, **kwargs)

    wrapper.__name__ = func.__name__
    return wrapper


def target_type_validation_middleware(expected_target_type):
    """
    Middleware to validate the TargetType attribute in the L5X file.
    """
    def middleware(func):
        def wrapper(*args, **kwargs):
            logging.debug("Middleware engaged: target type validation middleware")

            if 'file' not in request.files:
                logging.warning("Request does not contain file part")
                return jsonify({'error': 'No file part'}), 400

            file = request.files['file']

            logging.info(f"Received file: {file.filename}")

            file.seek(0)
            file_content = file.read()
            file.seek(0)

            target_type = get_target_type(file_content)
            if target_type != expected_target_type:
                logging.error(f"TargetType validation failed: Expected {expected_target_type} but found {target_type}")
                return jsonify(
                    {'error': f"Expected TargetType='{expected_target_type}' but found TargetType='{target_type}'"}
                ), 400

            logging.debug("File passed TargetType validation, proceeding to function")

            return func(*args, **kwargs)

        wrapper.__name__ = func.__name__
        return wrapper
    return middleware
