angular.module('nasaViewer').controller('apodContr', function($scope, apodServ) {

  $scope.apodYears = [];
  $scope.apodMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  $scope.apodDays = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];

  for (var i = 1996; i <= (new Date().getFullYear()); i++) {
    $scope.apodYears.push(i);
  };

  $scope.apodLoaded = false;

  var getCurrentApod = function() {
    apodServ.getCurrentApod().then(function(response) {
      $scope.currentApod = response.data;
      $scope.yyyy = '';
      $scope.mm = '';
      $scope.dd = '';
      $scope.apodLoaded = true;
    })
  };

  getCurrentApod();

  $scope.getCurrentApod = getCurrentApod;

  $scope.getApodByDate = function(yyyy, mm, dd) {
    var queryDate = (yyyy + "-" + mm + "-" + dd).toString();
    apodServ.getApodByDate(queryDate).then(function(response) {

      $scope.currentApod = response.data;
      $scope.apodLoaded = true;

    })
  }

});