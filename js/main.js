var mousePos = view.center + [view.bounds.width / 3, 100];
var position = view.center;

function onFrame(event) {
  position += (mousePos - position) / 10;
  var vector = (view.center - position) / 10;
  moveStars(vector * 3);
  handleShapeAnimate();
}

function onMouseMove(event) {
  mousePos = event.point;
}

var moveStars = new function() {
  var count = 50;

  var path = new Path.Circle({
    center: [0, 0],
    radius: 5,
    fillColor: 'white',
    strokeColor: 'black'
  });

  var symbol = new Symbol(path);

  for (var i = 0; i < count; i++) {
    var center = Point.random() * view.size;
    var placed = symbol.place(center);
    placed.scale(i / count + 0.01);
    placed.data = {
      vector: new Point({
        angle: Math.random() * 360,
        length: i / count * Math.random() / 5
      })
    };
  }

  var vector = new Point({
    angle: 45,
    length: 0
  });

  function keepInView(item) {
    var position = item.position;
    var viewBounds = view.bounds;
    if (position.isInside(viewBounds)) return;
    var itemBounds = item.bounds;
    if (position.x > viewBounds.width + 5) {
      position.x = -item.bounds.width;
    }

    if (position.x < -itemBounds.width - 5) {
      position.x = viewBounds.width;
    }

    if (position.y > viewBounds.height + 5) {
      position.y = -itemBounds.height;
    }

    if (position.y < -itemBounds.height - 5) {
      position.y = viewBounds.height;
    }
  }

  return function(vector) {
    var layer = project.activeLayer;
    for (var i = 0; i < count; i++) {
      var item = layer.children[i];
      var size = item.bounds.size;
      var length = vector.length / 10 * size.width / 10;
      item.position += vector.normalize(length) + item.data.vector;
      keepInView(item);
    }
  };
}();

var shapes = [];

function randomShape(point, key) {
  var SIZE = 500;
  var newShapes = [];
  var points = Math.round(Math.random() * 12);
  newShapes.push(new Path.Star(point, points, 25, SIZE));
  newShapes.push(new Path.Circle(point, SIZE));
  newShapes.push(new Path.RegularPolygon(point, points, SIZE));
  var selectedShape = newShapes[Math.floor(Math.random() * newShapes.length)];
  selectedShape.fillColor = key.color;
  return selectedShape;
}

function onKeyDown(e) {
  if (keyData[e.key]) {
    var maxPoint = new Point(view.size.width, view.size.height);
    var randomPoint = Point.random();
    var point = maxPoint * randomPoint;
    var shape = randomShape(point, keyData[e.key]);
    keyData[event.key].sound.play();
    shapes.push(shape);
  }
}

function handleShapeAnimate(event) {
  var positive = Math.random() < 0.5 ? -1 : 1
  for (var i = 0; i < shapes.length; i++) {
    var inc =  Math.random() * positive
		for (var x = 1; x < 15; x++) {
			shapes[i].position += inc
		}

    shapes[i].scale(0.9);
    shapes[i].fillColor.hue += 1;
    if (shapes[i].area < 1) {
      shapes[i].remove();
      shapes.splice(i, 1);
      i--;
    }
  }
}
