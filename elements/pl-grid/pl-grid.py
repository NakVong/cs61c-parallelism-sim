import chevron
import lxml.html
import prairielearn as pl
import json


def prepare(element_html, data):
    with open('data.json', 'w') as f:
        json.dump(data["params"]["grid"], f, indent=2)
    


def render(element_html, data):
    html_params = {}
    with open('pl-grid.mustache', 'r') as f:
        return chevron.render(f, html_params).strip()
    

