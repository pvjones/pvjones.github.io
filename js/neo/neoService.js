angular.module('nasaViewer').service('neoService', function($http, neoDeserialServ, dateService) {

  //NASA api key
  var apiKey = "2DGaM1ahLanQmj6wbsyHjLpe54YCodSEzsvm4cjZ";

  // http request for all neo with nearest approach over next 7 days
  this.getNeoData = function(startDate, endDate) {

    var neoDataRequest = {

      method: "GET",
      url: "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + startDate + "&end_date=" + endDate + "&api_key=" + apiKey
    }

    var promise = $http(neoDataRequest).then(function(response) {
      // strip header and hand off to deserializing service

      return neoDeserialServ.processNeoData(response.data);

    })

    return promise; //must return the promise for accessing functions

  }



});