$(function () {
    $("#getTvShow").click(function () {
        var title = $("#title").val();

        $.ajax({
            url: "http://api.tvmaze.com/search/shows?q=" + title,
            datatype: "json",
            success: renderTVShows,
            error : function (err) {
                console.log("error!!!!");
            }
        });
    });
    
});

var renderTVShows = function (tvShows) {
    
    console.log(tvShows);

    var ul = $("#tvSeries");
    ul.empty();

    for (var i in tvShows) {
        var tvShow = tvShows[i];
        //console.log(tvShow);
        var name = tvShow.show.name;
        var titleLink = $("<a>")
                            .attr("href", tvShow.show.url)
                            .text(name)
                            .addClass("btn-link btn-lg");
        var network = " | Network: " + tvShow.show.network.name;
        var premiered = "Premiered: " + tvShow.show.premiered;
        var image = tvShow.show.image.medium;
        var summary = tvShow.show.summary;
        var rating = " (Rating: " + tvShow.score + ")";
        //console.log(name);

        var li = $("<li>")
                    .append(titleLink)
                    .append(rating);

        $("<p>")
            .append($("<img>")
                        .attr("src", image))
            .appendTo(li);
        
        $("<p>")
            .append(premiered)
            .append(network)
            .appendTo(li);

        $("<p>")
            .append(summary)
            .appendTo(li);

        ul.append(li);

    }
};