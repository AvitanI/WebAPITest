app.controller("facilitiesController", function ($scope, $http) {
    $scope.facilities = [];

    $http.get('/api/facilities')
        .then(function (res) {
            $scope.facilities = res.data;
        })
        .catch(function (err) {
            console.error(err);
        });
});

app.directive("facilitiesList", function () {
    var template = '<ul> \
                        <li ng-repeat="facility in facilities | filter : txt">\
                            {{ facility.name }} \
                        </li>\
                    </ul>';

    return {
        template: template
    };
});