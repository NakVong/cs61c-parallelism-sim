const elementColors = {"main" : "#d8bfd8", "init a" :"#d8bfd8", "init b" :"#d8bfd8", "init n" :"#d8bfd8", "init total" :"#d8bfd8", "#pragma omp parallel num_threads(2)" : "#d8bfd8", "#pragma omp parallel num_threads(3)" : "#d8bfd8", "thread 1" : "#f08080", "thread 2" : "	#e0ffff", "thread 3": "#ccffcc"};
const destID = "#grid2";
const studentInputID = "#answer-input"
const loadDataID = "#load-data"

$(function() {

  const load_data = JSON.parse($(loadDataID).val())
  
  let source_options = {
    acceptWidgets: true, // Allow dropping items from other grids
    float: false
  };
  let dest_options = {
    acceptWidgets: true, // Allow dropping items from other grids
    float: true, // Freeform (without this it tries to minimize free space)
  };

  let source_grid = GridStack.init(source_options, '.source-grid')
  let dest_grid = GridStack.init(dest_options, 'dest-grid')

  // Load items into each grid
  source_grid.load(load_data.source);

  dest_grid.load(load_data.given);

  // removes duplicate source_grid blocks when dragged back into source_grid
  source_grid.on('dropped', function(event, prev_widget, new_widget) { // GridStackNode (data on the widget properties)
    let existing_widgets = source_grid.getGridItems(); // array of GridStackHTMLElement (DOM Element)
    let duplicate_found = existing_widgets.some(widget_element => { 
      let node = widget_element.gridstackNode; // Each GridStackHTMLElement has reference to GridStackNode
      return node.id == new_widget.id; 
    });
    if (duplicate_found) {
      source_grid.removeWidget(new_widget.el); 
    }

    setAnswer();
  });

  // duplicate source_grid blocks when dragged out of source_grid into dest_grid
  dest_grid.on('dropped', function(event, prev_widget, new_widget) {
    source_grid.addWidget(
      { w: prev_widget.w, h: prev_widget.h, content: prev_widget.content, id: prev_widget.id }
    );
    let widget_data = { x: new_widget.x, y: new_widget.y, content: new_widget.content }
    // console.log(widget_data);
    setColorToThread(new_widget.el);

    setAnswer();

    console.log("Current hidden input value:", $(studentInputID).val());
  });

  // updates the values in the hidden input field
  function setAnswer() {
    var grid_cells = $(destID).children(); 
    var student_answers = [];
    for (const grid_cell of grid_cells) {
      var cell = $(grid_cell) // convert DOM to JQuery Object
      var answer_html = cell.find(".grid-stack-item-content").html().trim();
      var answer_x = cell.attr("gs-x");
      var answer_y = cell.attr("gs-y");
      var answer_w = cell.attr("gs-w");
      student_answers.push({
        x: answer_x,
        y: answer_y,
        w: answer_w,
        content: answer_html
      })
    }
    $(studentInputID).val(JSON.stringify(student_answers));
  }

  // check column for thread and applies same color
  function setColorToThread(new_widget) {
    let column = new_widget.getAttribute('gs-x');
    // console.log(column);
    let existing_widgets = dest_grid.getGridItems();
    let color = null;
    
    existing_widgets.forEach(widget_element => {
      // Check if the widget is in the same column
      let widget_column = widget_element.getAttribute('gs-x');
      // console.log(widget_column);
      if (column === widget_column) {
        let text = $(widget_element).text();  // Ensure no extra spaces
        // console.log('Checking widget text:', text);  // Log the text being checked
        if (text in elementColors) {
          color = elementColors[text];
          // console.log('Color found:', color);  // Log the color being applied
          return false;  // Exit the loop once color is found
        }
      }
    });
  
    if (color) {
      $(new_widget).find('.grid-stack-item-content').css('background-color', color);
    } else {
      console.log('No color found for column:', column);  // Log if no color is found
    }
  }
  

  // After loading, select which elements you want to change the background color for.
  // Gridstack doesn't support element classes unfortunately so need to set color manually after loading
  function setColorByThread(grid, elementColors) {
    $('#' + grid + ' .grid-stack-item-content').each(function() {
      let text = $(this).text(); 
      if (text in elementColors) { 
        $(this).css('background-color', elementColors[text]); 
      }
    });
  }
  setColorByThread('grid2', elementColors);
  
});
