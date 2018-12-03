

function newTower(gridX, gridY) {
  var maxHealth = 100;
  return {
    x: gridX*12 + 6,
    y: gridY*12 + 6,
    health: maxHealth,
    maxHealth: maxHealth,
    type: "tower",
    tile: null,
    image: loaded.tower,

    range: 35,
    damage: 25,
    maxCooldown: 12,
    cooldown: 12,

    // methods:
    addSprites: function addSprites(spriteList) {
      spriteList.push({
        sx: 0,
        sy: 0,
        sw: 12,
        sh: 16,
        dx: Math.floor(this.x)-6,
        dy: Math.floor(this.y)-10,
        zIndex: this.y-1,
        image: this.image,
      })
    },
    drawOverlay: function drawOverlay(ctx) {
      standardHealthOverlay.call(this, ctx);
      if (this.beingExploited) {
        ctx.fillStyle = palette[13];
        var r = Math.ceil(7*(1-this.exploitation/this.fullExploitation));
        ctx.fillRect(this.x-4, this.y-5, r, 1);
      }
    },
    drawUnderlay: function drawUnderlay(ctx) {
    },

    die: function die(game) {
      this.tile.structure = null;
      game.remove(this);
    },

    tick: function tick(game) {
      if (this.cooldown == 0) {
        this.findTarget(game);
        this.cooldown = this.maxCooldown;
      }
      this.cooldown --;
    },
    findTarget: function(game) {
      var ee = null;
      var ss = 1231231231;
      for (var i=0; i<game.entities.length; i++) {
        var e = game.entities[i];
        if (e.type != "enemy") continue;
        var dx = e.x - this.x
        var dy = e.y - this.y
        var s = dx*dx + dy*dy;
        if (s < ss) {
          ss = s;
          ee = e;
        }
      }
      if (ee != null && ss <= this.range*this.range) {
        game.entities.push(newBullet(this.x, this.y, ee, this.damage));
      }
    }
  }
}
