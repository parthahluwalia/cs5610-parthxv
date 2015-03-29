var app = angular.module("TwitterSentiment", []);

app.controller("TwitterSentimentController", function ($scope, $http) {

    $scope.getTweets = function () {

        var searchText = $scope.searchText;
        console.log("Searching '" + searchText + "' related tweets...");

        $http.get('/wk7-exp3/'+searchText)
            .success(function (tweetSentiment) {
                console.log(tweetSentiment);
                $scope.tweetSentiments = tweetSentiment; //Tweets with sentiments

                //Generate a comparitive score for the tweets fetched
                var comparativeScore = 0;
                for (var i in tweetSentiment) {
                    comparativeScore += tweetSentiment[i].sentiment.comparative;
                }
                comparativeScore = comparativeScore / 10;
                console.log(comparativeScore);
                $scope.comparativeScore = comparativeScore; //Comparitive score of all the tweets
            });
    };
   

});