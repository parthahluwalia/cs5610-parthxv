
//User Controller
app.controller('UserCtrl', function ($scope, $rootScope, $http, $location, $cookieStore, $routeParams) {

    //People Search!
    //Search a list of users - users/search and their statuses
    $scope.searchPeople = function (userTerm) {
        $http.get("/user-search/" + userTerm)
        .success(function (response) {
            //console.log(response);
            $scope.searchedUsers = response;
        });
    };

    $scope.showTweets = true;   

    $scope.goToUserProfile = function () {
        $http.get('/account')
       .success(function (response) {
           console.log(response);

           //Set the current user
           $rootScope.currentUserDetails = response;

           //Get the people being monitored and their sentiments
           $http.get('/monitored/sentiments/' + response.twitterId)
           .success(function (response) {
               console.log(response);
               if (response.monitoredUser != 'dummy') {
                   //Set a boolean scope variable to show monitored sentiments
                   $rootScope.showMonitoredSentiments = true;
               }
               $rootScope.monitoredSentiments = response;
               
               //Set location to current user's account
               $location.path('/account');
           });
          
       });
    };

    //Show monitored people's sentiments
    $scope.showMonitoredSentimentsFn = function () {
        $scope.showMonitoredSentiments = true;
        $scope.showBookmarks = false;
        $scope.showTweets = false;
        $scope.showTwitterFriends = false;
        $scope.showTwitterFollowers = false;
        $scope.showMonitoredPeople = false;

        //Get the people being monitored and their sentiments
        $http.get('/monitored/sentiments/' + $rootScope.currentUserDetails.twitterId)
        .success(function (response) {
            console.log(response);
            if (response.monitoredUser != 'dummy') {
                //Set a boolean scope variable to show monitored sentiments
                $rootScope.showMonitoredSentiments = true;                
            }
            $rootScope.monitoredSentiments = response;

        });
    };

    //Show Bookmarks
    $scope.showBookmarkedSubjects = function () {
        $scope.showBookmarks = true;
        $scope.showMonitoredSentiments = false;
        $scope.showTweets = false;
        $scope.showTwitterFriends = false;
        $scope.showTwitterFollowers = false;
        $scope.showMonitoredPeople = false;

        $http.get('/account/bookmarked-subjects/' + $rootScope.currentUserDetails.twitterId)
        .success(function (bookmarks) {
            console.log(bookmarks);
            $scope.bookmarks = bookmarks;
        });

    };

    //Get twitter friends - following!
    $scope.getFriends = function (twitterId) {
        //Set boolean scope variables as which respective tab to show!
        $scope.showMonitoredSentiments = false;
        $scope.showBookmarks = false;
        $scope.showTweets = false;
        $scope.showTwitterFriends = true;
        $scope.showTwitterFollowers = false;
        $scope.showMonitoredPeople = false;

        console.log(twitterId);
        $http.get('friends/list/' + twitterId)
        .success(function (friends) {
            console.log(friends);
            $scope.friendList = friends;
        });
    };

    //Follow user - Monitor button clicked!
    $scope.followUser = function (user) {
        //console.log(user);
        var loggedInuser = $rootScope.currentUserDetails;
        var loggedInUserId = parseInt(loggedInuser.twitterId); //Follower
        var followeeId = user.id; //Followee
        var followeeFollower = {
            followee: followeeId,
            follower: loggedInUserId
        };

        $http.post('/account/follow', followeeFollower)
        .success(function (response) {
            $rootScope.showMonitorButton = false;
            $rootScope.showUnmonitorButton = true;
        });
    };

    //Get twitter followers
    $scope.getFollowers = function (twitterId) {

        $scope.showMonitoredSentiments = false;
        $scope.showBookmarks = false;
        $scope.showTweets = false;
        $scope.showTwitterFriends = false;
        $scope.showTwitterFollowers = true;
        $scope.showMonitoredPeople = false;

        $http.get('/followers/list/' + twitterId)
        .success(function (followers) {
            console.log(followers);
            $scope.followerList = followers;
        });
    };

    //Get the list of people, the current user is following
    $scope.getMonitoring = function () {
        //Set boolean scope variables as which respective tab to show!
        $scope.showMonitoredSentiments = false;
        $scope.showBookmarks = false;
        $scope.showTweets = false;
        $scope.showTwitterFriends = false;
        $scope.showTwitterFollowers = false;
        $scope.showMonitoredPeople = true;

        $http.get('/account/monitoredFriends/lookup/' + $rootScope.currentUserDetails.twitterId)
        .success(function (response) {
            console.log(response);
            $scope.monitoredPeople = response;
        });
    };

    //Unfollow / Unmonitor a person
    $scope.unfollowUser = function (user) {
        var followeeFollower = {
            followee: user.id,
            follower: $rootScope.currentUserDetails.twitterId
        };

        $http.post('/account/unfollow', followeeFollower)
        .success(function (response) {
            $scope.monitoredPeople = response;
        });
    };  
    
    //Unfollow / Unmonitor a user from his profile
    $scope.unfollowUserProfile = function (user) {
        var followeeFollower = {
            followee: user.id,
            follower: $rootScope.currentUserDetails.twitterId
        };

        $http.post('/account/unfollow-profile', followeeFollower)
        .success(function (response) {
            $rootScope.showMonitorButton = true;
            $rootScope.showUnmonitorButton = false;
        });
    };

    //Show a clicked user's profile
    $scope.showUserProfile = function (user) {

        $http.get('/current-user')
        .success(function (currUser) {
            if (currUser.twitterId) {

                //Profile look when logged in
                $http.get('/account/check-following/' + user.id)
                .success(function (response) {
                    if (response == "monitoring") {
                        $rootScope.showUnmonitorButton = true;
                        $rootScope.showMonitorButton = false;
                    } else if (response == "not monitoring") {
                        $rootScope.showMonitorButton = true;
                        $rootScope.showUnmonitorButton = false;
                    }

                    //Render the received profile pic to a bigger one!
                    var imgURL = user.profile_image_url;

                    if (imgURL.substring(imgURL.length - 4) === "jpeg") {
                        var profile_img_400x400 = imgURL.substring(0, imgURL.length - 12) + "_400x400.jpeg";
                    } else if (imgURL.substring(imgURL.length - 3) === "jpg") {
                        var profile_img_400x400 = imgURL.substring(0, imgURL.length - 11) + "_400x400.jpg";
                    } else if (imgURL.substring(imgURL.length - 3) === "png") {
                        var profile_img_400x400 = imgURL.substring(0, imgURL.length - 11) + "_400x400.png";
                    }

                    //$http.get("/statuses-user_timeline/" + user.screen_name)
                    $http.get('/profile/' + user.screen_name)
                     .success(function (lastSentimentStatuses) {

                         var userPageDetails = {
                             userDetails: user,
                             statuses: lastSentimentStatuses.statuses,
                             profile_img: profile_img_400x400,
                             sentiment: lastSentimentStatuses.lastSentiment,
                             sentimentAdj: lastSentimentStatuses.sentimentAdj
                         };
                         $rootScope.selectedUserTimeline = userPageDetails;
                         console.log(userPageDetails);

                         $location.path('/profile/' + user.screen_name);
                     });
                });

            } else {
                //Profile look when not logged in
                //Render the received profile pic to a bigger one!
                var imgURL = user.profile_image_url;

                if (imgURL.substring(imgURL.length - 4) === "jpeg") {
                    var profile_img_400x400 = imgURL.substring(0, imgURL.length - 12) + "_400x400.jpeg";
                } else if (imgURL.substring(imgURL.length - 3) === "jpg") {
                    var profile_img_400x400 = imgURL.substring(0, imgURL.length - 11) + "_400x400.jpg";
                } else if (imgURL.substring(imgURL.length - 3) === "png") {
                    var profile_img_400x400 = imgURL.substring(0, imgURL.length - 11) + "_400x400.png";
                }

                //$http.get("/statuses-user_timeline/" + user.screen_name)
                $http.get('/profile/' + user.screen_name)
                 .success(function (lastSentimentStatuses) {

                     var userPageDetails = {
                         userDetails: user,
                         statuses: lastSentimentStatuses.statuses,
                         profile_img: profile_img_400x400,
                         sentiment: lastSentimentStatuses.lastSentiment,
                         sentimentAdj: lastSentimentStatuses.sentimentAdj
                     };
                     $rootScope.selectedUserTimeline = userPageDetails;
                     console.log(userPageDetails);

                     $location.path('/profile/' + user.screen_name);
                 });
            }
        });

        
    };
    

    //Boolean scope variable to display "Profile" and "Logout" buttons only if a user has logged in.
    $rootScope.showHiddenButtons = $cookieStore.get('showHiddenButtons');

    //This function will set the cookiestore object to true
    $rootScope.setCookie = function () {
        //$cookies.put('showButton', true); //This ain't working, don't know what the heck is wrong...
        //Thus, using the deprecated $cookieStore
        $cookieStore.put('showHiddenButtons', true);
    };
    
    //Logout
    $scope.logout = function () {
        $http.post('/logout')
        .success(function () {
            //Set the current user to null
            $rootScope.currentUserDetails = null;
            //Set the cookieStore object to false, to hide the "Profile" and "Logout" buttons
            $cookieStore.put('showHiddenButtons', false);
            //Set the scope varible to false to hide the resective buttons
            $rootScope.showHiddenButtons = false;
            //Redirect to the Home Page
            $location.url('/');
        });
    };

    //Get sentimens for a bookmark
    $scope.getBookmarkSentiments = function (bookmarkText) {
        $http.get('/phrase-sentiment/' + bookmarkText)
        .success(function (tweetSentiment) {

            //Show sentiment of the bookmarked subject
            //$scope.showBookmarkSentiment = true;

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
                $scope.phraseSentiment = "awful"
            } else if (-0.55 < comparative && comparative <= 0.25) {
                $scope.phraseSentiment = "disgusting"
            } else if (comparative <= -0.55) {
                $scope.phraseSentiment = "disgustingly bad"
            }
        });

    };

    $scope.unbookmarkSubject = function (subject) {
        $http.post('/account/unbookmark', { bookmark: subject })
        .success(function (bookmarks) {
            $scope.bookmarks = bookmarks;
        });
    };

    $scope.postTweet = function (tweet) {
        $http.post('/account/post-tweet', { tweet: tweet })
        .success(function (response) {
            console.log(response);
            $scope.tweetText = "";
        });
    };

  
});