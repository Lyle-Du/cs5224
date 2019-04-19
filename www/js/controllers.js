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
// $scope.searchResult = [
//   {
//   "id": "4d438c6514aa8cfa743d5c3d",
//   "name": "National Gal­lery Singa­pore",
//   "address": "1 St. Andrew's Road",
//   "lat": 1.2907395913341984,
//   "lng": 103.85154786540198,
//   "postalCode": "178957",
//   "cc": "SG",
//   "city": "Singapore",
//   "country": "Singapore",
//   "categories": [  {
//       "id": "4bf58dd8d48988d1e2931735",
//       "name": "Art Gallery"
//       }
//   ],
//   "tweets":["asdsadadasdasdasmdklasjdklasklfnkldsfklaklnklfnaklfnklqnasklndklnskladnklsnadklnaskldnklasndklasnkldklsdadasd","asdsadadasd","asdsadadasd","asdsadadasd","asdsadadasd","asdsadadasd","asdsadadasd"],
//   "tipCount": 105,
//   "usersCount": 10464,
//   "checkinsCount": 18846,
//   "url": "http://www.nationalgallery.sg"
// }]

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
        $state.go('app.details', { "plannedVenues": data })
      },
      function () {
        console.log('plan venues error')
      })
  }
})

.controller('DetailsCtrl', function($scope, $stateParams) {

  $scope.map;
  $scope.initMap = function initMap() {
    $scope.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 10,
      scaleControl: false,
      draggable: false,
      disableDefaultUI: true
    });
  }

  $scope.initMap()

  $scope.plannedVenues = $stateParams['plannedVenues']

  $scope.summary = {
    "city":"Singapore",
    "food": "Singapore has a global dining scene. The influx of different cultures to the city in the 19th century resulted in a wide choice of cuisines becoming commonplace, including Chinese, Malay and Indian. Traditional hawker centers, nowadays also known as food centers, are found throughout the island. They offer a variety of Singaporean cuisine under one roof, and are an ideal way to sample local dishes at rock-bottom prices (from about S$3 upwards).",
    "emergencies": "Dial 999 for police and 995 for fire or ambulance. \n Call 1777 if you need an ambulance in non-emergency situations",
    "hospitals": "There are 24-hour, walk-in Accident & Emergency departments at the following central hospitals: - Singapore General Hospital \n - Mount Elizabeth Hospital \n - Non-residents can expect to pay around S$100–S$200 for initial attendance at an emergency department. \n This is payable by cash or credit card.",
    "shopping": "It’s not surprising that many visitors come to Singapore purely to shop – there are plenty of air-conditioned malls throughout the city center, plus dedicated shopping districts. Some of these are devoted exclusively to designer fashion and accessories; others specialize in electronics and IT. There are also localized neighborhood hubs that offer traditional goods and markets.",
    "gstrefund":"Visitors can shop tax free, saving the 7% goods and services tax (GST). Among other rules, you have to present your passport in participating stores and make a minimum spend of S$100 in the same store on the same day. The GST refund can be processed at electronic kiosks at Changi Airport or international ferry terminals. Visit the government website for more information on using the Electronic Tourist Refund Scheme (eTRS).",
    "money":"The Singapore dollar (S$/SGD) is the official currency of Singapore. Coins come in denominations of 5 cents, 10 cents, 20 cents, 50 cents and S$1. Banknotes come in denominations of S$2, S$5, S$10, S$50, S$100, S$500 and S$1,000. There is a S$10,000 note, but it’s rarely used. \n Cash machines can be found at banks, inside malls and at most MRT stations. Credit cards are accepted pretty much everywhere, including taxis; however, a 10% surcharge is added to taxi fares. Visa and Mastercard are the safest bet, as some retailers or food and beverage outlets don’t accept American Express. Small retailers might not accept cards or insist on a minimum purchase.",
    "internet": "The majority of hotels in Singapore provide free WiFi to guests. The government provides free WiFi across the city and in many MRT stations on the Wireless@SG network. You can sign in using a foreign mobile number. However, when using a local mobile number, tourists are required to register with their passport at SingTel, M1 or iCell stores. There are also plenty of free WiFi hotspots in shopping malls and coffee shops."
  }

  // var mapMarkers = [];
  // $scope.createMarkers = function createMarkers() {
  //   for (i = 0; i < $scope.plannedVenues.length; i++) {
  //     var position = {lat: $scope.plannedVenues[i].lat, lng: $scope.plannedVenues[i].lng};
  //     var marker = new google.maps.Marker({
  //       position: position,
  //       map: $scope.map
  //     });
  //     mapMarkers.push(marker)
  //   }
  //   if ($scope.plannedVenues.length > 0) {
  //     $scope.map.setZoom(17)
  //     $scope.map.panTo({lat: $scope.plannedVenues[0].lat, lng: $scope.plannedVenues[0].lng})
  //   }
  // }
  // $scope.createMarkers()

      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(function(position) {
      //     var pos = {
      //       lat: position.coords.latitude,
      //       lng: position.coords.longitude
      //     };
      //     map.setZoom(13)
      //     map.setCenter(pos);
      //   }, function() {
      //     console.log("Failed to get current position")
      //   });
      // } else {
      //   console.log("Browser Geolocation is not supported")
      // }
      
    var ctx = document.getElementById("canvas")
    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "1 (thousands)",
            backgroundColor: "#3e95cd",
            borderColor: "#3e95cd",
            data: [2478,5267,734,784,433,12,12321,123,1,3,12]
          },
          {
            label: "2 (thousands)",
            backgroundColor: "#3e95cd",
            borderColor: "#3e25cd",
            data: [2478,567,734,784,433,12,1321,123,1,3,12]
          },
          {
            label: "3 (thousands)",
            backgroundColor: "#3e9500",
            borderColor: "#3e95cd",
            data: [2478,5267,734,784,433,21312,12321,123,123132,233,12]
          },
          {
            label: "3 (thousands)",
            backgroundColor: "#3e9500",
            borderColor: "#3e95cd",
            data: [2478,5267,734,784,433,21312,12321,123,123132,233,12]
          },
          {
            label: "3 (thousands)",
            backgroundColor: "#3e9500",
            borderColor: "#3e95cd",
            data: [2478,5267,734,784,433,21312,12321,123,123132,233,12]
          },
          {
            label: "3 (thousands)",
            backgroundColor: "#3e9500",
            borderColor: "#3e95cd",
            data: [2478,5267,734,784,433,21312,12321,123,123132,233,12]
          },
          {
            label: "3 (thousands)",
            backgroundColor: "#3e9500",
            borderColor: "#3e95cd",
            data: [2478,5267,734,784,433,21312,12321,123,123132,233,12]
          },
          {
            label: "3 (thousands)",
            backgroundColor: "#3e9500",
            borderColor: "#3e95cd",
            data: [2478,5267,734,784,433,21312,12321,123,123132,233,12]
          },
          {
            label: "3 (thousands)",
            backgroundColor: "#3e9500",
            borderColor: "#3e95cd",
            data: [2478,5267,734,784,433,21312,12321,123,123132,233,12]
          },
          {
            label: "3 (thousands)",
            backgroundColor: "#3e9500",
            borderColor: "#3e95cd",
            data: [2478,5267,734,784,433,21312,12321,123,123132,233,12]
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Popularity (thousands)'
        }
      }
    });
})
