$(function() {
  let options = {
    dragOut: true, // Allow dragging items out of the grid
    acceptWidgets: true, // Allow dropping items from other grids
    float: true, // Freeform (without this it tries to minimize free space)
  };
  let grids = GridStack.initAll(options); // Initialize all elements with class 'grid-stack'

  // Load items into each grid
  grids[0].load([
    { w:2, h:0.5, content: 'init y'},
    { w:2, h:0.5, content: '#pragma omp parallel' },
    { w:2, h:0.5, content: 'thread 1' },
    { w:2, h:0.5, content: 'thread 2' },
    { w:2, h:0.5, content: 'read y' },
    { w:2, h:0.5, content: 'ready y' },
    { w:2, h:0.5, content: 'y+' },
    { w:2, h:0.5, content: 'y-' },
    { w:2, h:0.5, content: 'y+' },
    { w:2, h:0.5, content: 'y-' },
    { w:2, h:0.5, content: 'load y' },
    { w:2, h:0.5, content: 'load y' },
  ]);

  grids[1].load([
    { w:2, h:0.5, content: 'main' },

  ]);
});
