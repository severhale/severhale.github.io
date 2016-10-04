var Particle = function (x, y, dx, dy) {
    var pos = new Point(x, y);
    var vel = new Point(dx, dy);
    var accel = new Point(0, 0);
    var size = 2;
    var thickness = 2;
    var color = 'black';
    var pathType = 0;
    var path;
    if (pathType === 0) {
        path = new Path.Ellipse(x, y, size, thickness);
        path.applyMatrix = false;
        path.rotation = vel.angle;
        path.fillColor = color;
    } else {
        path = new Path();
        path.add(pos.clone());
        path.strokeColor = color;
    }

    var applyForce = function (x, y) {
        accel = accel.add(new Point(x, y));
    }

    var setColor = function (c) {
        color = c;
    }

    // Apply force as if a spring is attached to it at point with spring constant c
    var springTo = function (point, c, l) {
        var force = point.subtract(pos);
        var length = force.length;
        force = force.multiply(c * (length - l) / length);
        applyForce(force);
    }

    var update = function () {
        // apply wind resistance
        accel = accel.add(vel.multiply(-.001 * vel.length));

        vel = vel.add(accel);

        pos = pos.add(vel);
        if (pathType === 0) {
            var speed = vel.length;
            path.position = pos;
            var newSize = Math.min(speed * 2, 25);
            path.rotation = 0;
            path.scale(newSize / path.bounds.width, thickness / path.bounds.height);
            path.rotation = vel.angle;
            path.fillColor = color.add(new Color(.7 * newSize / 25, .7 * newSize / 25, .7 * newSize / 25));

            size = newSize;
        } else {
            path.add(pos.clone());
        }
        accel.length = 0;

    };

    var getPos = function () {
        return pos.clone();
    }

    var getVel = function () {
        return vel.clone();
    }

    var getPath = function () {
        return path;
    }

    var setSize = function (r) {
        thickness = r;
    };

    return {
        getPos: getPos,
        getVel: getVel,
        update: update,
        applyForce: applyForce,
        springTo: springTo,
        getPath: getPath,
        setColor: setColor,
        setSize: setSize,
    };
};