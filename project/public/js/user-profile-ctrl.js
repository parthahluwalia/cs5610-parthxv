app.controller('UserProfileCtrl', function ($scope, $http, $routeParams, $rootScope) {

    var twitterId = $routeParams.id;
    console.log(twitterId);

    $scope.showTweets = true;

    $http.get('/profile1/' + twitterId)
    .success(function (userProfile) {
        console.log(userProfile);

        var user = userProfile.user;

        //Render the received profile pic to a bigger one!
        var imgURL = user.profile_image_url;

        if (imgURL.substring(imgURL.length - 4) === "jpeg") {
            var profile_img_400x400 = imgURL.substring(0, imgURL.length - 12) + "_400x400.jpeg";
        } else if (imgURL.substring(imgURL.length - 3) === "jpg") {
            var profile_img_400x400 = imgURL.substring(0, imgURL.length - 11) + "_400x400.jpg";
        } else if (imgURL.substring(imgURL.length - 3) === "png") {
            var profile_img_400x400 = imgURL.substring(0, imgURL.length - 11) + "_400x400.png";
        }

        var userPageDetails = {
            userDetails: user,
            statuses: userProfile.statuses,
            profile_img: profile_img_400x400,
            sentiment: userProfile.lastSentiment,
            sentimentAdj: userProfile.sentimentAdj
        };

        $rootScope.selectedUserTimeline = userPageDetails;

    });
    
    //$http.get('/account/check-following/' + twitterId)
    //.success(function (response) {
    //    if (response == "monitoring") {
    //        $rootScope.showUnmonitorButton = true;
    //        $rootScope.showMonitorButton = false;
    //    } else if (response == "not monitoring") {
    //        $rootScope.showMonitorButton = true;
    //        $rootScope.showUnmonitorButton = false;
    //    }

        
    //    //Render the received profile pic to a bigger one!
    //    var imgURL = user.profile_image_url;

    //    if (imgURL.substring(imgURL.length - 4) === "jpeg") {
    //        var profile_img_400x400 = imgURL.substring(0, imgURL.length - 12) + "_400x400.jpeg";
    //    } else if (imgURL.substring(imgURL.length - 3) === "jpg") {
    //        var profile_img_400x400 = imgURL.substring(0, imgURL.length - 11) + "_400x400.jpg";
    //    } else if (imgURL.substring(imgURL.length - 3) === "png") {
    //        var profile_img_400x400 = imgURL.substring(0, imgURL.length - 11) + "_400x400.png";
    //    }
        

    //    //$http.get("/statuses-user_timeline/" + user.screen_name)
    //    $http.get('/profile/' + twitterId)
    //        .success(function (lastSentimentStatuses) {

    //            var userPageDetails = {
    //                userDetails: user,
    //                statuses: lastSentimentStatuses.statuses,
    //                profile_img: profile_img_400x400,
    //                sentiment: lastSentimentStatuses.lastSentiment,
    //                sentimentAdj: lastSentimentStatuses.sentimentAdj
    //            };
    //            $rootScope.selectedUserTimeline = userPageDetails;
    //            console.log(userPageDetails);

    //            //$location.path('/profile/' + user.screen_name);

    //        });
    //});



});