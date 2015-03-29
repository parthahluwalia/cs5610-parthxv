var app = angular.module("PostTweet", []);

app.controller("PostTweetController", function ($scope, $http) {

    $scope.postTweet = function (tweetText) {
        //console.log(tweetText);        
        $http.post('/wk7-exp5/' + tweetText)
            .success(function (response) {
                console.log(response);
            });
    };
   

});