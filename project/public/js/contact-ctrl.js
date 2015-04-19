app.controller('ContactCtrl', function ($scope, $http) {

    $scope.submitQuery = function (name, email, subject, message) {
        var queryDetails = {
            name: name,
            email: email,
            subject: subject,
            message: message
        };

        $http.post('/submit-query', queryDetails)
        .success(function (response) {
            $scope.name = '';
            $scope.email = '';
            $scope.subject = '';
            $scope.message = '';

            $scope.submitMessage = "Your feedback / query has been submited successfully.";
        });

    };

});