var app = angular.module("SentimentApp", []);

//sentiment has now been npm installed
var sentiment = require('sentiment');

app.controller("SentimentController", function ($scope, $http) {
    /*
    $http.get('/experiment2/api/sentiment')
        .success(function (response) {
            $scope.sentiments = response;
        });
        */
    $scope.evaluateSentiment = function () {
        var phrase = $scope.phrase;
        console.log("Analyzing phrase: " + phrase);
        var analysis = sentiment(phrase);
        //console.log(analysis);
        $scope.analysis = analysis;
    }

});