var app = angular.module("HelloWorldApp", []);

app.controller("HelloWorldController", 
    function ($scope) {
        var emp = {
            first: "Vincent",
            last: "Chase"
        };

        $scope.empName = emp;

        $scope.hello = "Hello again from Angular JS";

    });