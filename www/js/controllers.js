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
  $scope.checkedCategory = []
  $scope.category = SearchService.category()
//   [
//   {
//     "id": "4d4b7104d754a06370d81259",
//     "name": "Arts & Entertainment"
//   },
//   {
//     "id": "4d4b7105d754a06372d81259",
//     "name": "College & University"
//   },
//   {
//     "id": "4d4b7105d754a06373d81259",
//     "name": "Event"
//   },
//   {
//     "id": "4d4b7105d754a06374d81259",
//     "name": "Food"
//   },
//   {
//     "id": "4d4b7105d754a06376d81259",
//     "name": "Nightlife Spot"
//   },
//   {
//     "id": "4d4b7105d754a06377d81259",
//     "name": "Outdoors & Recreation"
//   },
//   {
//     "id": "4d4b7105d754a06375d81259",
//     "name": "Professional & Other Places"
//   },
//   {
//     "id": "4d4b7105d754a06378d81259",
//     "name": "Shop & Service"
//   }
// ]
// Toggle selection for a given fruit by name
  $scope.toggleCategory = function toggleCategory(item) {
    var idx = $scope.checkedCategory.indexOf(item);
    // Is currently selected
    if (idx > -1) {
      $scope.checkedCategory.splice(idx, 1);
    }
    // Is newly selected
    else {
      $scope.checkedCategory.push(item);
    }
    console.log($scope.checkedCategory)
  };
})

.controller('SubsearchCtrl', function($scope, SearchService) {
  $scope.checkedCategory = []
  $scope.category = SearchService.venues()
// Toggle selection for a given fruit by name
  $scope.toggleCategory = function toggleCategory(item) {
    var idx = $scope.checkedCategory.indexOf(item);
    // Is currently selected
    if (idx > -1) {
      $scope.checkedCategory.splice(idx, 1);
    }
    // Is newly selected
    else {
      $scope.checkedCategory.push(item);
    }
    console.log($scope.checkedCategory)
  };
})
