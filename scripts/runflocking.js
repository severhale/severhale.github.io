window.onload = function () {
    paper.install(window);
    var canvas = document.getElementById('canvas');
    paper.setup(canvas);
    var flocks = [];
    var numFlocks = 2;
    var attract = true;
    for (var i = 0; i < numFlocks; i++) {
        var f = new Flock(Math.random() * 50 + 20);
        f.setSize(5);
        flocks.push(f);
    }
    view.onFrame = function (event) {
        for (var i = 0; i < flocks.length; i++) {
            //            for (var j = i + 1; j < flocks.length; j++) {
            //                if (attract) {
            //                    flocks[i].attract(flocks[j]);
            //                } else {
            //                    flocks[i].repel(flocks[j]);
            //                }
            //            }
            flocks[i].update();
        }
    };
    view.onMouseMove = function (event) {
        for (var i = 0; i < flocks.length; i++) {
            flocks[i].update(event.delta);
        }
    };
};