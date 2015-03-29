var app = angular.module("TwitterConnect", []);

app.controller("TwitterConnectController", function ($scope, $http) {

    $scope.makeConnection = function () {
        $http.get('/wk7-exp1/connect')
            .success(function (response) {
                if (response) {
                    console.log(response);
                    $scope.message = "OAuth connection to Twitter successful";
                } else {
                    $scope.message = "Unable to connect to Twitter! Check your OAuth Signature!";
                }
            });
    };

    $scope.getTweets = function () {

        var searchText = $scope.searchText;
        console.log("Searching '" + searchText + "' related tweets...");

        $http.get('/wk7-tweet/'+searchText)
            .success(function (response) {
                console.log(response);
                $scope.tweetsFetched = response;
            });

    };
   

});