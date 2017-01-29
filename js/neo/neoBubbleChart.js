angular.module('nasaViewer').directive('bubbleChart', ['resizeService', function(resizeService) {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        radiusSelector: '=',
        colorSelector: "="
      },
      link: function($scope, elem, attrs) {
          const chartCanvas = elem[0];
          let width = resizeService.calculateElementWidth(chartCanvas);
          let height = resizeService.calculateElementHeight(chartCanvas);
          let diameter = width;

          window.onresize = function(event) {
            width = resizeService.calculateElementWidth(chartCanvas);
            height = resizeService.calculateElementHeight(chartCanvas);
            updateChart();
          }

          $scope.$watch("data", function(n, o) {
            if (n !== o) {
              updateChart();
            }
          });

          $scope.$watch("radiusSelector", function(n, o) {
            if (n !== o) {
              updateChart();
            }
          });

          $scope.$watch("colorSelector", function(n, o) {
            if (n !== o) {
              updateChart();
            }
          });

          //definitions

          var format = d3.format(",d");

          // initialize color interpolator function
          var colorInterpolator = d3.interpolateHcl("#750076", "#ffa346");

          // Initialize tooltips
          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(function(d) {
              return "<span class='tooltip-title'>NEO name:</span> <span class='tooltip-value'>" + d.neoName + "</span>" + "<br />" + "<span class='tooltip-title'>Estimated Diameter:</span> <span class='tooltip-value'>" + d.estDiameterKm.toFixed(2) + " km</span>" + "<br />" + "<span class='tooltip-title'>Closest approach:</span> <span class='tooltip-value'>" + (d.missDistanceKm / 385000).toFixed(2) + " LD</span>" + "<br />" + "<span class='tooltip-title'>Relative velocity:</span> <span class='tooltip-value'>" + ((+d.relVelocityKph).toExponential(1).toUpperCase().replace(/\+/g, "")) + " km/h</span>" + "<br />" + "<span class='tooltip-title'>Orbiting:</span> <span class='tooltip-value'>" + d.orbitBody + "</span>";
            })

          //create svg html element for directive and set attributes
          //normally done outside update function
          let svg = d3.select(elem[0])
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "bubble")
    
            .call(tip)


          function updateChart() {
            var radiusSelector = $scope.radiusSelector;
            var colorSelector = $scope.colorSelector;
            var data = $scope.data;

            //define pack
            var packing = d3.layout.pack()
              .sort(null)
              .size([width, height])
              .value(function(d) {
                return d[radiusSelector]; // VALUE ACCESSOR -- change this to a variable
              })
              .padding(5);

            //color interpolation max and min
            var max, min;
            data.children.forEach(function(e) {
              max = (+e[colorSelector] < +max ? +max : +e[colorSelector]);
              min = (+e[colorSelector] > +min ? +min : +e[colorSelector]);
            });

            if (data && data.children.length > 0) {
              packing.radius()

              var node = svg.selectAll(".node")
                .data(packing.nodes(data)
                  .filter(function(d) { //commenting this out gives container circle a blue background?
                    return !d.children;
                  })
                );

              node.exit().transition().duration(0).remove();

              node.select("text").remove()

              node.enter().append("g")
                .classed("node", true)
                .attr("transform", function(d) {
                  return "translate(" + d.x + "," + d.y + ")";
                })
                .append("circle")
                .attr("class", function(d) {
                  if (d.isPotHazard) {
                    return "is-hazard"
                  }
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)

              node.transition()
                .attr("transform", function(d) {
                  return "translate(" + d.x + "," + d.y + ")";
                });

              node.select("circle")
                .transition()
                .attr("r", function(d) {
                  return d.r;
                })

              node.append("text")
                .attr("dy", ".3em")
                .style("text-anchor", "middle")
                .style("pointer-events", "none")
                .text(function(d) {
                  return textHandler(d);
                });

              //for color redraw to work properly, it has to be part of a separate "select" function
              node.select("circle")
                .style("fill", function(d) {
                  return colorInterpolator((+d[colorSelector] - +min) / (+max - +min));
                })
                .attr('fill-opacity', 0.7)
                .attr('stroke', function(d) {
                  return colorInterpolator((+d[colorSelector] - +min) / (+max - +min));
                })
                .attr('stroke-width', 2)

            } //end of if statement
          } //end of update function
          function textHandler(d) {
            if (d.r < 25) {
              return "";
            }
            return d.neoName.substring(0, d.r / 2.8)
          }
        } //end of link
    } //end of return
  }]) //end of directive