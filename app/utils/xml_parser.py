from lxml import etree


def get_xml_parser():
    """
    Configure and return an XML parser with security settings.
    - strip_cdata: Preserve CDATA sections
    - no_network: Disable network access
    - remove_blank_text: Remove blank text nodes
    - dtd_validation: Disable DTD validation
    - load_dtd: Disable loading of external DTDs
    - resolve_entities: Disable resolving of entities
    """
    return etree.XMLParser(
        strip_cdata=False,
        no_network=True,
        remove_blank_text=True,
        dtd_validation=False,
        load_dtd=False,
        resolve_entities=False,
    )
