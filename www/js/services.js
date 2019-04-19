angular.module('starter.services', [])
.factory('SearchService', function ($q, $timeout, $http) {

  BASE_URL = "http://localhost:9000/api";

  var getCategories = function () {
      console.log('getCategories');
      var deferred = $q.defer();
      var request = $http({
          method: "get",
          url: BASE_URL + "/catagory",
          crossDomain: true,
          timeout: 5000,
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
      });
      request.success(function (data) {
          console.log(data);
          deferred.resolve(data);
      }).error(function (data) {
          deferred.reject();
      });
      return deferred.promise;
  };

  var planVenues = function(venues) {
    console.log("Plan Venues")
    var data = {
      data: venues
      // city:
    }

    var deferred = $q.defer();
    var request = $http({
      method: "post",
      url: BASE_URL + "/venue/sort",
      data: JSON.stringify(data),
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log(request);
    request.success(function(data) {
      console.log(data);
      deferred.resolve(data);
    }).error(function(data) {
      console.log(data);
      deferred.reject();
    });

    return deferred.promise;
  }

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
      console.log(data);
      deferred.reject();
    });

    return deferred.promise;
  }

  var getVenueByCity = function(city) {
    console.log('Get Venue by city');
    var deferred = $q.defer();
    var data
    if (city["category"].length > 0) {
      data = {"city":city["city"],"category":city["category"].join(',')}
    } else {
      data = {"city":city["city"]}
    }

    console.log(data)
    var request = $http({
      method: "get",
      url: BASE_URL + "/venue",
      params: data,
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
    category: getCategories,
    planVenues: planVenues,
    venues: getAllVenues,
    venueByCity: getVenueByCity
  }
});
