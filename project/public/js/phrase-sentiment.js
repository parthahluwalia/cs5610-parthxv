var app = angular.module("SentimentAnalysisApp", ['ngRoute', 'ngCookies', 'ngAnimate']);

app.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/', {
            templateUrl: '../views/home.html',
        }).
        when('/parallax1', {
            templateUrl: '../views/phrase-module.html',
            controller: 'PhraseSentimentCtrl'
        }).
        when('/people', {
            templateUrl: '../views/people.html',
        }).
        when('/contact', {
            templateUrl: '../views/contact.html',
            controller: 'ContactCtrl'
        }).
        when('/account', {
            templateUrl: '../views/account.html',
            controller: 'UserCtrl'
        }).
        when('/profile/:screen_name', {
            templateUrl: '../views/profile.html',
            controller: 'UserCtrl'
            //controller: 'UserProfileCtrl'
        }).
        when('/profile1/:id', {
            templateUrl: '../views/profile1.html',
            controller: 'UserProfileCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
  }]);


//Subject Sentiment Controller
app.controller("PhraseSentimentCtrl", function ($scope, $http, $rootScope) {

    //Analyze tweets of a subject
    $scope.analyzeTweets = function (searchText) {

    //Get the sentiments for the subject.
    $http.get("/phrase-sentiment/" + searchText)
        .success(function (tweetSentiment) {
            //Set scope variable to show the evaluated sentiment results
            $scope.showSubjectSentiment = true;

            //Generate a comparitive score for the tweets fetched
            console.log(tweetSentiment);
            var comparativeScore = 0;
            for (var i in tweetSentiment) {
                comparativeScore += tweetSentiment[i].sentiment.comparative;
            }
            comparativeScore = comparativeScore / tweetSentiment.length;
                
            $scope.comparativeScore = Math.round(comparativeScore * 1000) / 1000;
            $scope.tweetSentiments = tweetSentiment;

            //Generate a phrase sentiment corresponding to the comparative score generated for the tweets fetched
            var comparative = parseFloat(comparativeScore);

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

            //Check whether or not to show the "Bookmark" button
            $http.get('/current-user')
            .success(function (currentUser) {
                if (currentUser.twitterId) {
                    $scope.showBookmarkIcon = true;
                    //Don't show the bookmark msg when a user just clicks on "Analyze Sentiments" button
                    $scope.showBookmarkMsg = false;
                } else {
                    $scope.showBookmarkIcon = false;
                }
            });
        });
    };

    //Bookmark a subject
    $scope.bookmarkSubject = function (subject) {
        //Get the current logged-in user and bookmark the subject
        $http.get('/current-user')
        .success(function (loggedInUser) {

            var loggedInUserId = parseInt(loggedInUser.twitterId);

            var bookmark = {
                bookmarker: loggedInUserId,
                bookmark: subject
            };

            $http.post('/account/bookmark', bookmark)
            .success(function (response) {
                //console.log(response.msg);
                $scope.showBookmarkMsg = true;
                $scope.bookmarkMsg = response.msg;
            });

        });
    };
   
});





