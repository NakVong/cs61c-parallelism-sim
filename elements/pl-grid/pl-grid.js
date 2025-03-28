$(function() {
  let source_options = {
    acceptWidgets: true, // Allow dropping items from other grids
    float: true, // Freeform (without this it tries to minimize free space)
  };
  let dest_options = {
    acceptWidgets: true, // Allow dropping items from other grids
    float: true, // Freeform (without this it tries to minimize free space)
  };

  let source_grid = GridStack.init(source_options, '.source-grid')
  let dest_grid = GridStack.init(dest_options, 'dest-grid')

  // Load items into each grid
  source_grid.load([
    { w:2, h:0.5, content: 'init y', id: 'b1' },
    { w:2, h:0.5, content: '#pragma omp parallel', id: 'b2' },
    { w:2, h:0.5, content: 'thread 1', id: 'b3' },
    { w:2, h:0.5, content: 'thread 2', id: 'b4' },
    { w:2, h:0.5, content: 'read y', id: 'b5' },
    { w:2, h:0.5, content: 'y+', id: 'b6' },
    { w:2, h:0.5, content: 'y-', id: 'b7' },
    { w:2, h:0.5, content: 'load y', id: 'b8' },
  ]);

  dest_grid.load([
    { w:2, h:0.5, content: 'main', id: 'b9', noMove: true },
  ]);

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
  });

  // duplicate source_grid blocks when dragged out of source_grid into dest_grid
  dest_grid.on('dropped', function(event, prev_widget, new_widget) {
    source_grid.addWidget(
      { w: prev_widget.w, h: prev_widget.h, content: prev_widget.content, id: prev_widget.id }
    );
  });
});
