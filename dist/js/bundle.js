'use strict';

angular.module('nasaViewer', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/',
    controller: 'mainContr',
    templateUrl: '../views/home.html'
  }).state('apod', {
    url: '/apod',
    controller: 'apodContr',
    templateUrl: '../views/apod.html'
  }).state('neo', {
    url: '/neo',
    controller: 'neoContr',
    templateUrl: '../views/neo.html'
  });

  $urlRouterProvider.otherwise('/');
});
'use strict';

angular.module('nasaViewer').controller('apodContr', function ($scope, apodServ) {

  $scope.apodYears = [];
  $scope.apodMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  $scope.apodDays = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];

  for (var i = 1996; i <= new Date().getFullYear(); i++) {
    $scope.apodYears.push(i);
  };

  $scope.apodLoaded = false;

  var getCurrentApod = function getCurrentApod() {
    apodServ.getCurrentApod().then(function (response) {
      $scope.currentApod = response.data;
      $scope.yyyy = '';
      $scope.mm = '';
      $scope.dd = '';
      $scope.apodLoaded = true;
    });
  };

  getCurrentApod();

  $scope.getCurrentApod = getCurrentApod;

  $scope.getApodByDate = function (yyyy, mm, dd) {
    var queryDate = (yyyy + "-" + mm + "-" + dd).toString();
    apodServ.getApodByDate(queryDate).then(function (response) {

      $scope.currentApod = response.data;
      $scope.apodLoaded = true;
    });
  };
});
'use strict';

angular.module('nasaViewer').service('apodServ', function ($http) {

  var apiKey = '2DGaM1ahLanQmj6wbsyHjLpe54YCodSEzsvm4cjZ';

  this.getCurrentApod = function () {
    var currentApodReq = {
      method: 'GET',
      url: 'https://api.nasa.gov/planetary/apod?api_key=' + apiKey
    };
    return $http(currentApodReq);
  };

  this.getApodByDate = function (queryDate) {
    var dateReq = {
      method: 'GET',
      url: 'https://api.nasa.gov/planetary/apod?api_key=' + apiKey + "&date=" + queryDate
    };
    return $http(dateReq);
  };
});
'use strict';

angular.module('nasaViewer').factory('geolocationFact', ['$q', '$window', function ($q, $window) {

    'use strict';

    function getCurrentPosition() {
        var deferred = $q.defer();

        if (!$window.navigator.geolocation) {
            deferred.reject('Geolocation not supported.');
        } else {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                deferred.resolve(position);
            }, function (err) {
                deferred.reject(err);
            });
        }

        return deferred.promise;
    }

    return {
        getCurrentPosition: getCurrentPosition
    };
}]);


// $scope.navClass = 'big';
//   angular.element($window).bind(
//    "scroll", function() {
//         console.log(window.pageYOffset);
//         if (window.pageYOffset > 80) {
//          console.log($scope.navClass)
//           $scope.navClass = 'small-header';
//         } 
//         else {
//            $scope.navClass = 'big-header';
//         }
//         $scope.$apply();
//   }); 
"use strict";
'use strict';

angular.module('nasaViewer').directive('liveClock', function ($interval) {
  return {
    scope: true, //isolates directive
    restrict: 'E',
    template: "<span class='live-clock-greeting'>{{greeting}}, the current time is: <br /></span><span class='live-clock-time'>{{date.now() | date: timeFormat}}</span>",
    link: function link(scope, element, attributes) {

      timeRefresh();

      function timeRefresh() {
        scope.timeFormat = attributes.format === '12' ? 'hh:mm a' : 'HH:mm';
        scope.date = Date;

        var myDate = new Date();
        /* hour is before noon */
        if (myDate.getHours() < 12) {
          scope.greeting = "Good Morning";
        } else /* Hour is from noon to 5pm (actually to 5:59 pm) */
          if (myDate.getHours() >= 12 && myDate.getHours() <= 17) {
            scope.greeting = "Good Afternoon";
          } else /* the hour is after 5pm, so it is between 6pm and midnight */
            if (myDate.getHours() > 17 && myDate.getHours() <= 24) {
              scope.greeting = "Good Evening";;
            } else /* the hour is not between 0 and 24, so something is wrong */{
                scope.greeting = "Hello";
              }
      }

      $interval(timeRefresh, 1000);
    }
  };
});
'use strict';

