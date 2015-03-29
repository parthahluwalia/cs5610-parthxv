
var weatherApp = angular.module("WeatherApp", ['ngRoute']);

weatherApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/home', {
            templateUrl: '../weather/home.html',
            controller: 'HomeCtrl'
        }).
        when('/savedWeather', {
            templateUrl: '../weather/savedWeather2.html',
            controller: 'savedWeatherCtrl'
        }).
        when('/profile/:username', {
            templateUrl: '../weather/profile.html',
            controller: 'ProfileCtrl'
        }).
        otherwise({
            redirectTo: '/home'
        });
  }]);

weatherApp.controller("HomeCtrl", function ($scope, weatherService) {

    $scope.getWeather = function () {
        weatherService.getWeather($scope.location, $scope.days, function (response) {
            $scope.weather = response;
            console.log(response);
        });
    };


    $scope.saveWeather = function (day) {
        weatherService.saveWeather(day);
    };

});

weatherApp.controller("savedWeatherCtrl", function ($scope, weatherService) {
    $scope.savedWeather = weatherService.getSavedWeather();
    console.log($scope.savedWeather);

});

weatherApp.controller("NavCtrl", function ($scope, userService) {
    $scope.currentUser = null;

    $scope.login = function () {
        var username = $scope.username;
        var password = $scope.password;
        console.log(username, " ", password);
        $scope.currentUser = userService.login(username, password);
    };

    $scope.logout = function () {
        $scope.currentUser = null; 
        UserService.logout();
        $scope.username = null;
        $scope.password = null;
    }
});

weatherApp.controller("ProfileCtrl", function ($scope, userService, $routeParams) {
    var username = $routeParams.username;
    $scope.username = username;
    $scope.currentUser = userService.getCurrentUser();
});