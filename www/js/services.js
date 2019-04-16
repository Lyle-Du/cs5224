angular.module('starter.services', [])

.factory('SearchService', function ($q, $timeout, $http) {

    var getCategories = function () {
        console.log('getCategories');
        var deferred = $q.defer();
        var request = $http({
            method: "get",
            url: "http://localhost:9000/api/catagory",
            crossDomain: true,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });
        request.success(function (data) {
            console.log(data)
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject()
        });
        return deferred.promise;
    };

    return {
        category: getCategories,
    }
});
