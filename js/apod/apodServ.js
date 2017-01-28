angular.module('nasaViewer').service('apodServ', function($http) {

  var apiKey = '2DGaM1ahLanQmj6wbsyHjLpe54YCodSEzsvm4cjZ';

  this.getCurrentApod = function() {
    var currentApodReq = {
      method: 'GET',
      url: 'https://api.nasa.gov/planetary/apod?api_key=' + apiKey,
    };
    return $http(currentApodReq);
  };

  this.getApodByDate = function(queryDate) {
    var dateReq = {
      method: 'GET',
      url: 'https://api.nasa.gov/planetary/apod?api_key=' + apiKey + "&date=" + queryDate
    };
    return $http(dateReq);
  };

});