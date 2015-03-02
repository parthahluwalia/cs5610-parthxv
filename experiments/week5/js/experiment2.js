
var weatherApp = angular.module("WeatherApp", ['ngRoute']);

weatherApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/home', {
            templateUrl: '../weather/home.html',
            controller: 'HomeCtrl'
        }).
        when('/savedWeather', {
            templateUrl: '../weather/savedWeather.html',
        }).
        otherwise({
            redirectTo: '/home'
        });
  }]);

weatherApp.controller("HomeCtrl", function ($scope, $http) {
    $scope.getWeather = function () {
        
        var location = $scope.location;
        var numOfDays = $scope.days;
        $http.get("http://api.worldweatheronline.com/free/v2/weather.ashx?key=d85a78bff4cd92f19e843c552014b&q="+ location +"&num_of_days="+ numOfDays +"&format=json")
            .success(function (response) {
                $scope.weather = response;
                console.log(response);
            })
            .error(function (data) {
                console.log("Error while connecting");
            });       
    };

    $scope.savedWeather = [];
    $scope.saveWeather = function (day) {
        $scope.savedWeather.push(day);
    };

});

/*
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

});

*/