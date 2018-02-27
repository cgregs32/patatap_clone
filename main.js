var circles = [];
function onKeyDown(e){
  if (keyData[e.key]){
    var maxPoint = new Point(view.size.width, view.size.height)
    var randomPoint = Point.random()
    var point = maxPoint * randomPoint
    var newCircle = new Path.Circle(point, 100)
    newCircle.fillColor = keyData[event.key].color
    keyData[event.key].sound.play()
    circles.push(newCircle);
  }
}

function onFrame(event){
  for(var i = 0; i < circles.length; i++){
    circles[i].scale(0.9);
    circles[i].fillColor.hue += 1;
    if(circles[i].area < 1){
      circles[i].remove();
      circles.splice(i, 1);
      i--;
    }
  }
}
