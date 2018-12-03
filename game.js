var initialMap = [
    "                        ",
  "                        ",
  "        #  ##  ###      ",
  "     ##       #   #     ",
  "    #     ####  #  #    ",
  "    # #  #     #    #   ",
  "   #  # #     #  ## #   ",
  "     #  #  cc  #   #    ",
  "    #  #   cc   #   #   ",
  "    # #       # # # #   ",
  "   #  #  #    # # # #   ",
  "   #   #  ####  # # #   ",
  "    #  #     # #  # #   ",
  "     #  ##  ##   #  #   ",
  "   #  #    #  ###  #    ",
  "    #  ####             ",
  "                        ",
  "                        ",
];


function draw(ctx) {
  this.calaculateMouseCell();

  ctx.fillStyle = palette[5];
  ctx.fillRect(0,0,240,168);
  ctx.fillStyle = palette[2];
  ctx.save();
  ctx.translate(-12*2, -12*2);
  ctx.fillRect(this.mouseCellX*12, this.mouseCellY*12, 12,12);

  for (var i=0; i<this.entities.length; i++) {
    this.entities[i].drawUnderlay(ctx);
  }

  sprites = []

  for (var i=0; i<this.entities.length; i++) {
    this.entities[i].addSprites(sprites);
  }
  sprites.sort(function(a,b) {return a.zIndex - b.zIndex});
  for (var i=0; i<sprites.length; i++) {
    var s = sprites[i];
    ctx.drawImage(s.image, s.sx, s.sy, s.sw, s.sh, s.dx, s.dy, s.sw, s.sh);
  }
  for (var i=0; i<this.entities.length; i++) {
    this.entities[i].drawOverlay(ctx);
  }
  ctx.restore();
  this.ui.updateUi(this);

  if (this.state == "gameOver") {
    ctx.drawImage(loaded.gameOver, 120-75, 168-26);
  }
}


var mineAction = {
  validate: function validate(x,y,game) {
    if (game.grid[x][y].structure != null &&
      typeof (game.grid[x][y].structure.beingExploited) != "undefined" &&
      game.grid[x][y].structure.beingExploited === false) {
      return true;
    }
    return false;
  },
  click: function validate(x,y,game) {
    game.grid[x][y].structure.beingExploited = true;
  }
}

var mineAction = {
  validate: function validate(x,y,game) {
    if (game.grid[x][y].structure != null &&
      typeof (game.grid[x][y].structure.beingExploited) != "undefined" &&
      game.grid[x][y].structure.beingExploited === false) {
      return [true, ""];
    }
    return [false, ""];
  },
  click: function validate(x,y,game) {
    game.grid[x][y].structure.beingExploited = true;
  }
}

var editRockAction = {
  validate: function validate(x,y,game) {
    return [true,""];
  },
  click: function validate(x,y,game) {
    if (game.grid[x][y].structure == null) {
        var rock = newRock(x, y);
        var tile = game.grid[x][y];
        tile.structure = rock;
        rock.tile = tile;
        game.entities.push(rock);
    } else {
      game.grid[x][y].structure.die(game);
    }
  }
}

var placeSmallTower = {
  cost: 150,
  validate: function validate(x,y,game) {
    if (game.bricks < this.cost) return [false, "Not enough bricks"];
    if (!(game.grid[x][y].structure == null && game.grid[x][y].person == null))
      return [false, "Cannot place there"];
    return [true, ""];
  },
  click: function validate(x,y,game) {
    var rock = newTower(x, y);
    var tile = game.grid[x][y];
    tile.structure = rock;
    rock.tile = tile;
    game.entities.push(rock);
    game.bricks -= this.cost;
  }
}

var placeBigTower = {
  cost: 350,
  validate: function validate(x,y,game) {
    if (game.bricks < this.cost) return [false, "Not enough bricks"];
    if (!(game.grid[x][y].structure == null && game.grid[x][y].person == null))
      return [false, "Cannot place there"];
    return [true, ""];
  },
  click: function validate(x,y,game) {
    var rock = newTower(x, y);
    var tile = game.grid[x][y];
    tile.structure = rock;
    rock.tile = tile;
    rock.range = 70;
    rock.image = loaded.tower2;
    game.entities.push(rock);
    game.bricks -= this.cost;
  }
}

function onclick() {
  this.calaculateMouseCell();
  if (this.ui.action.validate(this.mouseCellX, this.mouseCellY, this)[0]) {
    this.ui.action.click(this.mouseCellX, this.mouseCellY, this);
  }
}

function calaculateMouseCell() {
  this.mouseCellX = Math.floor(this.mouseX/12)+2;
  this.mouseCellY = Math.floor(this.mouseY/12)+2;
}

