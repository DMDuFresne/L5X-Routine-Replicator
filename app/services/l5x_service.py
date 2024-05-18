import io
import logging
import os
import re

from .xml_service import read_xml, parse_xml, modify_xml, merge_xml, update_logix_header, update_logix_program_context

# Configure logging
log_level = os.getenv('LOG_LEVEL', 'DEBUG').upper()
logging.basicConfig(level=getattr(logging, log_level, logging.DEBUG))
logger = logging.getLogger(__name__)


def process_conversion(file):
    """
    Process the conversion of the uploaded file.
    """
    content = read_xml(file)  # Read the XML content from the file
    parsed_content = parse_xml(content)  # Parse the XML content
    return parsed_content  # Return the parsed content


def sanitize_program_name(program_name=None):
    """
    Sanitize the provided program name by removing invalid characters.
    If no program name is provided, use the default 'Imported_Program'.
    """
    if program_name is not None:
        logger.debug(f"Received program name: {program_name}")
        # Replace invalid characters and whitespace with underscores
        program_name = re.sub(r'[^a-zA-Z0-9_]', '', program_name.replace(" ", "_")).rstrip('_')
        logger.debug(f"Sanitized program name: {program_name}")
    else:
        program_name = "Imported_Program"
        logger.debug("No program name provided; using default 'Imported_Program'.")
    
    return program_name


def process_modification(file, replacements, program_name):
    """
    Process the modification of the uploaded file with the given replacements and program name.
    """
    l5x_content = read_xml(file)  # Read the XML content from the file
    program_name = sanitize_program_name(program_name)  # Sanitize the program name
    
    if not program_name:
        raise ValueError('Invalid program name after sanitization.')

    if isinstance(replacements, list):
        # Modify the XML content with multiple sets of replacements
        modified_content = modify_xml(l5x_content, replacements[0])
        for replacement in replacements[1:]:
            modified_content = merge_xml(modified_content, modify_xml(l5x_content, replacement))
        
        # Update the Logix header and program context
        modified_content = update_logix_header(modified_content, TargetType="Program")
        modified_content = update_logix_program_context(
            modified_content,
            Use="Target",
            Name=program_name,
            TestEdits="false",
            Disabled="false",
            UseAsFolder="false"
        )
        
        # Add XML declaration
        content = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' + modified_content
    else:
        raise ValueError('Invalid type for replacements')

    # Write the modified content to a BytesIO stream
    mem = io.BytesIO()
    mem.write(content.encode('utf-8'))
    mem.seek(0)
    return mem  # Return the stream containing the modified content
