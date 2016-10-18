function drawPyramids(width, height, canvas) {

  var context = canvas.getContext("2d"),
      scalar = 5;

  var isocontext = isometric(context);
  isocontext.scale3d(30, 30, 30);

  context.save();
  context.clearRect(0, 0, width, height);

  context.translate(width / 2, height / 2);
  for (var x = 10, d; x >= -20; --x) {
    for (var y = 10; y >= -10; --y) {
      if ((d = distanceManhattan(x, y)) > 17) continue;
      var te = d3_ease.easeCubic(1);
      var f = 'rgb(' + (80 + 6*x) + "," + 8*Math.abs(y) + ",90)";
      drawCube((d & 1 ? -1 : +1) * (Math.PI / 4 - te * Math.PI / 2), f, x * scalar, y * scalar, -3 * scalar * te + 2 * scalar * Math.pow(te, 2));
    }
  }
  var elapsed = 0, 
  timer = d3.timer(function(elapsed) {return false;});

  var bouncing = bounce(); 

  window.addEventListener('scroll', function() { if (!bouncing) {return bounce();} });

  var iter=1;

  function bounce() {
    iter++;
    context.restore();
    timer.restart(function(elapsed) {
      // console.log(elapsed);
      context.save();
      context.fillStyle = "#fff";
      context.clearRect(0, 0, width, height);
      context.translate(width / 2, height / 2);
      for (var x=10, d, t = (elapsed / 2500); x >= -10; --x) {
        for (var y = 10; y >= -10; --y) {
          if ((d = distanceManhattan(x, y)) > 17) continue;
          var te = d3_ease.easeCubic(Math.max(0, Math.min(1, t * 3.8 - distanceCartesian(x, y) / 4)));
          var f = 'rgb(' + (100 + 30*(x+iter)) + "," + 20*Math.abs(y+iter) + "," + (5*(y+iter)*(x+iter)) + ")";
          drawCube((d & 1 ? -1 : +1) * (Math.PI / 4 - te * Math.PI / 2), f, x * scalar, y * scalar, -3 * scalar * te + 2 * scalar * Math.pow(te, 2));
        }
      }
      context.restore();
      if (elapsed > 2500) { bouncing = false; timer.stop(); } else { bouncing = true; }
    }, 0);
    return true;
  }

  function distanceCartesian(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  function distanceManhattan(x, y) {
    return Math.abs(x) + Math.abs(y);
  }

  function drawCube(angle, fill, x, y, z) {

  // isometric coordinate system:
  // +y  \/  +x
  // -x  /\  -y

    if ((angle %= Math.PI / 2) < 0) angle += Math.PI / 2;
    isocontext.save();
    isocontext.translate3d(x, y, z);
    isocontext.rotateZ(angle - Math.PI / 4);

    context.fillStyle = fill;
    context.beginPath();
    isocontext.moveTo(+1.5, -1.5, -1.5);
    isocontext.lineTo(-0.0, +0.0, +1.5);  // top vertex
    isocontext.lineTo(-1.5, +1.5, -1.5); 
    isocontext.lineTo(-1.5, -1.5, -1.5);  

    isocontext.closePath();
    context.fill();
    context.lineWidth = 1.5;
    context.stroke();

    context.beginPath();
    isocontext.moveTo(-1.5, -1.5, -1.5);
    isocontext.lineTo(-0.0, +0.0, +1.5);  // top vertex



    context.lineWidth = 0.75;
    context.stroke();

    isocontext.restore();
  }
}