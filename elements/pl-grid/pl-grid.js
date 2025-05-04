$(function() {
  /* for question panel */
  const question_data = JSON.parse($("#question-data").val()); 
  const colors = question_data.colors; // all of the color assignments specified by the instructor
  
  let source_options = {
    acceptWidgets: true, // allow dropping items from other grids (for deleting)
    float: false
  };
  let source_grid = GridStack.init(source_options, '.source-grid');
  source_grid.load(question_data.source);

  initGridColors('source-grid-id', colors); // source blocks are colored

  let destination_options = {
    acceptWidgets: true, // allow dropping items from other grids (for solution construction)
    float: true, // prevent auto-rearranging that minimizes free space
  };
  let destination_grid = GridStack.init(destination_options, '.dest-grid');
  destination_grid.load(question_data.given);
  
  initGridColors('dest-grid-id', colors); // if prepoluation was set, dest blocks are colored

  /* for submission panel */
  document.querySelectorAll('.submission-data').forEach((inputEl, index) => {
    let submissionData;
    try {
      submissionData = JSON.parse(inputEl.value);
    } catch (e) {
      console.warn("Bad submission JSON", e);
      return;
    }
  
    const gridContainer = inputEl.previousElementSibling; // the .sub-grid div
    const grid = GridStack.init({
      float: true,
      acceptWidgets: false
    }, gridContainer);
  
    grid.load(submissionData);
    setColorComplete(grid, colors);  // your coloring logic
  });
  

  /* for solution panel */
  let solution_data = []; 
  const solution_data_element = $("#solution-data");

  if (solution_data_element.length > 0) {
    try {
      solution_data = JSON.parse(solution_data_element.val());
    } catch (e) {
      console.warn("Invalid or missing #load-data-sol JSON");
    }

    let solution_grid;

    if (Array.isArray(solution_data) && solution_data.length > 0) {
      let solution_options = {
        acceptWidgets: false,
        float: true
      };
      solution_grid = GridStack.init(solution_options, '.sol-grid');
      solution_grid.load(solution_data);

      setColorComplete(solution_grid, colors);
    }
  }
  

  // removes duplicate source_grid blocks when dragged back into source_grid
  source_grid.on('dropped', function(event, prev_widget, new_widget) { 
    let existing_widgets = source_grid.getGridItems();

    let duplicate_found = existing_widgets.some(widget_element_html => { 
      let node = widget_element_html.gridstackNode; 
      return node.id == new_widget.id; 
    });
    if (duplicate_found) {
      source_grid.removeWidget(new_widget.el); 
    }

    setAnswer(); // update student answer
  });

  // duplicate blocks when dragged out of source_grid into destination_grid
  destination_grid.on('dropped', function(event, prev_widget, new_widget) {
    source_grid.addWidget(
      { w: prev_widget.w, h: prev_widget.h, content: prev_widget.content, id: prev_widget.id }
    );

    setColumnColor(destination_grid, new_widget.el);

    setAnswer(); // update student answer
  });

  // updates the student's answer in the hidden input field
  function setAnswer() {
    let grid_cells = $(".dest-grid").children(); 
    let student_answers = [];

    for (const grid_cell of grid_cells) {
      let cell = $(grid_cell) // convert DOM to JQuery Object
      let answer_html = cell.find(".grid-stack-item-content").html().trim();
      let answer_x = cell.attr("gs-x");
      let answer_y = cell.attr("gs-y");
      let answer_w = cell.attr("gs-w");

      student_answers.push({
        x: answer_x,
        y: answer_y,
        w: answer_w,
        content: answer_html
      });
    }

    $("#answer-input").val(JSON.stringify(student_answers));
  }

  // applies same color to the new block as the ones in the same column 
  function setColumnColor(grid, new_widget_el) {
    let column = new_widget_el.getAttribute('gs-x');
    let existing_widgets = grid.getGridItems();
    let color = null;
    
    for (const widget_element_html of existing_widgets) {
      let widget_column = widget_element_html.getAttribute('gs-x');
      if (column === widget_column) {
        let text = $(widget_element_html).text().trim();
        // console.log('Checking widget text:', text);
        if (text in colors) {
          color = colors[text];
          // console.log('Color found:', color);
          break; 
        }
      }
    }
  
    if (color) {
      $(new_widget_el).find('.grid-stack-item-content').css('background-color', color);
    } else {
      console.log('No color found for column:', column); 
    }
  }

  // colors block based on color assignments set by the instructor
  function initGridColors(grid_id, colors) {
    $('#' + grid_id + ' .grid-stack-item-content').each(function() {
      let text = $(this).text(); 
      if (text in colors) { 
        $(this).css('background-color', colors[text]); 
      }
    });
  }
  
  // colors all of the blocks in each submission panel
  function setColorComplete(grid, colors) {
    initGridColors(grid.el.id, colors); // submission blocks are colored (only ones that were in original mappings)

    let existing_widgets = grid.getGridItems();
    let color_mapping = {};
    
    // first pass: determine a color for each column
    for (const widget_element_html of existing_widgets) {
      const widget_column = widget_element_html.getAttribute('gs-x');
      const content = $(widget_element_html).find('.grid-stack-item-content').text().trim();

      // assign the first found color in this column
      if (!(widget_column in color_mapping) && content in colors) {
        color_mapping[widget_column] = colors[content];
      }
    }

    // second pass: apply that color to all widgets in the same column
    for (const widget_element_html of existing_widgets) {
      const widget_column = widget_element_html.getAttribute('gs-x');
      const color = color_mapping[widget_column];
      if (color) {
        $(widget_element_html).find('.grid-stack-item-content').css('background-color', color);
      }
    }
  }
});
