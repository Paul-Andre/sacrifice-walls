var registerLoaderOnLoadedCallback;
var loaded = {};
var finishedLoading = false;

(function() {
  var toLoad = {
    rock: "rock.png",
    rock2: "rock2.png",
    guy: "guy.png",
    castle: "castle.png",
    gameOver: "gameOver.png",
    tower: "tower.png",
    tower2: "tower2.png",
  }

  var loadingCount = 0;
  var doneCount = 0;

  var callbacks = [];

  function callCallbacks() {
    for (var i=0; i<callbacks.length; i++) {
      callbacks[i](loaded);
    }
    finishedLoading = true;
  }

  for( n in toLoad) {
    var img = new Image();
    img.src = toLoad[n];
    loadingCount ++;
    loaded[n] = img;
    img.onload = function() {
      doneCount --;
      if (loadingCount == doneCount) callCallbacks();

    }
  }

  function registerCallback(f) {
    if (loadingCount != 0 && loadingCount == doneCount) {
      f(loaded);
    } else {
      callCallbacks.push(f);
    }
  }
  registerLoaderOnLoadedCallback = registerCallback;

})();