angular.module('nasaViewer').controller('mainContr', function ($scope, apodServ, geolocationFact, weatherServ, $window) {

  //default background image (set because sometimes images[randomCount] below is evaluating undefined)
  $scope.bgUrl = {
    'background-image': "url('../images/home/bg-01.jpg')"
  };

  $scope.setBgImage = function () {
    var imgCount = 4;
    var dir = '../images/home/';
    var randomCount = Math.round(Math.random() * (imgCount - 1)) + 1;
    var images = ["bg-01.jpg", "bg-02.jpg", "bg-03.jpg", "bg-04.jpg"];

    if (images[randomCount]) {
      $scope.bgUrl = {
        'background-image': "url('" + dir + images[randomCount] + "')"
      };
    }
  };

  //only show widgets once data is returned
  $scope.weatherLoaded = false;

  apodServ.getCurrentApod().then(function (response) {
    $scope.currentApod = response.data;
  });

  geolocationFact.getCurrentPosition().then(function (response) {
    var userLat = response.coords.latitude;
    var userLong = response.coords.longitude;
    weatherServ.getWeather(userLat, userLong).then(function (response) {
      var weatherObj = response.data.currently;
      $scope.cloudCover = (weatherObj.cloudCover * 100).toString().slice(0, 2);
      $scope.weatherSummary = weatherObj.summary;
      $scope.visibility = weatherObj.visibility;
      $scope.temperature = weatherObj.temperature;
      $scope.sunrise = response.data.daily.data[0].sunriseTime * 1000; //convert from unix to JS time
      $scope.sunset = response.data.daily.data[0].sunsetTime * 1000;
      $scope.moonPhase = response.data.daily.data[0].moonPhase;

      var skyView = "";
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
    });
  });
});
'use strict';

angular.module('nasaViewer').service('weatherServ', function ($http, $sce) {

  var apiKey = "aa55d72a47da5d7d1bcabcb04ad92fdd";

  this.getWeather = function (userLat, userLong) {
    var currentWeatherURL = $sce.trustAsResourceUrl("https://api.darksky.net/forecast/" + apiKey + "/" + userLat + "," + userLong);

    var currentWeatherReq = {
      method: 'JSONP',
      url: currentWeatherURL
    };

    return $http(currentWeatherReq);
  };
});
'use strict';

angular.module('nasaViewer').service('dateService', function () {

  this.getCurrentDate = function () {
    return new Date();
  };

  function getFormattedDates(date) {

    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var yyyy = date.getFullYear();
    return {
      apiFormat: [yyyy, "-", (mm > 9 ? '' : '0') + mm, "-", (dd > 9 ? '' : '0') + dd].join(''),
      displayFormat: [(mm > 9 ? '' : '0') + mm, "-", (dd > 9 ? '' : '0') + dd, "-", yyyy].join('')
    };
  }

  function addDays(date, days) {
    var newDateMs = date.getTime() + 60 * 60 * 24 * 1000 * days;
    return new Date(newDateMs);
  }

  function createWeek(startDate) {
    return {
      startDate: getFormattedDates(startDate),
      endDate: getFormattedDates(addDays(startDate, 7))
    };
  }

  this.createWeekArray = function (startDate, numberOfWeeks) {
    var weekArray = [];
    var dateCounter = startDate;
    for (var i = 0; i < numberOfWeeks; i++) {
      var newWeek = createWeek(dateCounter);
      weekArray.push(newWeek);
      dateCounter = addDays(dateCounter, 7);
    }
    return weekArray;
  };
});
'use strict';

