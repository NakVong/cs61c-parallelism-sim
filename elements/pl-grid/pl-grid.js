const elementColors = {"main" : "#d8bfd8", "init y" :"#d8bfd8", "#pragma omp parallel" : "#d8bfd8", "thread 1" : "#f08080", "thread 2" : "#e0ffff"};
const destID = "#grid2";
const inputID = "#question-input";

$(function() {
  let source_options = {
    acceptWidgets: true, // Allow dropping items from other grids
    float: false
  };
  let dest_options = {
    acceptWidgets: true, // Allow dropping items from other grids
    float: true, // Freeform (without this it tries to minimize free space)
  };

  let source_grid = GridStack.init(source_options, '.source-grid');
  let dest_grid = GridStack.init(dest_options, 'dest-grid');

  // Load items into each grid
  source_grid.load([
    { w: 2, h: 0.5, content: 'read y' },
    { w: 2, h: 0.5, content: 'y+' },
    { w: 2, h: 0.5, content: 'y-' },
    { w: 2, h: 0.5, content: 'write y' }
  ]);

  dest_grid.load([
    { x: 0, y: 0, w: 2, h: 0.5, content: 'main', noMove: true, noResize: true, locked: true },
    { x: 0, y: 1, w: 2, h: 0.5, content: 'init y', noMove: true, noResize: true, locked: true },
    { x: 0, y: 2, w: 2, h: 0.5, content: '#pragma omp parallel', noMove: true, noResize: true, locked: true },
    { x: 2, y: 2, w: 2, h: 0.5, content: 'thread 1', noMove: true, noResize: true, locked: true },
    { x: 4, y: 2, w: 2, h: 0.5, content: 'thread 2', noMove: true, noResize: true, locked: true }
  ]);

  // removes duplicate source_grid blocks when dragged back into source_grid
  source_grid.on('dropped', function(event, prev_widget, new_widget) {
    let existing_widgets = source_grid.getGridItems();
    let duplicate_found = existing_widgets.some(widget_element => { 
      let node = widget_element.gridstackNode;
      return node.id == new_widget.id; 
    });
    if (duplicate_found) {
      source_grid.removeWidget(new_widget.el); 
    }
  });

  // duplicate source_grid blocks when dragged out of source_grid into dest_grid
  dest_grid.on('dropped', function(event, prev_widget, new_widget) {
    source_grid.addWidget(
      { w: prev_widget.w, h: prev_widget.h, content: prev_widget.content, id: prev_widget.id }
    );
    let widget_data = { x: new_widget.x, y: new_widget.y, content: new_widget.content }
    setColorToThread(new_widget.el);
    setAnswer();
    console.log("Current hidden input value:", $(inputID).val());
  });

  // updates the values in the hidden input field
  function setAnswer() {
    var grid_cells = $(destID).children(); 
    var student_answers = [];
    for (const grid_cell of grid_cells) {
      var cell = $(grid_cell);
      var answer_html = cell.find(".grid-stack-item-content").html().trim();
      var answer_x = cell.attr("gs-x");
      var answer_y = cell.attr("gs-y");
      student_answers.push({
        inner_html: answer_html,
        x: answer_x,
        y: answer_y
      });
    }
    $(inputID).val(JSON.stringify(student_answers));
  }

  // check column for thread and applies same color
  function setColorToThread(new_widget) {
    let column = new_widget.getAttribute('gs-x');
    let existing_widgets = dest_grid.getGridItems();
    let color = null;
    
    existing_widgets.forEach(widget_element => {
      let widget_column = widget_element.getAttribute('gs-x');
      if (column === widget_column) {
        let text = $(widget_element).text();
        if (text in elementColors) {
          color = elementColors[text];
          return false; 
        }
      }
    });
  
    if (color) {
      $(new_widget).find('.grid-stack-item-content').css('background-color', color);
    } else {
      console.log('No color found for column:', column);
    }
  }

  // After loading, select which elements you want to change the background color for.
  function setColorByThread(grid, elementColors) {
    $('#' + grid + ' .grid-stack-item-content').each(function() {
      let text = $(this).text(); 
      if (text in elementColors) { 
        $(this).css('background-color', elementColors[text]); 
      }
    });
  }
  setColorByThread('grid2', elementColors);

  // Add event listeners to widgets for click, double-click, and right-click
  function addEventListenersToWidgets(gridSelector) {
    $(gridSelector).on('click', '.grid-stack-item-content', function(event) {
      console.log("Widget clicked:", $(this).text().trim());
      $(this).toggleClass('highlighted'); // Highlight the clicked widget
    });

    $(gridSelector).on('dblclick', '.grid-stack-item-content', function(event) {
      alert("Double-clicked: " + $(this).text().trim());
    });

    $(gridSelector).on('contextmenu', '.grid-stack-item-content', function(event) {
      event.preventDefault(); // Prevent right-click menu
      console.log("Right-clicked:", $(this).text().trim());
    });

    dest_grid.on('change', function(event, items) {
      console.log("Widget(s) changed:");
      items.forEach(item => {
        console.log(`Moved widget with content "${$(item.el).text().trim()}" to x=${item.x}, y=${item.y}`);
      });
    });

    
  }

  // Apply event listeners to both source and destination grids
  addEventListenersToWidgets(destID);
  addEventListenersToWidgets('.source-grid');
});

// CSS for highlighting widgets
$('<style>')
  .prop('type', 'text/css')
  .html(`
    .highlighted {
      outline: 3px solid gold;
      box-shadow: 0 0 10px gold;
    }
  `)
  .appendTo('head');