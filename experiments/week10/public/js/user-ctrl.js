
//User Controller
app.controller('UserCtrl', function ($scope, $rootScope, $http, $location) {

    $scope.showTweets = true;

    $scope.goToUserProfile = function () {
        $http.get('/account')
       .success(function (response) {
           console.log(response)
           if (response.twitterId) {
               $scope.showProfileTab = true;
           }
           //Set the current user
           $rootScope.currentUserDetails = response;

           //Get the people being monitored and their sentiments
           $http.get('/monitored/sentiments/' + response.twitterId)
           .success(function (response) {
               console.log(response);
               //Set a boolean scope variable to show monitored sentiments
               $rootScope.showMonitoredSentiments = true;
               
               $rootScope.monitoredSentiments = response;

               //Set location to current user's account
               $location.path('/account');
           });
          
       });
    };

    //Get twitter friends - following!
    $scope.getFriends = function (twitterId) {
        //Set boolean scope variables as which respective tab to show!
        $scope.showMonitoredSentiments = false;
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

        $http.post('/account/follow', followeeFollower);
    };

    //Boolean function that returns true if current user is not following / monitoring
    //his respective twitter follower
    /*
    $scope.notMonitoring = function (friend) {
        var followeeFollower = $rootScope.currentUserDetails.twitterId + "&&" + friend.id;

        $http.get('/account/check-following/' + followeeFollower)
        .success(function (isFollowing) {
            console.log(isFollowing);
        });
    };
    */

    //Get twitter followers
    $scope.getFollowers = function (twitterId) {

        $scope.showMonitoredSentiments = false;
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
        }

        $http.post('/account/unfollow', followeeFollower)
        .success(function (response) {
            $scope.monitoredPeople = response;
        });
    };  
    
    //Show a clicked user's profile
    $scope.showUserProfile = function (user) {

        //Render the received profile pic to a bigger one!
        var imgURL = user.profile_image_url;

        if (imgURL.substring(imgURL.length - 4) === "jpeg") {
            var profile_img_400x400 = imgURL.substring(0, imgURL.length - 12) + "_400x400.jpeg";
        } else {
            var profile_img_400x400 = imgURL.substring(0, imgURL.length - 11) + "_400x400.jpg";
        }

        $http.get("/statuses-user_timeline/" + user.screen_name)
         .success(function (statuses) {
             //console.log(statuses);
             var userPageDetails = {
                 userDetails: user,
                 statuses: statuses,
                 profile_img: profile_img_400x400
             };
             $rootScope.selectedUserTimeline = userPageDetails;
             console.log(userPageDetails);

             $location.path('/profile/' + user.screen_name);

         });
    };

});