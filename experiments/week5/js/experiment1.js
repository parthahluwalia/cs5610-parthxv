var app = angular.module("TVShowsApp", []);

app.controller("TVShowsController", function ($scope, $http) {

    $scope.searchTVShows = function () {
        var title = $scope.searchByTitle;

        var token = {
            oauth_consumer_key: "Xxydx_HWDknfR4ZrSfEE2w",
            oauth_token: "rrGkCATcQesp1YrqnaPZKTMfdQV_DxKV",
            oauth_signature_method: "hmac-sha1",
            oauth_signature: "G3Je5i2oq5B1__5xWcPZ26xlzsE"
        };

        var data = {
            location: "Boston"
        };

        var req = {
            method: 'GET',
            url: 'http://api.yelp.com/v2/search?term=food&location=San+Francisco',
            headers: oauth.authorize(req, token)
        };

        $http.get(req)
            .success(function (response) {
                console.log(response);
                //$scope.tvShows = response;
            })
            .error(function (data) {
                console.log("Error while sending request");
            });
    };

});