var app = angular.module("HelloWorldApp", []);

app.controller("HelloWorldController", 
    function ($scope) {
        
        $scope.hello = "I'm bound to the blue highlighted text below! Try to change text here...";

        var emp = {
            first: "Vincent",
            last: "Chase"
        };

        $scope.empName = emp;

        var entourage = [
            {
                first: "Vincent",
                last: "Chase"
            },
            {
                first: "Eric",
                last: "Murphy"
            },
            {
                first: "Johnny",
                last: "Drama Chase"
            },
            {
                first: "Turtle",
                last: ""
            },
            {
                first: "Ari",
                last: "Gold"
            }
        ];

        $scope.entourage = entourage;

    });