import chevron
from lxml import html, etree
import prairielearn as pl
import json

def generate_mustache(data):
    root = html.Element("div", attrib={"class": "pl-grid"})

    # For each grid type in our shared data:
    for grid_type in ['pl-source', 'pl-destination']: #REMOVED PL-ANSWER-GRID FOR RN 
        # Create a container for the grid.
        grid_div = etree.SubElement(root, "div", attrib={"class": grid_type, "data-grid-type": grid_type})
        
        # Iterate over the elements within the current grid
        for element in data[grid_type]:
            # Create a div for each grid element with all of its attributes set as data- attributes.
            el = etree.SubElement(grid_div, "div", attrib={
                "class": "pl-element",
                "data-w": str(element['w']),
                "data-h": str(element['h']),
                "data-x": str(element['x']),
                "data-y": str(element['y']),
                "data-color": element['color']
            })
            # Set the text content of the element
            el.text = element['content']

    # Serialize the HTML tree to a string (pretty printed)
    html_string = etree.tostring(root, pretty_print=True, encoding="unicode")
    print(html_string)


def render(element_html, data):
    html_params = {}
    # store grid data in pl-grid.mustache
    generate_mustache(pl.from_json(data["params"]["grid"]))


    with open('pl-grid.mustache', 'r') as f:
        return chevron.render(f, html_params).strip()
    
    

