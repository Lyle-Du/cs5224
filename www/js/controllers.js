angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(true);
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

.controller('SubsearchCtrl', function($scope, SearchService, $state, $stateParams, $ionicModal) {
  // Define Google Map
  var map;
  $scope.initMap = function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setZoom(10)
        map.setCenter(pos);
      }, function() {
        console.log("Failed to get current position")
      });
    } else {
      console.log("Browser Geolocation is not supported")
    }
  }

  $scope.initMap()

  $scope.category = []
  $scope.form = $stateParams['searchForm']
  $scope.form.city = $stateParams['searchForm'].city
  $scope.form.category = $stateParams['searchForm'].category
  $scope.searchResult = $stateParams['searchResult']
$scope.searchResult = [
  {
  "id": "4d438c6514aa8cfa743d5c3d",
  "name": "National Gal­lery Singa­pore",
  "address": "1 St. Andrew's Road",
  "lat": 1.2907395913341984,
  "lng": 103.85154786540198,
  "postalCode": "178957",
  "cc": "SG",
  "city": "Singapore",
  "country": "Singapore",
  "categories": [  {
      "id": "4bf58dd8d48988d1e2931735",
      "name": "Art Gallery"
      }
  ],
  "tweets":["asdsadadasdasdasmdklasjdklasklfnkldsfklaklnklfnaklfnklqnasklndklnskladnklsnadklnaskldnklasndklasnkldklsdadasd","asdsadadasd","asdsadadasd","asdsadadasd","asdsadadasd","asdsadadasd","asdsadadasd"],
  "tipCount": 105,
  "usersCount": 10464,
  "checkinsCount": 18846,
  "url": "http://www.nationalgallery.sg"
}]

  $scope.view = {}
  $scope.view.isSearchClickable = true

  // Define Google Map Markers
  var mapMarkers = [];
  $scope.createMarkers = function createMarkers() {
    // Delete previous markers
    for (var i = 0; i < mapMarkers.length; i++) {
      mapMarkers[i].setMap(null)
    }
    mapMarkers = []

    for (i = 0; i < $scope.searchResult.length; i++) {
      var position = {lat: $scope.searchResult[i].lat, lng: $scope.searchResult[i].lng};
      var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: 'The Marker'
      });
      mapMarkers.push(marker)

      marker.addListener('click', function() {
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
          $scope.createMarkers()
      },
      function () {
        console.log('search error')
      }).finally(function() {
        $scope.view.isSearchClickable = true
        console.log('loading finished')
      });
  };

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

  $scope.isCardSelected = []
  function initIsCardSelected() {
    $scope.searchResult.forEach(function(result) {
      $scope.isCardSelected.push(false)
    })
  }
  initIsCardSelected()

  $scope.cardOnClicked = function onClicked(index) {
    $scope.isCardSelected[index] = !$scope.isCardSelected[index]
  }

  $scope.returnBgColor = function getBgColor() {
    return $scope.backgroundColor
  }

  $scope.mouseoverTimer
  $scope.cardOnMouseover = function onMouseover(item) {
    mouseoverTimer = setTimeout(function () {
      var pos = {lat:item.lat, lng:item.lng};
      map.panTo(pos);

      for (var i = 0; i < $scope.searchResult.length; i++) {
        if ($scope.searchResult[i].id == item.id) {
          mapMarkers[i].setOpacity(1.0)
          if (mapMarkers[i].getAnimation() == null) {
            mapMarkers[i].setAnimation(google.maps.Animation.BOUNCE)
          } else {
            mapMarkers[i].setAnimation(null)
          }
        } else {
          mapMarkers[i].setOpacity(0.3)
        }
      }
    }, 600);
  }

  $scope.cardOnMouseout = function onMouseout() {
    clearTimeout(mouseoverTimer)
    mapMarkers.forEach(function(marker) {
      marker.setAnimation(null)
      marker.setOpacity(1.0)
    })
  }
  $scope.reviewItem = {}
  $scope.showReview = function showReview(item) {
    console.log("review is clicked",item)
    $scope.reviewItem = item
    $scope.showReviewModal()
  }

  $ionicModal.fromTemplateUrl('review-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.reviewModal = modal;
    });
  $scope.showReviewModal = function () {
      $scope.reviewModal.show();
  };
  $scope.hideReviewModal = function () {
      $scope.reviewModal.hide();
      $scope.reviewItem = {};
  };
})
