$(function() {
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
