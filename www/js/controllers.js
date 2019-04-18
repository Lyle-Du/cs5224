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

.controller('SubsearchCtrl', function($scope, SearchService, $stateParams) {
  $scope.$on('$ionicView.enter', function () {
        $scope.form = $stateParams['searchForm']
        $scope.searchResult = $stateParams['searchResult']
    });
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
