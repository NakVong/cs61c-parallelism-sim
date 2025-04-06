import random
import chevron
import lxml.html
import prairielearn as pl


def prepare(element_html, data):
    # data['params']['random_number'] = random.random()
    # return data
    element = lxml.html.fragment_fromstring(element_html)

    answer_grid_data = []

    for html_tags in element:
        if html_tags.tag == "pl-answer-grid":
            for el_tag in html_tags:
                if el_tag.tag == "pl-element":
                    content = el_tag.text_content().strip()
                    x = int(el_tag.get("x", 100))
                    y = int(el_tag.get("y", 100))
                    answer_grid_data.append({
                        "content": content,
                        "x": x,
                        "y": y
                        })
    data["correct_answers"]["grid_answer"] = answer_grid_data
    print(answer_grid_data)



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
    

