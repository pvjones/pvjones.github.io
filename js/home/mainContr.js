angular.module('nasaViewer').controller('mainContr', function($scope, apodServ, geolocationFact, weatherServ) {

  //default background image (set because sometimes images[randomCount] below is evaluating undefined)
  $scope.bgUrl = {
    'background-image': "url('../images/home/bg-01.jpg')"
  }

  $scope.setBgImage = function() {
    var imgCount = 4;
    var dir = '../images/home/';
    var randomCount = Math.round(Math.random() * (imgCount - 1)) + 1;
    var images = [
      "bg-01.jpg",
      "bg-02.jpg",
      "bg-03.jpg",
      "bg-04.jpg"
    ];

    if (images[randomCount]) {
      $scope.bgUrl = {
        'background-image': "url('" + dir + images[randomCount] + "')"
      }
    }
  }

  //only show widgets once data is returned
  $scope.weatherLoaded = false;

  apodServ.getCurrentApod().then(function(response) {
    $scope.currentApod = response.data;
  });

  geolocationFact.getCurrentPosition().then(function(response) {
    var userLat = response.coords.latitude;
    var userLong = response.coords.longitude;
    weatherServ.getWeather(userLat, userLong).then(function(response) {
      var weatherObj = response.data.currently;
      $scope.cloudCover = (weatherObj.cloudCover * 100).toString().slice(0, 2);
      $scope.weatherSummary = weatherObj.summary;
      $scope.visibility = weatherObj.visibility;
      $scope.temperature = weatherObj.temperature;
      $scope.sunrise = response.data.daily.data[0].sunriseTime * 1000; //convert from unix to JS time
      $scope.sunset = response.data.daily.data[0].sunsetTime * 1000;
      $scope.moonPhase = response.data.daily.data[0].moonPhase;

      var skyView = ""
      if ($scope.cloudCover === 0 && $scope.visibility > 9) {
        skyView = "excellent";
      } else if (weatherObj.cloudCover < 0.2 && weatherObj.visibility > 8) {
        skyView = "good";
      } else if (weatherObj.cloudCover < 0.3 && weatherObj.visibility > 5) {
        skyView = "fair";
      } else if (weatherObj.cloudCover > 0.3 || weatherObj.visibility < 1) {
        skyView = "poor";
      } else {
        skyView = "unknown";
      }

      $scope.skyView = skyView;
      $scope.weatherLoaded = true;
    })
  });



});