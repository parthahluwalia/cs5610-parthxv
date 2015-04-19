
//People search controller - DELETE THIS CONTROLLER!!!
//USED NOWHERE!!! - DELETE...
app.controller('PeopleCtrl', function ($scope, $http, $window, $rootScope, $location) {

    var userFound = [];
    //Search a list of users - users/search and their statuses
    $scope.searchPeople = function (userTerm) {
        $http.get("/user-search/" + userTerm)
        .success(function (response) {
            //console.log(response);
            userFound = response;
            $scope.searchedUsers = response;
        });
        
    };

    //Show the clicked user's profile
    $scope.showUserProfile = function (user) {

        $http.get('/account/check-following/' + user.id)
        .success(function (response) {
            if (response == "monitoring") {
                $rootScope.showUnmonitorButtonPeople = true;
                $rootScope.showMonitorButtonPeople = false;
            } else if (response == "not monitoring") {
                $rootScope.showMonitorButtonPeople = true;
                $rootScope.showUnmonitorButtonPeople = false;
            }

            //Render the received profile pic to a bigger one!
            var imgURL = user.profile_image_url;

            if (imgURL.substring(imgURL.length - 4) === "jpeg") {
                var profile_img_400x400 = imgURL.substring(0, imgURL.length - 12) + "_400x400.jpeg";
            } else {
                var profile_img_400x400 = imgURL.substring(0, imgURL.length - 11) + "_400x400.jpg";
            }

            //$http.get("/statuses-user_timeline/" + user.screen_name)
            $http.get("/profile/" + user.screen_name)
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
        });
    };

});

