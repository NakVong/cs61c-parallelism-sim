$(function() {
  $('.example-course-custom-element').append('<p>This text was added by a script.</p>');
  var items = [
    {content: 'my first widget'}, // will default to location (0,0) and 1x1
    {w: 2, content: 'another longer widget!'} // will be placed next at (1,0) and 2x1
  ];

  var items = [
    {content: 'my first widget'}, // will default to location (0,0) and 1x1
    {w: 2, content: 'another longer widget!'} // will be placed next at (1,0) and 2x1
  ];
  var grid = GridStack.init();
  grid.load(items);
})
