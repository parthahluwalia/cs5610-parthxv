
function draw() {
    
    var canvas = document.getElementById("rectanglesCanvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect(10, 10, 65, 60);

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect(33, 33, 65, 60);
    }

    //Save and Restore Canvas states
    var ctx2 = document.getElementById("transformCanvas").getContext("2d");

    ctx2.fillRect(0, 0, 150, 150);
    ctx2.save();

    ctx2.fillStyle = "#09F";
    ctx2.fillRect(15, 15, 120, 120);
    ctx2.save();

    ctx2.fillStyle = "#FFF";
    ctx2.globalAlpha = 0.5;
    ctx2.fillRect(30, 30, 90, 90);

    ctx2.restore();
    ctx2.fillRect(45, 45, 60, 60);

    //Translate the objects on Canvas
    var ctx3 = document.getElementById("translateCanvas").getContext("2d");
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            ctx3.save();
            ctx3.fillStyle = 'rgb(' + (51 * i) + ',' + (255 - 51 * i) + ',255)';
            ctx3.translate(10 + j * 50, 10 + i * 50);
            ctx3.fillRect(0, 0, 25, 25);
            ctx3.restore();
        }
    }

}