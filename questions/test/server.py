import random
import matplotlib.pyplot as plt
import prairielearn as pl
import numpy as np
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
            x = element.get('x')
            y = element.get('y')
            color = element.get('color')
            text = element.text

            element_data = [x, y, color, text] # list containing individual pl-element attributes
            grid_data.append(element_data)
        html_data[tag] = grid_data
    #print(html_data)        
def generate(data):
    parse_html(filepath, tags)