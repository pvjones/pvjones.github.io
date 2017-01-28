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
    })
  }

  // $scope.hideHazardToggle = true;

  // $scope.showHazard = function() {
  //   var elements = document.getElementsByClassName("is-hazard");
  //   console.log(elements)
  //   if ($scope.showHazardToggle) {
  //     for (let i = 0; i < elements.length; i++) {
  //       if (elements[i].classList[0] == "is-hazard") {
  //         elements[i].classList[1] = "show-hazard"
  //         console.log(elements[i].classList[1])
  //       }
  //     }  
  //   } else {
  //      for (let i = 0; i < elements.length; i++) {
  //       if (elements[i].classList[0] == "is-hazard") {

  //       }
  //     }  

  //   }

  $scope.showHazardText = "Show";
 
  $scope.showHazard = function() {
    var elements = document.querySelectorAll(".is-hazard");
    elements.forEach(function(e) {
      e.classList.toggle("show-hazard")
    $scope.showHazardText = ($scope.showHazardText === "Show" ? "Hide" : "Show" )
    })



  }



});