function takeDamage(game, entity, damage) {
  entity.health -= damage;
  if (entity.health <= 0) {
    entity.die(game);
    if (entity.tile) {
      entity.tile.structure = null;
    }
    if (entity.occupying) {
      entity.occupying.person = null;
    }
  }
}

function removeFromGame(game, entity) {
  var pos = game.entities.indexOf(entity);
  if (pos != -1) {
    game.entities.splice(pos, 1);
  }
}

function standardHealthOverlay(ctx) {
  if (this.health != this.maxHealth) {
    ctx.fillStyle = palette[8];
    var r = Math.ceil(7*this.health/this.maxHealth);
    ctx.fillRect(this.x-4, this.y-7, r, 1);
  }
}

