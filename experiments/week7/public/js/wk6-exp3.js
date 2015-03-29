var app = angular.module("SentimentApp", []);

app.controller("SentimentController", function ($scope, $http) {
    $http.get('/experiment2/api/sentiment')
        .success(function (response) {
            $scope.sentiments = response;
        });
});