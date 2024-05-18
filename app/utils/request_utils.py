import json

from flask import jsonify


def validate_file_request(request):
    """
    Validate the file part of the request.
    Returns the file if valid, otherwise returns an error response.
    """
    if 'file' not in request.files:
        return None, handle_error_response('No file part', 400)
    
    file = request.files['file']
    if file.filename == '':
        return None, handle_error_response('No selected file', 400)
    
    return file, None


def parse_json_replacements(request, default_value):
    """
    Parse the JSON replacements from the request form.
    Returns the replacements if valid, otherwise returns an error response.
    """
    replacements_str = request.form.get('replacements', default_value)
    try:
        replacements = json.loads(replacements_str)
        return replacements, None
    except json.JSONDecodeError:
        return None, handle_error_response('Invalid JSON in replacements', 400)


def handle_error_response(error_message, status_code):
    """
    Handle error responses by returning a JSON response with the error message and status code.
    """
    return jsonify({'error': error_message}), status_code
