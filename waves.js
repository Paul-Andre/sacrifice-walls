

function tl(g) {return g[2][1]};
function tr(g) {return g[1][12+3]};
function bl(g) {return g[18][1]};
function br(g) {return g[18][12+4]};

function mw(corner, w, count) {
  return {wait: w,
    turnUp: function(game) {
      for (var i=0; i<count; i++) {
        game.entities.push(newEnemy(corner(game.grid)));
      }
    },
  }
}


function newWaves() {
  var et =  {
    adv: 0,
    current : {wait: 15 * 24,
      turnUp: function(game) {
        for (var i=0; i<3; i++) {
          game.entities.push(newEnemy(tl(game.grid)));
        }
      },
    },
    waves: [
      mw(br, 25, 3),
      mw(tr, 25, 3),
      mw(bl, 25, 3),
      mw(tr, 30, 5),
      mw(br, 30, 5),
      mw(tl, 30, 10),
      mw(br, 45, 10),
      mw(br, 45, 25),
    ],
    tick: function(game) {
      if (this.current.wait == 0) {
        this.current.turnUp(game);
        this.adv ++;
        if (this.waves.length != 0) {
          this.current = this.waves[0];
          this.waves.shift();
          this.current.wait *= 24;
        } 
        console.log(this.current);
      }
      this.current.wait --;
    }
  }
  et.tot = et.waves.length + 1;
  return et;
}
