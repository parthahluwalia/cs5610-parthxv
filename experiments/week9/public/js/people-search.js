
//People search controller
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
        /* UserTimeline implemented below...
        var usersTimeline = [];
        for (var i in userFound) {       
            //Get user's statuses
            $http.get("/statuses-user_timeline/" + userFound[i].screen_name)
            .success(function (statuses) {
                console.log(statuses);
                var userPageDetails = {
                    userDetails: userFound[i],
                    statuses: statuses
                };
                //$scope.userTimeLine = userPageDetails;
                usersTimeline.push(userPageDetails);
            });
        }
        console.log(usersTimeline);

        $scope.usersTimeline = usersTimeline;
        */
    };

    /* Revised code written below!
    //Show user - users/show
    $scope.showUserTimeline = function (user) {
        //var userIdScreenName = user.id + "&&" + user.screen_name;
        $http.get("/statuses-user_timeline/" + user.screen_name)
            .success(function (statuses) {
                //console.log(statuses);
                var userPageDetails = {
                    userDetails: user,
                    statuses: statuses
                };
                $scope.userTimeline = userPageDetails;
                console.log(userPageDetails);

                //Commenting the User Service for now...
                //Save the user details to be retrieved at other page
                //userService.setUserDetails(userPageDetails);
                //$window.location.href = '../views/user-page.html';
            });
    };
    */

    //Show the clicked user's profile
    $scope.showUserProfile = function (user) {

        //Render the received profile pic to a bigger one!
        var imgURL = user.profile_image_url;
        var profile_img_400x400 = imgURL.substring(0, imgURL.length - 12) + "_400x400.jpeg";

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
    }

});

