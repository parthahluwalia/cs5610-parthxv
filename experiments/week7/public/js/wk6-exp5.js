var app = angular.module("Exp5SentimentApp", []);

//sentiment has now been npm installed
var sentiment = require('sentiment');

app.controller("Exp5SentimentController", function ($scope, $http) {

    //Do a get request in order to see if there exist some previous analyzed sentiments
    $http.get('/experiment5/api')
        .success(function (response) {
            $scope.analyzedSentiments = response;
        });
    
    $scope.evaluateSentimentAndAdd = function () {
        var phrase = $scope.phrase;
        console.log("Analyzing phrase: " + phrase);

        var analysis = {
            phrase: phrase,
            sentiment: sentiment(phrase)
        };

        $http.post('/experiment5', analysis)
            .success(function (response) {
                $scope.analyzedSentiments = response;
            });
    };

    $scope.wk6RemoveSentiment = function (index) {
        $http.delete('/experiment5/' + index)
            .success(function (response) {
                $scope.analyzedSentiments = response;
            });
    };
   

});