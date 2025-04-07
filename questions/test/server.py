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

    # parse each graph
    for tag in tags:
        grid = root.xpath('//pl-grid/' + tag + '/pl-element')
        for element in grid:
            #element = root.xpath('//pl-grid/pl-source/pl-element')[i]

            x = element.get('x')
            y = element.get('y')
            color = element.get('color')
            text = element.text

            lst = [x, y, color, text]

            print(lst)
                
def generate(data):
    parse_html(filepath, tags)