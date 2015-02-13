$(function () {
    var images = "";
    var count = 50; // 50 thumbnails
    
    for (var i = 1; i <= count; i++) {
        images += '<img src="http://thecodeplayer.com/u/uifaces/' + i + '.jpg" />';
    }

    //Append images to the grid
    $(".grid").append(images);

});