angular.module('nasaViewer').directive('bubbleChart', ['resizeService', function (resizeService) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      radiusSelector: '=',
      colorSelector: "="
    },
    link: function link($scope, elem, attrs) {
      var chartCanvas = elem[0];
      var width = resizeService.calculateElementWidth(chartCanvas);
      var height = resizeService.calculateElementHeight(chartCanvas);
      var diameter = width;

      window.onresize = function (event) {
        width = resizeService.calculateElementWidth(chartCanvas);
        height = resizeService.calculateElementHeight(chartCanvas);
        updateChart();
      };

      $scope.$watch("data", function (n, o) {
        if (n !== o) {
          updateChart();
        }
      });

      $scope.$watch("radiusSelector", function (n, o) {
        if (n !== o) {
          updateChart();
        }
      });

      $scope.$watch("colorSelector", function (n, o) {
        if (n !== o) {
          updateChart();
        }
      });

      //definitions

      var format = d3.format(",d");

      // initialize color interpolator function
      var colorInterpolator = d3.interpolateHcl("#750076", "#ffa346");

      // Initialize tooltips
      var tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
        return "<span class='tooltip-title'>NEO name:</span> <span class='tooltip-value'>" + d.neoName + "</span>" + "<br />" + "<span class='tooltip-title'>Estimated Diameter:</span> <span class='tooltip-value'>" + d.estDiameterKm.toFixed(2) + " km</span>" + "<br />" + "<span class='tooltip-title'>Closest approach:</span> <span class='tooltip-value'>" + (d.missDistanceKm / 385000).toFixed(2) + " LD</span>" + "<br />" + "<span class='tooltip-title'>Relative velocity:</span> <span class='tooltip-value'>" + (+d.relVelocityKph).toExponential(1).toUpperCase().replace(/\+/g, "") + " km/h</span>" + "<br />" + "<span class='tooltip-title'>Orbiting:</span> <span class='tooltip-value'>" + d.orbitBody + "</span>";
      });

      //create svg html element for directive and set attributes
      //normally done outside update function
      var svg = d3.select(elem[0]).append("svg").attr("width", width).attr("height", height).attr("class", "bubble").call(tip);

      function updateChart() {
        var radiusSelector = $scope.radiusSelector;
        var colorSelector = $scope.colorSelector;
        var data = $scope.data;

        //define pack
        var packing = d3.layout.pack().sort(null).size([width, height]).value(function (d) {
          return d[radiusSelector]; // VALUE ACCESSOR -- change this to a variable
        }).padding(5);

        //color interpolation max and min
        var max, min;
        data.children.forEach(function (e) {
          max = +e[colorSelector] < +max ? +max : +e[colorSelector];
          min = +e[colorSelector] > +min ? +min : +e[colorSelector];
        });

        if (data && data.children.length > 0) {
          packing.radius();

          var node = svg.selectAll(".node").data(packing.nodes(data).filter(function (d) {
            //commenting this out gives container circle a blue background?
            return !d.children;
          }));

          node.exit().transition().duration(0).remove();

          node.select("text").remove();

          node.enter().append("g").classed("node", true).attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
          }).append("circle").attr("class", function (d) {
            if (d.isPotHazard) {
              return "is-hazard";
            }
          }).on('mouseover', tip.show).on('mouseout', tip.hide);

          node.transition().attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
          });

          node.select("circle").transition().attr("r", function (d) {
            return d.r;
          });

          node.append("text").attr("dy", ".3em").style("text-anchor", "middle").style("pointer-events", "none").text(function (d) {
            return textHandler(d);
          });

          //for color redraw to work properly, it has to be part of a separate "select" function
          node.select("circle").style("fill", function (d) {
            return colorInterpolator((+d[colorSelector] - +min) / (+max - +min));
          }).attr('fill-opacity', 0.7).attr('stroke', function (d) {
            return colorInterpolator((+d[colorSelector] - +min) / (+max - +min));
          }).attr('stroke-width', 2);
        } //end of if statement
      } //end of update function
      function textHandler(d) {
        if (d.r < 25) {
          return "";
        }
        return d.neoName.substring(0, d.r / 2.8);
      }
    } //end of link
  }; //end of return
}]); //end of directive
'use strict';

