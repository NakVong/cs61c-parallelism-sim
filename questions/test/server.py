import prairielearn as pl
from lxml import html

filepath = "question.html"
tags = ['pl-source', 'pl-destination', 'pl-answer-grid']


def parse_html(filepath, tags):
    # Parse the file as HTML
    tree = html.parse(filepath)
    root = tree.getroot()
    
    html_data = {} 
    # parse each graph
    for tag in tags:
        grid = root.xpath('//pl-grid/' + tag + '/pl-element')
        grid_data = [] # nested list containing info for each pl-element tag
        for element in grid:
            w = float(element.get('w'))
            h = float(element.get('h'))
            x = float(element.get('x'))
            y = float(element.get('y'))
            color = element.get('color')
            text = element.text

            element_data = {'x':x, 'y':y, 'w':w, 'h':h, 'color':color, 'content':text} # dict containing individual pl-element attributes (needs to be a json object when we dump it)
            grid_data.append(element_data)
        html_data[tag] = grid_data
    return html_data       

def generate(data):
    data["params"]["grid"] = pl.to_json(parse_html(filepath, tags))
