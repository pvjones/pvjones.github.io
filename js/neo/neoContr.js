angular.module('nasaViewer').controller('neoContr', function($scope, neoService, dateService, $timeout) {

  $scope.weekArray = dateService.createWeekArray(dateService.getCurrentDate(), 8);

  $scope.resetToggleButtons = function() {
    for (let i = 0; i < $scope.weekArray.length; i++) {
      $scope.weekArray[i].active = false;
    }
  };

  $scope.resetToggleButtons();

  $scope.getNeoData = function(startDate, endDate) {
    neoService.getNeoData(startDate, endDate).then(function(response) {
      $scope.data = response;
      calculateWeekStats(response);
    })
  }


  $scope.stats = {
    missDistanceKm: {
      label: "Closest Approach (LD)",
    },
    relVelocityKph: {
      label: "Relative Velocity (km/h)",
    },
    estDiameterKm: {
      label: "Estimated Diameter (km)",
    }
  };

  $scope.viewControlObject = {
    mainTitleDate: "",
    showMainTitleDate: false,
  }

  $scope.radiusSelector = "estDiameterKm";
  $scope.colorSelector = "missDistanceKm";

  $scope.toggleViewDisplay = function(date) {
    $scope.viewControlObject.mainTitleDate = date;
    $scope.viewControlObject.showMainTitleDate = true;
  }

  $scope.showHazardText = "Show";

  $scope.showHazard = function() {
    var hazardElements = document.querySelectorAll(".is-hazard");
    var notHazardElements = document.querySelectorAll("circle:not(.is-hazard)");

    hazardElements.forEach(function(e) {
      e.classList.toggle("show-hazard")
    });

    notHazardElements.forEach(function(e) {
      e.classList.toggle("show-not-hazard")
    });

    $scope.showHazardText = ($scope.showHazardText === "Show" ? "Hide" : "Show")
  }

  function calculateWeekStats(data) {
    if (data) {
      const dataArray = data.children;
      let distanceValues = [];
      let velocityValues = [];
      let diameterValues = [];
      dataArray.forEach(function(e) {
        distanceValues.push(+e.missDistanceKm);
        velocityValues.push(+e.relVelocityKph);
        diameterValues.push(+e.estDiameterKm);
      })

      $scope.stats.missDistanceKm.values = distanceValues;
      let maxDistance = distanceValues.reduce((prev, curr) => {
        return prev > curr ? prev : curr;
      });
      $scope.stats.missDistanceKm.max = (maxDistance / 385000).toFixed(1);
      let minDistance = distanceValues.reduce((prev, curr) => {
        return prev < curr ? prev : curr;
      });
      $scope.stats.missDistanceKm.min = (minDistance / 385000).toFixed(1);
      let meanDistance = distanceValues.reduce((prev, curr) => {
        return (prev + curr);
      }) / distanceValues.length;
      $scope.stats.missDistanceKm.mean = (meanDistance / 385000).toFixed(1);

      $scope.stats.relVelocityKph.values = velocityValues;
      let maxVelocity = velocityValues.reduce((prev, curr) => {
        return prev > curr ? prev : curr;
      });
      $scope.stats.relVelocityKph.max = maxVelocity.toExponential(1).toUpperCase().replace(/\+/g, "");
      let minVelocity = velocityValues.reduce((prev, curr) => {
        return prev < curr ? prev : curr;
      });
      $scope.stats.relVelocityKph.min = minVelocity.toExponential(1).toUpperCase().replace(/\+/g, "");
      let meanVelocity = velocityValues.reduce((prev, curr) => {
        return (prev + curr);
      }) / velocityValues.length;
      $scope.stats.relVelocityKph.mean = meanVelocity.toExponential(1).toUpperCase().replace(/\+/g, "");

      $scope.stats.estDiameterKm.values = diameterValues;
      let maxDiameter = diameterValues.reduce((prev, curr) => {
        return prev > curr ? prev : curr;
      });
      $scope.stats.estDiameterKm.max = maxDiameter.toFixed(2);
      let minDiameter = diameterValues.reduce((prev, curr) => {
        return prev < curr ? prev : curr;
      });
      $scope.stats.estDiameterKm.min = minDiameter.toFixed(2);
      let meanDiameter = diameterValues.reduce((prev, curr) => {
        return (prev + curr);
      }) / diameterValues.length;
      $scope.stats.estDiameterKm.mean = meanDiameter.toFixed(2)

    }
  }

  $scope.autoLoopLabel = "Play week loop";

  $scope.autoLoop = function() {

    for (let i = 0; i <= $scope.weekArray.length; i++) {

      $timeout(timeOutGetter(i), 4000 * (i))

      function timeOutGetter(i) {
        $scope.autoLoopLabel = "Playing loop..."

        if (i < $scope.weekArray.length) {
          var startDate = $scope.weekArray[i].startDate.apiFormat;
          var endDate = $scope.weekArray[i].endDate.apiFormat;

          return function() {
            $scope.getNeoData(startDate, endDate);
            for (let j = 0; j < $scope.weekArray.length; j++) {
              $scope.weekArray[j].active = false;
            }
            $scope.weekArray[i].active = true;
            $scope.viewControlObject.mainTitleDate = $scope.weekArray[i].startDate.displayFormat;
          }

        } else if (i = $scope.weekArray.length) {
          return function() {
            $scope.viewControlObject.mainTitleDate = $scope.weekArray[0].startDate.displayFormat;
            $scope.getNeoData($scope.weekArray[0].startDate.apiFormat, $scope.weekArray[0].endDate.apiFormat);
            for (let j = 0; j < $scope.weekArray.length; j++) {
              $scope.weekArray[j].active = false;
            }
            $scope.weekArray[0].active = true;
            $scope.autoLoopLabel = "Play week loop";
          }
        }
      }
    }
  }

  window.onload = function() {
    $scope.viewControlObject.mainTitleDate = $scope.weekArray[0].startDate.displayFormat;
    console.log($scope.weekArray)
    $scope.viewControlObject.showMainTitleDate = true;
    $scope.getNeoData($scope.weekArray[0].startDate.apiFormat, $scope.weekArray[0].endDate.apiFormat);
    $scope.weekArray[0].active = true;
  };


});