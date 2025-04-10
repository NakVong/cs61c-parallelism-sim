import random
import json
from typing import TypedDict

import chevron
import lxml.html
import prairielearn as pl
class GridAnswerData(TypedDict):
    inner_html: str
    x: int
    y: int

def prepare(element_html, data):
    # data['params']['random_number'] = random.random()
    # return data
    element = lxml.html.fragment_fromstring(element_html)

    correct_answers: list[GridAnswerData] = []

    for html_tags in element:
        if html_tags.tag == "pl-answer-grid":
            for inner_tag in html_tags:
                if inner_tag.tag == "pl-element":
                    answer_data_dict: GridAnswerData = {
                        "inner_html": inner_tag.text_content().strip(),
                        "x": int(inner_tag.get("x", 100)),
                        "y": int(inner_tag.get("y", 100))
                    }
                    correct_answers.append(answer_data_dict)
    data["correct_answers"]["grid_answer"] = correct_answers
    print(correct_answers)



def render(element_html, data):
    # element = lxml.html.fragment_fromstring(element_html)

    # for html_tags in element:
    #     if html_tags.tag == "pl-answer":
    #         print(pl.get_string_attrib(html_tags, "x"))
    # open('data.json', 'w', encoding='utf-8')
    if data["panel"] == "question":
        html_params = {
            "question": True,
            # 'number': data['params']['random_number'],
            # 'image_url': data['options']['client_files_element_url'] + '/block_i.png'
        }
        with open('pl-grid.mustache', 'r') as f:
            return chevron.render(f, html_params).strip()
    elif data["panel"] == "submission":
        html_params = {
            "submission": True,
            # 'number': data['params']['random_number'],
            # 'image_url': data['options']['client_files_element_url'] + '/block_i.png'
        }
        with open('pl-grid.mustache', 'r') as f:
            return chevron.render(f, html_params).strip()
    elif data["panel"] == "true_answer":
        html_params = {
            "true_answer": True,
            # 'number': data['params']['random_number'],
            # 'image_url': data['options']['client_files_element_url'] + '/block_i.png'
        }
        with open('pl-grid.mustache', 'r') as f:
            return chevron.render(f, html_params).strip()
    

def parse(element_html, data):
    element = lxml.html.fragment_fromstring(element_html)
    student_answer = data["raw_submitted_answers"].get("test-input", "[]")
    student_answer = json.loads(student_answer)
    data["submitted_answers"]["grid_answer"] = student_answer

def grade(element_html, data):
    print(data["submitted_answers"]["grid_answer"])