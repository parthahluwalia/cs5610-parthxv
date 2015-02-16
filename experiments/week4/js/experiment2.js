$(function () {
    $("#getTvShow").click(function () {
        var title = $("#title").val();

        $.ajax({
            url: "http://api.tvmaze.com/search/shows?q=" + title,
            datatype: "json",
            success: renderTVShows
        });
    });

    $("#prevResults").click(load);
    
});

var renderTVShows = function (tvShows) {
    
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
        if(tvShow.show.image) {
            var image = tvShow.show.image.medium;
        }
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

    //Save the results in Local Storage
    save();
};

function save() {
    var allLis = $("li");
    var lis = [];
    
    allLis.each(function (index, item) {
        var li = $(item);
        var text = li.text();
        //console.log(value);
        var liObj = {
            text: text
        };
        lis.push(liObj);
    });
    liStr = JSON.stringify(lis);
    localStorage.setItem("page", liStr);
    
}

function load() {
    console.log("entry point load");
    var page = localStorage.getItem("page");
    if (page == null)
        return;
    page = JSON.parse(page);
    console.log(page);
    for (var i in page) {
        var li = page[i];
        var text = li.text;
        
        var ul = $("#tvSeries");
        ul.empty();

        var li = $("<li>")
                    .append(text)
                    .appendTo(ul);
    }
}