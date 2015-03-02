var routingApp = angular.module('RoutingApp', ['ngRoute']);

routingApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/home', {
            templateUrl: '../routes/Home.html',
        }).
        when('/about', {
            templateUrl: '../routes/About.html',
        }).
        when('/contact', {
            templateUrl: '../routes/Contact.html',
        }).
        otherwise({
            redirectTo: '/home'
        });
  }]);