angular.module('nasaViewer').controller('neoContr', function ($scope, $rootScope, neoService, dateService, $timeout) {

  $scope.weekArray = dateService.createWeekArray(dateService.getCurrentDate(), 8);

  $scope.resetToggleButtons = function () {
    for (var i = 0; i < $scope.weekArray.length; i++) {
      $scope.weekArray[i].active = false;
    }
  };

  $scope.resetToggleButtons();

  $scope.getNeoData = function (startDate, endDate) {
    neoService.getNeoData(startDate, endDate).then(function (response) {
      $scope.data = response;
      calculateWeekStats(response);
    });
  };

  $scope.stats = {
    missDistanceKm: {
      label: "Closest Approach (LD)"
    },
    relVelocityKph: {
      label: "Relative Velocity (km/h)"
    },
    estDiameterKm: {
      label: "Estimated Diameter (km)"
    }
  };

  $scope.viewControlObject = {
    mainTitleDate: "",
    showMainTitleDate: false
  };

  $scope.radiusSelector = "estDiameterKm";
  $scope.colorSelector = "missDistanceKm";

  $scope.toggleViewDisplay = function (date) {
    $scope.viewControlObject.mainTitleDate = date;
    $scope.viewControlObject.showMainTitleDate = true;
  };

  $scope.showHazardText = "Show";

  $scope.showHazard = function () {
    var hazardElements = document.querySelectorAll(".is-hazard");
    var notHazardElements = document.querySelectorAll("circle:not(.is-hazard)");

    hazardElements.forEach(function (e) {
      e.classList.toggle("show-hazard");
    });

    notHazardElements.forEach(function (e) {
      e.classList.toggle("show-not-hazard");
    });

    $scope.showHazardText = $scope.showHazardText === "Show" ? "Hide" : "Show";
  };

  function calculateWeekStats(data) {
    if (data) {
      (function () {
        var dataArray = data.children;
        var distanceValues = [];
        var velocityValues = [];
        var diameterValues = [];
        dataArray.forEach(function (e) {
          distanceValues.push(+e.missDistanceKm);
          velocityValues.push(+e.relVelocityKph);
          diameterValues.push(+e.estDiameterKm);
        });

        $scope.stats.missDistanceKm.values = distanceValues;
        var maxDistance = distanceValues.reduce(function (prev, curr) {
          return prev > curr ? prev : curr;
        });
        $scope.stats.missDistanceKm.max = (maxDistance / 385000).toFixed(1);
        var minDistance = distanceValues.reduce(function (prev, curr) {
          return prev < curr ? prev : curr;
        });
        $scope.stats.missDistanceKm.min = (minDistance / 385000).toFixed(1);
        var meanDistance = distanceValues.reduce(function (prev, curr) {
          return prev + curr;
        }) / distanceValues.length;
        $scope.stats.missDistanceKm.mean = (meanDistance / 385000).toFixed(1);

        $scope.stats.relVelocityKph.values = velocityValues;
        var maxVelocity = velocityValues.reduce(function (prev, curr) {
          return prev > curr ? prev : curr;
        });
        $scope.stats.relVelocityKph.max = maxVelocity.toExponential(1).toUpperCase().replace(/\+/g, "");
        var minVelocity = velocityValues.reduce(function (prev, curr) {
          return prev < curr ? prev : curr;
        });
        $scope.stats.relVelocityKph.min = minVelocity.toExponential(1).toUpperCase().replace(/\+/g, "");
        var meanVelocity = velocityValues.reduce(function (prev, curr) {
          return prev + curr;
        }) / velocityValues.length;
        $scope.stats.relVelocityKph.mean = meanVelocity.toExponential(1).toUpperCase().replace(/\+/g, "");

        $scope.stats.estDiameterKm.values = diameterValues;
        var maxDiameter = diameterValues.reduce(function (prev, curr) {
          return prev > curr ? prev : curr;
        });
        $scope.stats.estDiameterKm.max = maxDiameter.toFixed(2);
        var minDiameter = diameterValues.reduce(function (prev, curr) {
          return prev < curr ? prev : curr;
        });
        $scope.stats.estDiameterKm.min = minDiameter.toFixed(2);
        var meanDiameter = diameterValues.reduce(function (prev, curr) {
          return prev + curr;
        }) / diameterValues.length;
        $scope.stats.estDiameterKm.mean = meanDiameter.toFixed(2);
      })();
    }
  }

  $scope.autoLoopLabel = "Play week loop";

  $scope.autoLoop = function () {

    for (var i = 0; i <= $scope.weekArray.length; i++) {
      var timeOutGetter = function timeOutGetter(i) {
        $scope.autoLoopLabel = "Playing loop...";

        if (i < $scope.weekArray.length) {
          var startDate = $scope.weekArray[i].startDate.apiFormat;
          var endDate = $scope.weekArray[i].endDate.apiFormat;

          return function () {
            $scope.getNeoData(startDate, endDate);
            for (var j = 0; j < $scope.weekArray.length; j++) {
              $scope.weekArray[j].active = false;
            }
            $scope.weekArray[i].active = true;
            $scope.viewControlObject.mainTitleDate = $scope.weekArray[i].startDate.displayFormat;
          };
        } else if (i = $scope.weekArray.length) {
          return function () {
            $scope.viewControlObject.mainTitleDate = $scope.weekArray[0].startDate.displayFormat;
            $scope.getNeoData($scope.weekArray[0].startDate.apiFormat, $scope.weekArray[0].endDate.apiFormat);
            for (var j = 0; j < $scope.weekArray.length; j++) {
              $scope.weekArray[j].active = false;
            }
            $scope.weekArray[0].active = true;
            $scope.autoLoopLabel = "Play week loop";
          };
        }
      };

      $timeout(timeOutGetter(i), 4000 * i);
    }
  };

  $scope.$on('$viewContentLoaded', function () {
    $scope.viewControlObject.mainTitleDate = $scope.weekArray[0].startDate.displayFormat;
    console.log($scope.weekArray);
    $scope.viewControlObject.showMainTitleDate = true;
    $scope.getNeoData($scope.weekArray[0].startDate.apiFormat, $scope.weekArray[0].endDate.apiFormat);
    $scope.weekArray[0].active = true;
  });

  // window.onload = function() {
  //   $scope.viewControlObject.mainTitleDate = $scope.weekArray[0].startDate.displayFormat;
  //   console.log($scope.weekArray)
  //   $scope.viewControlObject.showMainTitleDate = true;
  //   $scope.getNeoData($scope.weekArray[0].startDate.apiFormat, $scope.weekArray[0].endDate.apiFormat);
  //   $scope.weekArray[0].active = true;
  // };

});
'use strict';

