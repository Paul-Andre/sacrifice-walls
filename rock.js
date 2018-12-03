function newRock(gridX, gridY) {
  var maxHealth = 500;
  return {
    x: gridX*12 + 6,
    y: gridY*12 + 6,
    health: maxHealth,
    maxHealth: maxHealth,
    beingExploited: false,
    exploitation: 0,
    fullExploitation: 50,
    type: "rock",
    tile: null,

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
        image: loaded.rock2,
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
      //ctx.fillStyle = palette[2];
      //ctx.fillRect(this.x-2, this.y, 5, 2);
    },

    die: function die(game) {
      this.tile.structure = null;
      game.remove(this);
    },

    tick: function tick(game) {
      if (this.beingExploited) {
        this.exploitation += 1;
      }
      if (this.exploitation >= this.fullExploitation) {
        game.bricks += Math.floor(this.health/5);
        this.die(game);
      }
    },
  }
}
