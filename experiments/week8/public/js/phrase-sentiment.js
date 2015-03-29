var app = angular.module("SentimentAnalysisApp", ['ngRoute']);

//Subject Sentiment Controller
app.controller("PhraseSentimentCtrl", function ($scope, $http) {
    $scope.analyzeTweets = function (searchText) {
        $http.get("/phrase-sentiment/" + searchText)
            .success(function (tweetSentiment) {
                //console.log(tweetSentiment);
                //Generate a comparitive score for the tweets fetched
                console.log(tweetSentiment);
                var comparativeScore = 0;
                for (var i in tweetSentiment) {
                    comparativeScore += tweetSentiment[i].sentiment.comparative;
                }
                comparativeScore = comparativeScore / tweetSentiment.length;
                //console.log(comparativeScore);
                //$scope.comparativeScore = comparativeScore; //Comparitive score of all the tweets
                
                //Generate a phrase sentiment corresponding to the comparative score generated for the tweets fetched
                var comparative = parseFloat(comparativeScore);
                //console.log(comparative);
                $scope.comparative = comparative;

                if (0 < comparative && comparative < 0.15) {
                    $scope.phraseSentiment = "fine"
                } else if (0.15 <= comparative && comparative < 0.3) {
                    $scope.phraseSentiment = "incredible"
                } else if (0.3 < comparative && comparative < 0.6) {
                    $scope.phraseSentiment = "fantabulous"
                } else if (comparative >= 0.6) {
                    $scope.phraseSentiment = "spectacularly out of the world"
                } else if (comparative === 0) {
                    $scope.phraseSentiment = "okay"
                } else if (-0.1 < comparative && comparative < 0) {
                    $scope.phraseSentiment = "not that good"
                } else if (-0.25 < comparative && comparative <= -0.1) {
                    $scope.phraseSentiment = "lousy"
                } else if (-0.55 < comparative && comparative <= 0.25) {
                    $scope.phraseSentiment = "awful"
                } else if (comparative <= -0.55) {
                    $scope.phraseSentiment = "awfully bad"
                }
            });
    };
});


//User Controller
app.controller('UserCtrl', function ($scope, userService) {
    $scope.login = function (user) {
        console.log("UserCtrl: " + user);
        userService.login(user);
    };
});

