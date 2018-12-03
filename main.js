

var game;

function main() {
  var canvas = document.getElementById("gameCanvas")
  var ctx = canvas.getContext("2d")
  game = newGame()
  game.draw(ctx)
  console.log(canvas.width, canvas.height);

  canvas.addEventListener("mousemove", function(evt) {
    var rect = canvas.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    game.mouseX = x * canvas.width / rect.width;
    game.mouseY = y * canvas.height / rect.height;
    
  }, false);

  canvas.addEventListener("click", function(evt) {
    var rect = canvas.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    game.mouseX = x * canvas.width / rect.width;
    game.mouseY = y * canvas.height / rect.height;
    
    game.onclick();
  }, false);

  
  var dirty = true;
  setInterval(function() {
    game.tick();
    dirty = true;
  }, 1000/24);

  function drawNext(timestamp) {
    if (dirty) {
      game.draw(ctx);
      dirty = false;
    }
    window.requestAnimationFrame(drawNext);
  }

  drawNext();


}