function newUiHandler() {
  var someTextDiv = document.getElementById("someText");
  var mineButton = document.getElementById("mineButton");
  var smallTowerButton = document.getElementById("smallTowerButton");
  var bigTowerButton = document.getElementById("bigTowerButton");
  //var editRockButton = document.getElementById("editRock");

  var ret = {
    bricks: 0,
    castleHealth: 0,
    someTextDiv: someTextDiv,
    action: mineAction,
    activeButton: mineButton,
    updateUi: function(game) {
      //if (this.bricks != game.bricks) {
        this.bricks = game.bricks;
        this.someTextDiv.innerText = ("Bricks: " + this.bricks + 
          "   Waves: " + game.waves.adv + 
          "/" + game.waves.tot + "  Next Wave: " + Math.ceil(game.waves.current.wait/24));
      //}
    },
  }

  function k(b,a) {
    b.onclick = function() {
      ret.activeButton.className = "";
      ret.action = a;
      ret.activeButton = b;
      b.className = "activeButton";
    };
  };

  k(mineButton, mineAction);
  k(smallTowerButton, placeSmallTower);
  k(bigTowerButton, placeBigTower);
  //k(editRockButton, editRockAction);

  return ret;

}



function tick() {
  if (!running) return;
  if (this.state != "running") return;
  for (var i=0; i<this.entities.length; i++) {
    var e = this.entities[i];
    e.tick(this);
  }
  this.waves.tick(this);
  this.elapsedTicks++;
}

var ui = null;

function newGame() {
  if (ui === null) ui = newUiHandler();
  var grid = [];
  var entities = [];
  for (var i=0; i<18+6; i++) {
    grid[i]=[];
    for (var j=0; j<12+6; j++) {
      grid[i][j] = null; // oh good lord
    }
  }

  var castle = {
    x: 0,
    y: 0,
    z: 0,
    health: 1000,
    maxHealth: 1000,
    addSprites: function addSprites(spriteList) {
      spriteList.push({
        sx: 0,
        sy: 0,
        sw: 24,
        sh: 30,
        dx: Math.floor(this.x)-12,
        dy: Math.floor(this.y)-18,
        zIndex: this.y-7,
        image: loaded.castle,
      });
    },
    drawOverlay: function(ctx) {
      if (this.health != this.maxHealth) {
        ctx.fillStyle = palette[8];
        var r = Math.ceil(15*this.health/this.maxHealth);
        ctx.fillRect(this.x-8, this.y-12, r, 2);
      }
    },
    drawUnderlay: function drawUnderlay(ctx) {
    },
    tick: function tick() {
    },
    die: function die(game) {
      game.gameOver();
    }
  };

  entities.push(castle);

  for (var i=0; i<initialMap[0].length; i++) {
    for (var j=0; j<initialMap.length; j++) {
      if (initialMap[j][i] == '#') {
        var rock = newRock(i, j);
        var tile = newTile(i, j, rock);
        rock.tile = tile;
        grid[i][j] = tile;
        entities.push(rock);
      } else if (initialMap[j][i] == 'c') {
        castle.x += i;
        castle.y += j;
        var tile = newTile(i, j, castle);
        grid[i][j] = tile;
      }
    }
  }

  castle.x*=12/4;
  castle.y*=12/4;
  castle.x += 6;
  castle.y += 6;

  for (var i=0; i<18+6; i++) {
    for (var j=0; j<12+6; j++) {
      if (grid[i][j] == null) {
        var tile = newTile(i, j, null);
        grid[i][j] = tile;
      }
    }
  }

  return {
    mouseX: 10,
    mouseY: 10,
    mouseCellX: 0,
    mouseCellY: 0,
    entities: entities,
    elapsedTicks: 0,
    grid: grid,
    castle: castle,
    ui: ui,
    state: "running",

    bricks: 200,

    waves: newWaves(),

    // methods:
    draw: draw,
    onclick: onclick,
    calaculateMouseCell: calaculateMouseCell,
    tick: tick,
    remove: function remove(entity) {
      var pos = this.entities.indexOf(entity);
      if (pos != -1) {
        this.entities.splice(pos, 1);
      }
    },
    gameOver: function() {
      this.state = "gameOver";
    },
    printMap: function() {
      var grid = this.grid;
      ret = '  ';
      for (var j=0; j<this.grid[0].length; j++) {
        ret += '"'
        for (var i=0; i<this.grid.length; i++) {
          if (grid[i][j].structure) {
            if (grid[i][j].structure.type == 'rock') {
              ret += '#';
            } else if (grid[i][j].structure == this.castle) {
              ret += 'c';
            }
          } else {
              ret += ' ';
          }
        }
        ret += '",\n'
      }
    return ret;
    },

  };
}



