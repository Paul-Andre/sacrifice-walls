var running =true;

// you know it's not serious if you don't declare dx and dy arrays
var dx = [0,1,0,-1];
var dy = [1,0,-1,0];

function empty(grid, value) {
  var a = []
  for (var i=0; i<grid.length; i++) {
    var aa = [];
    for (var j=0; j<grid[i].length; j++) {
      aa.push(value);
    }
    a.push(aa);
  }
  return a;
}

function shallowCopyGrid(grid) {
  var a = []
  for (var i=0; i<grid.length; i++) {
    var aa = [];
    for (var j=0; j<grid[i].length; j++) {
      aa.push(grid[i][j]);
    }
    a.push(aa);
  }
  return a;
}

/// returns next tile to which to go
/// breadth first search becas
/// target is a structure
function getTo(grid, source, isTarget, cost) {
  var vis = empty(grid, false);
  var costs = empty(grid,  11111111111);
  var prev = shallowCopyGrid(grid);
  var preCosts = []
  for (var i=0; i<grid.length; i++) {
    var aa = []
    for (var j=0; j<grid[i].length; j++) {
      aa.push(cost(grid[i][j]));
    }
    preCosts.push(aa);
  }

  var inQueue = [];
  for (var i=0; i<grid.length; i++) {
    for (var j=0; j<grid[i].length; j++) {
      if (isTarget(grid[i][j])) {
        costs[i][j] = preCosts[i][j];
        inQueue.push(grid[i][j]);
      }
    }
  }
  while (true) {
    // because javscript doesn't have priority queue built in, just visit every possibility
    var minScore = 11111111111;
    var best = null;
    for (var i=0; i<inQueue.length; i++) {
      var e = inQueue[i];
      var s = costs[e.x][e.y];
      if (s < minScore) {
        best = e;
        minScore = s;
      }
    }
    if (best === null) {
      running = false;

    }
    vis[best.x][best.y] = true;
    var tiq = [];
    for (var i=0; i<inQueue.length; i++) {
      if (inQueue[i] != best) {
        tiq.push(inQueue[i]);
      }
    }
    inQueue = tiq;

    if (best == source) {
      return prev[best.x][best.y];
    }

    var perm = [0,1,2,3];
    for (var i=0; i<4-1; i++) {
      var p = Math.floor(Math.random() * (4-i-1)) + i + 1;
      var temp = perm[p];
      perm[p] = perm[i];
      perm[i] = temp;
    }

    for (var k=0; k<4; k++) {
      var xx = best.x + dx[perm[k]];
      var yy = best.y + dy[perm[k]];
      if (xx >= 0 && xx < grid.length && yy >= 0 && yy < grid[xx].length && !vis[xx][yy]) {
        var nc = costs[best.x][best.y] + preCosts[xx][yy];
        if (nc < costs[xx][yy]) {
          prev[xx][yy] = best;
          costs[xx][yy] = nc;
        }
        inQueue.push(grid[xx][yy]);
      }
    }
  }
}

