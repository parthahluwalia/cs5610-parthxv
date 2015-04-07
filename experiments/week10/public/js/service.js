//User Service

app.factory('userService', function ($http, $rootScope, $location, $window) {
    //Can remove login function
    var login = function (user) {
    	console.log("userService: " + user);

    	$http.post('/login', user)
    		.success(function (response) {
    			console.log(response);
    			$rootScope.currentUser = user;
    			//$location.url("../views/user-profile.html")
    			$window.location.href = '../views/user-profile.html';
    		});
    };

    var savedUserDetails = {};

    var setUserDetails = function (userDetails) {
        savedUserDetails = userDetails;
    };

    var getUserDetails = function () {
        return savedUserDetails;
    };

    return {
        login: login,
        setUserDetails: setUserDetails,
        getUserDetails: getUserDetails
    };
});

