window.onload = function () {
    paper.install(window);
    var canvas = document.getElementById('canvas');
    paper.setup(canvas);
    var flocks = [];
    var numFlocks = 3;
    var attract = true;
    var count = 0;
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
            flocks[i].update(count * .5);
            count += 1;
        }
    };
    view.onMouseMove = function (event) {
        console.log(event.point);
        for (var i = 0; i < flocks.length; i++) {
            flocks[i].update(count * .5, event.point);
        }
    };
};