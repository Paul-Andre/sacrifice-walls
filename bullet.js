function newBullet(x,y,target, damage) {
  var maxHealth = 100;
  var ret = {
    x: x,
    y: y,
    z: 0,
    target: target,
    damage: damage,
    addSprites: function addSprites(spriteList) {
    },
    drawOverlay: function(ctx) {
      ctx.fillStyle = palette[3];
      ctx.fillRect(this.x,this.y,2,2);
    },
    drawUnderlay: function drawUnderlay(ctx) {
      //ctx.fillStyle = palette[2];
      //ctx.fillRect(this.x-2, this.y, 5, 2);
    },
    tick: function tick(game) {
      var dx = this.target.x - this.x
      var dy = this.target.y - this.y
      if (dx*dx + dy*dy <= 4) {
        this.doDamageToTarget(game, this.target, this.damage);
      } else {
        var a = Math.atan2(dy, dx);
        var ddx = Math.round(Math.cos(a)*3);
        var ddy = Math.round(Math.sin(a)*3);
        this.x += ddx;
        this.y += ddy;
      }
    },
    doDamageToTarget: function(game) {
      takeDamage(game, this.target, this.damage);
      this.die(game);
    },
    die: function die(game) {
      game.remove(this);
    },
  }
  return ret;
}
