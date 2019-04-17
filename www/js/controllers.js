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

.controller('SearchCtrl', function($scope, SearchService) {
  $scope.category = []
  $scope.form = {}
  $scope.form.city = ''
  $scope.form.category = []
  SearchService.category().then(
    function (data) {
        $scope.category = data;
    },
    function () {
      console.log('load allProjectsOrStreets error')
    })

  $scope.search = function search() {
    console.log($scope.form)
    SearchService.venueByCity($scope.form).then(
      function (data) {
          console.log(data)
      },
      function () {
        console.log('load allProjectsOrStreets error')
      })
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

.controller('SubsearchCtrl', function($scope, SearchService) {
  $scope.category = []
  $scope.form = {}
  $scope.form.city = ''
  $scope.form.category = []
  SearchService.category().then(
    function (data) {
        $scope.category = data;
    },
    function () {
      console.log('load allProjectsOrStreets error')
    })

  $scope.search = function search() {
    console.log($scope.form)
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
