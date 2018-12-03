function newEnemy(cell) {
  var maxHealth = 100;
  var ret = {
    x: cell.x*12 + 6,
    y: cell.y*12 + 6,
    z: 0,
    goingTo: cell,
    occupying: cell,
    health: maxHealth,
    maxHealth: maxHealth,
    attacking: false,
    damage: 5,
    type: "enemy",
    addSprites: function addSprites(spriteList) {
      spriteList.push({
        sx: 0,
        sy: 0,
        sw: 12,
        sh: 12,
        dx: Math.floor(this.x)-6,
        dy: Math.floor(this.y)-10,
        zIndex: this.y,
        image: loaded.guy,
      })
    },
    drawOverlay: standardHealthOverlay,
    drawUnderlay: function drawUnderlay(ctx) {
      //ctx.fillStyle = palette[2];
      //ctx.fillRect(this.x-2, this.y, 5, 2);
    },
    tick: function tick(game) {
      if (this.goingTo.structure === null) {
        var tx = this.goingTo.x*12 + 6;
        var ty = this.goingTo.y*12 + 6;
        if (this.x == tx && this.y == ty) {
          this.recalculatePath(game);
        }
        if (this.x > tx) this.x-=1;
        if (this.x < tx) this.x+=1;
        if (this.y > ty) this.y-=1;
        if (this.y < ty) this.y+=1;
      } else {
        var tx = this.goingTo.x*12 + 6;
        var ty = this.goingTo.y*12 + 6;

        if (this.x > tx + 7) this.x-=2;
        else if (this.x < tx - 7) this.x+=2;
        else if (this.y > ty + 7) this.y-=2;
        else if (this.y < ty - 7) this.y+=2;
        else {
          if (this.goingTo.structure != null) {
            takeDamage(game, this.goingTo.structure, this.damage);
          }
          this.goingTo = this.occupying;
        }

        //if (this.x == tx && this.y == ty) {
          //this.recalculatePath(game);
        //}
      }
    },
    recalculatePath: function(game) {
      var d = this.damage;
      var inst = getTo(game.grid, this.goingTo, 
        function(tile) {
          return tile.structure == game.castle;
        },
        function(tile) {
          var c = 0;
          if (tile.structure === game.castle) {}
          else if (tile.structure !== null) {
            c += tile.structure.health/d;
            if (tile.structure.type == 'rock') c += 20;
          }
          if (tile.person !== null) {
              c += 0.1;
            if (tile.person.attacking) {
              c += 100;
            }
          }
          else c+=1;
          return c;
        }
      );

      if (inst.person === null) {
        this.goingTo = inst;
        if (inst.structure === null) {
          this.occupying.person = null;
          inst.person = this;
          this.occupying = inst;
          this.attacking = false;
        } else {
          this.attacking = true;
        }
      }
    },
    die: function die(game) {
      this.occupying.person = null;
      game.remove(this);
    },
  }
  cell.person = ret;
  return ret;
}
