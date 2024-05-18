import logging
import os
from copy import deepcopy

from lxml import etree

from ..utils.xml_parser import get_xml_parser

# Configure logging
log_level = os.getenv('LOG_LEVEL', 'DEBUG').upper()
logging.basicConfig(level=getattr(logging, log_level, logging.DEBUG))
logger = logging.getLogger(__name__)

# Configure the XML parser
parser = get_xml_parser()


def read_xml(file_stream):
    """
    Read XML content from a file stream and return it as a string.
    Raise a ValueError if the content is empty.
    """
    content = file_stream.read().decode('utf-8')
    if not content:
        raise ValueError("File content is empty")
    return content


def element_to_dict(element):
    """
    Convert an XML element and its children into a dictionary.
    """
    data = {}
    if element.text and element.text.strip():
        data["text"] = element.text.strip()
    for attr, value in element.attrib.items():
        data[attr] = value
    for child in element:
        child_data = element_to_dict(child)
        child_key = child.tag
        data.setdefault(child_key, []).append(child_data)
    return data


def parse_xml(content):
    """
    Parse the XML content string into a dictionary.
    """
    root = etree.fromstring(content.encode('utf-8'), parser)
    return element_to_dict(root)


def modify_xml(content, replacements):
    """
    Modify the XML content by replacing keys with their corresponding values from the replacements dictionary.
    """
    for key, value in replacements.items():
        content = content.replace(key, value)
    return content


def merge_xml(base_content, merge_content):
    """
    Merge two XML content strings, combining their elements recursively.
    """
    base_root = etree.fromstring(base_content.encode('utf-8'), parser)
    merge_root = etree.fromstring(merge_content.encode('utf-8'), parser)

    def recursive_merge(base_element, merge_element):
        base_children_map = {}
        for child in base_element:
            # Special handling for <Program> elements
            if child.tag == 'Program':
                tag_attrib_tuple = (child.tag, frozenset((k, v) for k, v in child.attrib.items() if k != 'Name'))
            else:
                tag_attrib_tuple = (child.tag, frozenset(child.attrib.items()))
            base_children_map.setdefault(tag_attrib_tuple, []).append(child)
        
        for child in merge_element:
            # Special handling for <Program> elements
            if child.tag == 'Program':
                tag_attrib_tuple = (child.tag, frozenset((k, v) for k, v in child.attrib.items() if k != 'Name'))
            else:
                tag_attrib_tuple = (child.tag, frozenset(child.attrib.items()))
            
            if tag_attrib_tuple in base_children_map:
                for base_child in base_children_map[tag_attrib_tuple]:
                    recursive_merge(base_child, child)
            else:
                base_element.append(deepcopy(child))

    recursive_merge(base_root, merge_root)
    return etree.tostring(base_root, encoding='utf-8', xml_declaration=True, pretty_print=True).decode('utf-8')


def update_logix_header(base_content, **kwargs):
    """
    Update the Logix header attributes in the XML content with the provided keyword arguments.
    """
    root = etree.fromstring(base_content.encode('utf-8'), parser)
    for key, value in kwargs.items():
        if value is not None:
            root.attrib[key] = value
    return etree.tostring(root, encoding='utf-8', pretty_print=True).decode('utf-8')


def update_logix_program_context(base_content, **kwargs):
    """
    Update the Logix program context attributes in the XML content with the provided keyword arguments.
    """
    root = etree.fromstring(base_content.encode('utf-8'), parser)
    for program_element in root.findall(".//Program"):
        for key, value in kwargs.items():
            if value is not None:
                program_element.attrib[key] = str(value).lower()
    return etree.tostring(root, encoding='utf-8', pretty_print=True).decode('utf-8')
