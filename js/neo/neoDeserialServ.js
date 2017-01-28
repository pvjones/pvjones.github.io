angular.module('nasaViewer').service('neoDeserialServ', function() {

  this.processNeoData = function(json) {

    var neoObjects = [];

    // loop through days of week
    for (var date in json.near_earth_objects) {
      // for each day, loop through asteroid objects
      for (var i = 0; i < json.near_earth_objects[date].length; i++) {

        var newNeoObj = {};
        var rawNeoObj = json.near_earth_objects[date][i]

        // ID number
        newNeoObj.neoID = rawNeoObj.neo_reference_id;
        // NEO name
        newNeoObj.neoName = rawNeoObj.name;
        // Date of closest approach
        newNeoObj.closeApproachDate = rawNeoObj.close_approach_data[0].close_approach_date;
        // Closest approach distance
        newNeoObj.missDistanceKm = rawNeoObj.close_approach_data[0].miss_distance.kilometers;
        // Mean estimated diameter
        newNeoObj.estDiameterKm = (rawNeoObj.estimated_diameter.kilometers.estimated_diameter_max + rawNeoObj.estimated_diameter.kilometers.estimated_diameter_min) / 2;
        // Relative velocity
        newNeoObj.relVelocityKph = rawNeoObj.close_approach_data[0].relative_velocity.kilometers_per_hour;
        // Orbiting body
        newNeoObj.orbitBody = rawNeoObj.close_approach_data[0].orbiting_body;
        // Is NEO classified as potentially hazardous?
        newNeoObj.isPotHazard = rawNeoObj.is_potentially_hazardous_asteroid;

        neoObjects.push(newNeoObj)
      };
    }
    return {
      children: neoObjects
    }
  }

});