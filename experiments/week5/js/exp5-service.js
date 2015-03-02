
weatherApp.factory('weatherService', function weatherService($http, userService) {
    var getWeather = function (location, numOfDays, callback) {
        $http.get("http://api.worldweatheronline.com/free/v2/weather.ashx?key=d85a78bff4cd92f19e843c552014b&q=" + location + "&num_of_days=" + numOfDays + "&format=json")
            .success(callback)
            .error(function (data) {
                console.log("Error while connecting");
            });
    };

    var currentUser = userService.getCurrentUser();
    var savedWeather = currentUser.savedweather;

    var saveWeather = function (day) {
        savedWeather.push(day);
    };

    var getSavedWeather = function () {
        return savedWeather;
    };

    //This is to be done because of closure concept in JavaScript
    return {
        getWeather: getWeather,
        saveWeather: saveWeather,
        getSavedWeather: getSavedWeather
    };

});

weatherApp.factory('userService', function () {
    var currentUser = null;

    var savedWeather1 = [];
    var savedWeather2 = [];

    var users = [
        { username: "parth", password: "parth", savedweather: savedWeather1  },
        { username: "rishi", password: "duggal", savedWeather: savedWeather2 }
    ];

    var login = function (username, password) {

        for (var i in users) {
            if (users[i].username === username) {
                currentUser = users[i];
                return users[i];
            }
        }
        
        return null;
    }

    var getCurrentUser = function () {
        return currentUser;
    }

    var logout = function () {
        currentUser = null;
    }

    return {
        login: login,
        getCurrentUser: getCurrentUser,
        logout: logout
    };

});