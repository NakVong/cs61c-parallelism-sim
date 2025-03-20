$(function() {
  // initialize options
  let opts = {
    dragOut: false,
    acceptWidgets: true,
    dragBetweenGrids: true
  }
  
  // Initialize the first grid
  var grid1 = GridStack.init(opts, '#grid1');
  
  items1 = [
    {content: 'my first widget'}, // widget in first grid
    {w: 2, content: 'another longer widget!'} // widget in first grid]
  ];
  grid1.load(items1);

  // Initialize the second grid
  var grid2 = GridStack.init(opts, '#grid2');
  
  var items2 = [
    {content: 'widget for second grid'},
    {w: 2, content: 'another widget for second grid'}
  ]
  grid2.load(items2);
});
