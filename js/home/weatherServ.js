angular.module('nasaViewer').service('weatherServ', function($http, $sce) {

  var apiKey = "aa55d72a47da5d7d1bcabcb04ad92fdd";

  this.getWeather = function(userLat, userLong) {
    var currentWeatherURL = $sce.trustAsResourceUrl("https://api.darksky.net/forecast/" + apiKey + "/" + userLat + "," + userLong)

    var currentWeatherReq = {
      method: 'JSONP',
      url: currentWeatherURL
    }
    
    return $http(currentWeatherReq);
  }
  


});