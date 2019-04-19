angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(false);
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

.controller('SearchCtrl', function($scope, SearchService, $state, $ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(false);
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
          // $ionicHistory.nextViewOptions({ disableBack: true });
          // $ionicHistory.clearHistory();
      }, function () {
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
})

.controller('SubsearchCtrl', function($scope, SearchService, $state, $stateParams, $ionicModal,$ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(false);
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
        //$state.go('app.details')
        console.log("do something for marker")
      });
    }
    if ($scope.searchResult.length > 0) {
      map.setZoom(17)
      map.panTo({lat: $scope.searchResult[0].lat, lng: $scope.searchResult[0].lng})
    }
  }
  $scope.createMarkers()
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < mapMarkers.length; i++) {
    bounds.extend(mapMarkers[i].getPosition());
  }
  map.fitBounds(bounds);

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
        $scope.searchResult = []
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
    $scope.search()
  };

  $scope.isCardSelected = []
  function initIsCardSelected() {
    isCardSelected = []
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

  function itemsToPlan() {
    var itemsToPlan = []
    for (var i = 0; i < $scope.isCardSelected.length; i++) {
      if ($scope.isCardSelected[i] == true) {
        itemsToPlan.push($scope.searchResult[i])
      }
    }
    return itemsToPlan;
  }

  $scope.plan = function plan() {
    var plannedVenues = itemsToPlan()
    console.log(plannedVenues)
    SearchService.planVenues(plannedVenues).then(
      function (data) {
        $state.go('app.details', { "summary": data["cityInformation"],"plannedVenues": data["venueList"] })
      },
      function () {
        console.log('plan venues error')
      })
  }
})

.controller('DetailsCtrl', function($scope, $stateParams,$ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(false);

  $scope.$on('$ionicView.enter', function() {

  });

  $scope.map;

  $scope.initMap = function initMap() {
    $scope.map = new google.maps.Map(document.getElementById('detailsMap'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 10,
      disableDefaultUI: true
    });
  }
  $scope.initMap()
  $scope.summary = $stateParams['summary']
  $scope.plannedVenues = $stateParams['plannedVenues']

  console.log($scope.plannedVenues)

  var pathCoordinates = [];
  var mapMarkers = [];
  $scope.createMarkers = function createMarkers() {
    for (i = 0; i < $scope.plannedVenues.length; i++) {
      var position = {lat: $scope.plannedVenues[i].lat, lng: $scope.plannedVenues[i].lng};
      var marker = new google.maps.Marker({
        position: position,
        map: $scope.map
      });
      mapMarkers.push(marker)
      pathCoordinates.push(position)
    }
    if ($scope.plannedVenues.length > 0) {
      $scope.map.setZoom(15)
      $scope.map.setCenter({lat: $scope.plannedVenues[0].lat, lng: $scope.plannedVenues[0].lng});
    }
  }
  $scope.createMarkers()

  $scope.popularityDataset = $scope.plannedVenues.map(function(element, index){
    var colors = ["#4F86EC88","#DA504088","#F3BD4288","#56A55C88"]
    var color = colors[index % colors.length]
    return {
      label: element["name"],
      backgroundColor: color,
      borderColor: color,
      data: element["popularity"]
    }
  })

  var lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
  };

  if (mapMarkers.length > 1) {
    for (var i = 1; i < pathCoordinates.length; i++) {
      var flightPath = new google.maps.Polyline({
        path: [pathCoordinates[i-1], pathCoordinates[i]],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [{
          icon: lineSymbol,
          offset: '100%'
        }],
      });
      flightPath.setMap($scope.map)
    }
  }

  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < mapMarkers.length; i++) {
    bounds.extend(mapMarkers[i].getPosition());
  }
  $scope.map.fitBounds(bounds);
  $scope.$watch($scope.popularityDataset, function() {
    console.log("ploting")
    var ctx = document.getElementById("canvas")
    console.log($scope.popularityDataset)
    var myLineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: $scope.popularityDataset
          },
          options: {
            title: {
              display: true,
              text: 'Popularity (thousands)'
            }
        }
      });
  });
})
