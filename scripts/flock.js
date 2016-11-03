// size: number of particles
var Flock = function (size) {
    var particles = [];
    var springs = [];
    var targetSeed = Math.random() * 255;
    var seed = Math.random() * 255;
    var target = new Point(noise.perlin2(targetSeed, 0) * view.size.width, noise.perlin2(targetSeed + 128, 128) * view.size.height);
    //    var speed = .003;
    var speed = .0045;
    var color = new Color(Math.random() * .6, Math.random() * .6, Math.random() * .6);
    for (var i = 0; i < size; i++) {
        var p = new Particle(Math.random() * view.size.width, Math.random() * view.size.height, 0, 0);
        p.setColor(color.add(new Color(Math.random() * .2 - .1, Math.random() * .2 - .1, Math.random() * .2 - .1)));
        particles.push(p);
        springs.push({
            c: Math.random() * .007 + .002,
            l: Math.random() * 40 + 10,
        });
    }

    var repelRadius = 50;
    var grid = [];
    var initGrid = function () {
        for (var i = 0; i < view.size.width / repelRadius + 1; i++) {
            var col = [];
            for (var j = 0; j < view.size.height / repelRadius + 1; j++) {
                col.push([]);
            }
            grid.push(col);
        }
    }

    var getGridEntry = function (pos) {
        var col = grid[Math.floor(pos.x / repelRadius)];
        if (col) {
            return col[Math.floor(pos.y / repelRadius)] || [];
        } else {
            return [];
        }
    }

    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        getGridEntry(p.getPos()).push(p);
    }

    var getGridEntryFromIndex = function (i, j) {
        if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
            return grid[i][j];
        } else {
            return [];
        }
    }

    var gridIndex = function (pos) {
        return [Math.floor(pos.x / repelRadius), Math.floor(pos.y / repelRadius)];
    }

    var particlesNear = function (pos) {
        //        var i0 = Math.floor(pos.x / repelRadius);
        //        var j0 = Math.floor(pos.y / repelRadius);
        //        var results = [];
        //        for (var i = i0 - 1; i <= i0 + 1; i++) {
        //            for (var j = j0 - 1; j <= j0 + 1; j++) {
        //                //                results = results.concat(getGridEntryFromIndex(i, j));
        //                results = results.concat(getGridEntryFromIndex(i, j).filter(function (item) {
        //                    return pos.getDistance(item.getPos()) <= repelRadius;
        //                }));
        //            }
        //        }
        //        return results;
        return particles.filter(function (item) {
            return pos.getDistance(item.getPos()) <= repelRadius;
        });
    }

    // apply repelling forces to particles and this and the other flock wherever relevant
    var repel = function (flock) {
        interact(flock, 1, .05, true);
    }

    var attract = function (flock) {
        interact(flock, -1, .012, false);
    }

    var interact = function (flock, sign, c, symmetric) {
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            var repelling = flock.particlesNear(p.getPos());
            for (var j = 0; j < repelling.length; j++) {
                q = repelling[j];
                var posP = p.getPos();
                var posQ = q.getPos();
                var dist = posP.getDistance(posQ);
                var force = posP.subtract(posQ);
                force = force.normalize(1 / Math.max((c * dist * dist), 1));
                p.applyForce(force.multiply(sign));
                if (symmetric) {
                    q.applyForce(force.multiply(-sign));
                }
            }
        }
    }

    var repelPoint = function (point) {
        var repelling = particlesNear(point);
        for (var i = 0; i < repelling.length; i++) {
            var p = repelling[i];
            var posP = p.getPos();
            var dist = point.getDistance(posP);
            var force = posP.subtract(point);
            force = force.normalize(1 / (.001 * dist * dist));
            //            force = force.divide(Math.pow(Math.max(dist * .15, .01), 3));
            p.applyForce(force);
        }
    }

    var update = function (delta = null) {
        //        initGrid();
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            //            var oldGrid = gridIndex(p.getPos());
            var posP = p.getPos();
            var x0 = Math.floor(posP.x / repelRadius);
            var y0 = Math.floor(posP.y / repelRadius);
            p.springTo(target, springs[i].c, springs[i].l);
            var v = p.getVel();
            var perpForce = new Point(-v.y, v.x);
            perpForce = perpForce.multiply(.0075 * Math.sin(.1 * seed + .1 * i));
            p.applyForce(perpForce)
            p.update();

            //            getGridEntry(p.getPos()).push(p);
            var x1 = Math.floor(posP.x / repelRadius);
            var y1 = Math.floor(posP.y / repelRadius);
            if ((x0 != x1) || (y0 != y1)) {
                var oldEntry = getGridEntryFromIndex(x0, y0);
                if (oldEntry.length > 0) {
                    oldEntry.splice(oldEntry.indexOf(p));
                }
                getGridEntryFromIndex(x1, y1).push(p);
            }
            //            var newGrid = gridIndex(p.getPos());
            //            if (oldGrid[0] != newGrid[0] || oldGrid[1] != newGrid[1]) {
            //                var oldEntry = getGridEntryFromIndex(oldGrid);
            //                if (oldEntry.length > 0) {
            //                    oldEntry.splice(oldEntry.indexOf(p));
            //                }
            //                var newEntry = getGridEntryFromIndex(newGrid);
            //                newEntry.push(p);
            //            }
        }
        target.x = (noise.perlin2(targetSeed, seed) + .5) * view.size.width;
        target.y = (noise.perlin2(targetSeed + 128, seed + 128) + .5) * view.size.height;
        if (delta === null) {
            seed += speed;
        } else {
            var deltaSpeed = delta.length;
            seed += speed * deltaSpeed / 10;
        }
    };

    var setSize = function (r) {
        for (var i = 0; i < particles.length; i++) {
            particles[i].setSize(r);
        }
    }

    var getGrid = function () {
        return grid;
    }

    return {
        update: update,
        setSize: setSize,
        particlesNear: particlesNear,
        repel: repel,
        attract: attract,
        repelPoint: repelPoint,
        grid: getGrid,
        gridIndex: gridIndex,
    };
}