angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  $scope.loginData = {};
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('DetailsCtrl', function($scope) {})

.controller('SearchCtrl', function($scope, SearchService, $state, $ionicHistory) {
  $scope.category = []
  $scope.form = {}
  $scope.form.city = ''
  $scope.form.category = []
  $scope.view = {}
  $scope.view.isSearchClickable = true
  SearchService.category().then(
    function (data) {
        $scope.category = data;
    },
    function () {
      console.log('load category error')
    })

  $scope.search = function search() {
    console.log($scope.form)
    console.log('loading starts')
    $scope.view.isSearchClickable = false
    SearchService.venueByCity($scope.form).then(
      function (data) {
          console.log(data)
          $state.go('app.subsearch', { "searchForm": $scope.form, "searchResult": data })
          $ionicHistory.nextViewOptions({ disableBack: true });
          $ionicHistory.clearHistory();
      }, function () {
        console.log('search error')
      }).finally(function() {
        $scope.view.isSearchClickable = true
        console.log('loading finished')
      });
  };

  // Toggle selection for a given fruit by name
  $scope.toggleCategory = function toggleCategory(item) {
    var idx = $scope.form.category.indexOf(item);
    // Is currently selected
    if (idx > -1) {
      $scope.form.category.splice(idx, 1);
    }
    // Is newly selected
    else {
      $scope.form.category.push(item);
    }
    console.log($scope.form.category)
  };
})

.controller('SubsearchCtrl', function($scope, SearchService, $state, $stateParams) {
  $scope.category = []
  $scope.form = $stateParams['searchForm']
  $scope.form.city = $stateParams['searchForm'].city
  $scope.form.category = $stateParams['searchForm'].category
  $scope.searchResult = $stateParams['searchResult']
  $scope.searchResult = [{},{},{},{},{}]
  $scope.view = {}
  $scope.view.isSearchClickable = true
  // Define Google Map
  var map;
  $scope.initMap = function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
  }

  $scope.initMap()

  // Define Google Map Markers
  var mapMarkers = [];
  $scope.createMarkers = function createMarkers() {
    for (i = 0; i < $scope.searchResult.length; i++) {
      var position = {lat: $scope.searchResult[i].lat, lng: $scope.searchResult[i].lng};
      var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: 'The Marker'
      });

      marker.addListener('click', function() {
        // Nagivate to next screen
        $state.go('app.details')
      });
    }
    if ($scope.searchResult.length > 0) {
      map.setZoom(17)
      map.panTo({lat: $scope.searchResult[0].lat, lng: $scope.searchResult[0].lng})
    }
  }
  $scope.createMarkers()

  SearchService.category().then(
    function (data) {
        $scope.category = data;
    },
    function () {
      console.log('load category error')
    })

  $scope.search = function search() {
    console.log('loading starts')
    console.log($scope.form)
    $scope.view.isSearchClickable = false
    SearchService.venueByCity($scope.form).then(
      function (data) {
          console.log(data)
          $scope.searchResult = data
      },
      function () {
        console.log('search error')
      }).finally(function() {
        $scope.view.isSearchClickable = true
        console.log('loading finished')
      });
  };

  // Toggle selection for a given fruit by name
  $scope.toggleCategory = function toggleCategory(item) {
    var idx = $scope.form.category.indexOf(item);
    // Is currently selected
    if (idx > -1) {
      $scope.form.category.splice(idx, 1);
    }
    // Is newly selected
    else {
      $scope.form.category.push(item);
    }
    console.log($scope.form.category)
  };
})
