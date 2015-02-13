$(function () {
    var images = "";
    var count = 50; // 50 thumbnails
    
    for (var i = 1; i <= count; i++) {
        images += '<img src="http://thecodeplayer.com/u/uifaces/' + i + '.jpg" />';
    }

    //Append images to the grid
    $(".grid").append(images);

    var d = 0; //delay
    var ry, tz, s; //transform params

    //animation time
    $(".animate").on("click", function(){
        //fading out the thumbnails with style
        $("img").each(function(){
            d = Math.random()*1000; //1ms to 1000ms delay
            $(this).delay(d).animate({opacity: 0}, {
                //while the thumbnails are fading out, we will use the step function to apply some transforms. variable n will give the current opacity in the animation.
                step: function(n){
                    s = 1-n; //scale - will animate from 0 to 1
                    $(this).css("transform", "scale("+s+")");
                }, 
                duration: 1000, 
            })
        }).promise().done(function(){
            //after *promising* and *doing* the fadeout animation we will bring the images back
            storm();
        })
    })
    //bringing back the images with style
    function storm() {
        $("img").each(function () {
            d = Math.random() * 1000;
            $(this).delay(d).animate({ opacity: 1 }, {
                step: function (n) {
                    //rotating the images on the Y axis from 360deg to 0deg
                    ry = (1 - n) * 360;
                    //translating the images from 1000px to 0px
                    tz = (1 - n) * 1000;
                    //applying the transformation
                    $(this).css("transform", "rotateY(" + ry + "deg) translateZ(" + tz + "px)");
                },
                duration: 3000,
                //Some easing fun. Comes from jquery easing plugin
                easing: 'easeOutQuint',
            })
        })
    }

});