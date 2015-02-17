var app = angular.module("TVShowsApp", []);

app.controller("TVShowsController", function ($scope, $http) {

    $scope.searchTVShows = function () {
        var title = $scope.searchByTitle;
        $http.get("http://api.tvmaze.com/search/shows?q=" + title)
            .success(function (response) {
                console.log(response);
                $scope.tvShows = response;
            })
            .error(function (data) {
                console.log("Error while sending request");
            });
    };

    $scope.addTVShow = function () {
        var rating = { average: $scope.tvShow.show.rating.average };
        var show = {
            name: $scope.tvShow.show.name,
            premiered: $scope.tvShow.show.premiered,
            rating: rating,
            summary: $scope.tvShow.show.summary
        };

        var tvShow = { show: show };
        $scope.tvShows.push(tvShow);
    };

    $scope.removeTVShow = function (tvShow) {
        var index = $scope.tvShows.indexOf(tvShow);
        $scope.tvShows.splice(index, 1);
    };

    $scope.favoriteTVShows = [];

    $scope.addToFavorites = function (tvShow) {
        $scope.favoriteTVShows.push(tvShow);
    };

    $scope.removeFromTVShows = function (tvShow) {
        var index = $scope.favoriteTVShows.indexOf(tvShow);
        $scope.favoriteTVShows.splice(index, 1);
    };

    $scope.listOfEpisodes = function (tvShow) {
        $http.get("http://api.tvmaze.com/shows/" + tvShow.show.id + "/episodes")
            .success(function (response) {
                $scope.episodes = response;
            });
    };

});