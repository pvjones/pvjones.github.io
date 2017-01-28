angular.module('nasaViewer').controller('neoContr', function($scope, neoService, dateService) {

  
  $scope.weekArray = dateService.createWeekArray(dateService.getCurrentDate(), 8);

  $scope.resetToggleButtons = function() {
    for (let i = 0; i < $scope.weekArray.length; i++) {
      $scope.weekArray[i].active = false;
    }
  };

  $scope.resetToggleButtons();

  $scope.viewControlObject = {
    mainTitleDate: "",
    showMainTitleDate: false,

    radiusSelector: "",
    colorSelector: ""
  }



  $scope.radiusSelector = "estDiameterKm";
  $scope.colorSelector = "missDistanceKm";

  $scope.toggleViewDisplay = function(date) {
    $scope.viewControlObject.mainTitleDate = date;
    $scope.viewControlObject.showMainTitleDate = true;
  }


  $scope.getNeoData = function(startDate, endDate) {
    
    neoService.getNeoData(startDate, endDate).then(function(response) {
      $scope.data = response;
    console.log($scope.mainTitleDate, $scope.showMainTitleDate);
      
    })
  }

  



});