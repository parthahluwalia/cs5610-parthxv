
//People search controller
app.controller('PeopleCtrl', function ($scope, $http, $window, userService) {

    //Search a list of users - users/search
    $scope.searchPeople = function (userTerm) {
        $http.get("/user-search/" + userTerm)
            .success(function (response) {
                console.log(response);
                $scope.searchedUsers = response;
            });
    };

    //Show user - users/show
    $scope.showUserTimeline = function (user) {
        var userIdScreenName = user.id + "&&" + user.screen_name;
        $http.get("/statuses-user_timeline/" + user.screen_name)
            .success(function (statuses) {
                console.log(statuses);
                var userPageDetails = {
                    userDetails: user,
                    statuses: statuses
                };
                $scope.userTimeLine = userPageDetails;
                console.log(userPageDetails);

                //Save the user details to be retrieved at other page
                userService.setUserDetails(userPageDetails);
                //$window.location.href = '../views/user-page.html';
            });
    };
});

//user-page controller
app.controller('UserPageCtrl', function ($scope, userService) {
    $scope.userPageDet = function () {
        //console.log("hello");
        console.log(userService.getUserDetails());
    };
});