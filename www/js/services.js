angular.module('starter.services', [])
BASE_URL = "http://localhost:9000/api"

.factory('SearchServices', function ($q, $timeout, $http) {

  var getAllVenues = function() {
    console.log('Get all venues');
    var deferred = $q.defer();
    var request = $http({
      method: "get",
      url: BASE_URL + "/venue",
      timeout: 5000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    request.success(function(data) {
      console.log(data);
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject();
    });

    return deferred.promise;
  }

  var getVenueByCity = function(city) {
    console.log('Get Venue by city');
    var deferred = $q.defer();
    var request = $http({
      method: "get",
      url: BASE_URL + "/venue/",
      params: city,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    request.success(function(data) {
      console.log(data);
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject();
    });

    return deferred.promise;
  }

  return {
    getAllAenues: getAllAenues,
    getVenueByCity: getVenueByCity
  }
})

// get all the category

// get list of venues