angular.module('nasaViewer').service('neoDeserialServ', function () {

  this.processNeoData = function (json) {

    var neoObjects = [];

    // loop through days of week
    for (var date in json.near_earth_objects) {
      // for each day, loop through asteroid objects
      for (var i = 0; i < json.near_earth_objects[date].length; i++) {

        var newNeoObj = {};
        var rawNeoObj = json.near_earth_objects[date][i];

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

        neoObjects.push(newNeoObj);
      };
    }
    return {
      children: neoObjects
    };
  };
});
'use strict';

angular.module('nasaViewer').service('neoService', function ($http, neoDeserialServ, dateService) {

  //NASA api key
  var apiKey = "2DGaM1ahLanQmj6wbsyHjLpe54YCodSEzsvm4cjZ";

  // http request for all neo with nearest approach over next 7 days
  this.getNeoData = function (startDate, endDate) {

    var neoDataRequest = {

      method: "GET",
      url: "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + startDate + "&end_date=" + endDate + "&api_key=" + apiKey
    };

    var promise = $http(neoDataRequest).then(function (response) {
      // strip header and hand off to deserializing service

      return neoDeserialServ.processNeoData(response.data);
    });

    return promise; //must return the promise for accessing functions
  };
});
'use strict';

angular.module('nasaViewer').service('resizeService', function () {

  this.calculateElementWidth = function (element) {
    if (!element.offsetWidth) {
      return 0;
    }

    var style = window.getComputedStyle(element);
    var width = element.offsetWidth;
    var margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    var padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    var border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

    return width;
  };

  this.calculateElementHeight = function (element) {
    if (!element.offsetHeight) {
      return 0;
    }

    var style = window.getComputedStyle(element);
    var height = element.offsetHeight;
    var margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    var padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    var border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

    return height;
  };
});
//# sourceMappingURL=bundle.js.map
