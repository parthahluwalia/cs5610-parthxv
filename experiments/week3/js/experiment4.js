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
        })
    })
    
});