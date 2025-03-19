$(function() {
  let opts = {
    dragOut: true, // Allow dragging items out of the grid
    acceptWidgets: true // Allow dropping items from other grids
  };
  let grids = GridStack.initAll(opts); // Initialize all elements with class 'grid-stack'

  // Load items into each grid
  grids[0].load([
    { content: 'init y' },
    { w:3, h:0.5, content: '#pragma omp parallel' },
    { w:1.5, h:0.5,content: 'thread 1' },
    { w:1.5,h:0.5,content: 'thread 2' },
    { w:1.5, h:0.5,content: 'read y' },
    { w:1.5,h:0.5,content: 'ready y' },
    { h:0.5,content: 'y+' },
    { h:0.5,content: 'y-' },
    { h:0.5,content: 'y+' },
    { h:0.5,content: 'y-' },
    { h:0.5,w:1.5, content: 'load y' },
    { h:0.5,w:1.5, content: 'load y' },
  ]);

  grids[1].load([
    { content: 'main' },

  ]);
});
