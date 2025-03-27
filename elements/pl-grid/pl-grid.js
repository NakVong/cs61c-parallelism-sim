$(function() {
  let source_options = {
    acceptWidgets: true, // Allow dropping items from other grids
    float: true, // Freeform (without this it tries to minimize free space)
  };
  let dest_options = {
    acceptWidgets: true, // Allow dropping items from other grids
    float: true, // Freeform (without this it tries to minimize free space)
  };
  // let trash_options = {
  //   disableDrag: true,
  //   acceptWidgets: true, // Allow items to be dropped into trash
  // };

  let source_grid = GridStack.init(source_options, '.source-grid')
  let dest_grid = GridStack.init(dest_options, 'dest-grid')
  // let trash_grid = GridStack.init(trash_options, 'trash-grid')

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
    { w:2, h:0.5, content: 'main', id: 'b9' },
  ]);

  // trash_grid.load([
  //   { w:2, h:0.5, content: 'hey fellow trash', id: 'b10'}
  // ])

  // create a copy in the source grid when dragged out of it
  dest_grid.on('dropped', function(event, prevWidget, newWidget) {
    source_grid.addWidget(
      { w: prevWidget.w, h: prevWidget.h, content: prevWidget.content, id: prevWidget.id }
    );
    newWidget.el.setAttribute("gs-id", prevWidget.id + "-dup");
  });

  // trash_grid.on('dropped', function(event, prevWidget, newWidget) {
  //   let gs_id = prevWidget.id;
  //   console.log(gs_id);
  //   if (gs_id.endsWith("-dup")) {
  //     trash_grid.remove(newWidget.el);
  //   }
  // })

  // checks if there it is a block from the source grid and removes it if so
  source_grid.on('dropped', function(event, prevWidget, newWidget) {
    let existingWidgets = source_grid.getGridItems();
    let duplicateFound = existingWidgets.some(widgetElement => {
      let node = widgetElement.gridstackNode;
      return node.id == newWidget.id; 
    });
    if (duplicateFound) {
      source_grid.removeWidget(newWidget.el); 
    }
  });
});
