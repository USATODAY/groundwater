var d3 = require('d3');
var queue = require("queue-async");
var topojson = require('topojson');
var mapbox = require('mapbox.js');
var _ = require('lodash');
var $ = require('jquery');

var width = 960,
    height = 600;

var rateById = d3.map();

var plusScale = d3.scale.quantize()
    .range(['rgb(217,239,139)','rgb(166,217,106)','rgb(102,189,99)','rgb(26,152,80)']);

var minusScale = d3.scale.quantize()
    .range(['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,139)']);

var quantile = d3.scale.quantile()
    .range(['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,144)','rgb(224,243,248)','rgb(171,217,233)','rgb(116,173,209)','rgb(69,117,180)'].reverse());


var quantize = d3.scale.quantize()
    .range(['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,144)','rgb(224,243,248)','rgb(171,217,233)','rgb(116,173,209)','rgb(69,117,180)'].reverse());

var colors = ['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,139)','rgb(255,255,191)','rgb(217,239,139)','rgb(166,217,106)','rgb(102,189,99)','rgb(26,152,80)'];
var scaleBreaks = [20, 10, 5, 2, 0, -2, -5, -10, -20];

var projection = d3.geo.albersUsa()
    .scale(1280)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

function init() {
    queue()
        .defer(d3.json, "data/us_topo.json")
        .defer(d3.json, "data/aquifers_topo_reilly.json")
        // .defer(d3.csv, "data/county_output.csv")
        .await(ready);
}

function lookup_county(state, county, counties) {
    return _.findWhere(counties, {"state": state, "county": county});
}
function addLegend() {
    var html = "<div> decrase from 1995 to 2015</div><div>";
    _.each(scaleBreaks, function(breakpoint, i) {
        html += "<span style='display: inline-block;width:20px; height:20px;background-color:" + colors[i] +"'></span><span>" + breakpoint + "</span>";
    });
    html += "</div>"
    $('body').append(html);
}

function ready(error, us, aquifers, county_data) {
    if (error) throw error;

    // minusScale.domain([d3.extent(county_data, function(d) { return parseFloat(d.average_change)})[1], 0]);
    // plusScale.domain([0, d3.extent(county_data, function(d) { return parseFloat(d.average_change)})[0]]);

    // var allValues = _.map(county_data, function(d) { return parseFloat(d.average_change)}).sort(d3.descending);
    // quantile.domain(allValues);
    // quantize.domain(d3.extent(county_data, function(d) { return parseFloat(d.average_change)}));

    svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("fill", function(d) { 
          var c = lookup_county(d.properties.STATE, d.properties.COUNTY, county_data); 
          // if (c) { 
              // var val = parseFloat(c.average_change);
              // if (val > scaleBreaks[0]) {
              //   return colors[0]
              // } else if (val > scaleBreaks[1]) {
              //   return colors[1]
              // } else if (val > scaleBreaks[2]) {
              //   return colors[2]
              // } else if (val > scaleBreaks[3]) {
              //   return colors[3]
              // } else if (val > scaleBreaks[4]) {
              //   return colors[4]
              // } else if (val > scaleBreaks[5]) {
              //   return colors[5]
              // } else if (val > scaleBreaks[6]) {
              //   return colors[6]
              // } else if (val > scaleBreaks[7]) {
              //   return colors[7]
              // } else {
              //   return colors[8];
              // }
          // } else { 
              return "rgba(0, 0, 0, 0.75)"; 
          // }
      })
      .attr("d", path)
      .on("click", function(d) {
        var c = lookup_county(d.properties.STATE, d.properties.COUNTY, county_data);
        console.log(c);
      });

      svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);


      svg.append('g')
        .attr("class", "aquifers")
        .selectAll(".aquifer")
        .data(topojson.feature(aquifers, aquifers.objects.us_aquifers).features)
      .enter()
      .append("path")
      .attr("class", "aquifer")
      .attr("fill", function(d) {
          if (d.properties.avg_decrease) {
             var val = parseFloat(d.properties.avg_decrease);
             var color;
             // console.log(val);
             if (val > scaleBreaks[0]) {
                color = colors[0]
              } else if (val > scaleBreaks[1]) {
                color = colors[1]
              } else if (val > scaleBreaks[2]) {
                color = colors[2]
              } else if (val > scaleBreaks[3]) {
                color = colors[3]
              } else if (val > scaleBreaks[4]) {
                color = colors[4]
              } else if (val > scaleBreaks[5]) {
                color = colors[5]
              } else if (val > scaleBreaks[6]) {
                color = colors[6]
              } else if (val > scaleBreaks[7]) {
                color = colors[7]
              } else {
                color = colors[8];
              }
              // console.log(color);
              return color;
          } else {
            return "none";
          }
      })
      .attr("d", path);

      addLegend();
}

function initMapbox(error, us, aquifers) {
    L.mapbox.accessToken = 'pk.eyJ1IjoidXNhdG9kYXlncmFwaGljcyIsImEiOiJ0S3BGdndrIn0.5juF5LWz_GRcndian32tZA';
     var map = L.mapbox.map('mapboxmap', 'usatodaygraphics.satellite', {
                maxZoom: 8,
                zoomControl: false
            }).setView([39.50, -98.35], 3);

    var geojson = topojson.feature(aquifers, aquifers.objects.us_aquifers);
    L.geoJson(geojson, {
        style: function(feature) {
            var color;
            if (feature.properties.avg_decrease) {
                console.log(feature);
                var val = parseFloat(feature.properties.avg_decrease);
                 if (val > scaleBreaks[0]) {
                    color = colors[0]
                  } else if (val > scaleBreaks[1]) {
                    color = colors[1]
                  } else if (val > scaleBreaks[2]) {
                    color = colors[2]
                  } else if (val > scaleBreaks[3]) {
                    color = colors[3]
                  } else if (val > scaleBreaks[4]) {
                    color = colors[4]
                  } else if (val > scaleBreaks[5]) {
                    color = colors[5]
                  } else if (val > scaleBreaks[6]) {
                    color = colors[6]
                  } else if (val > scaleBreaks[7]) {
                    color = colors[7]
                  } else {
                    color = colors[8];
                  }
            } else {
                color = "none";
            }

            return {
                color: color,
                opacity: 0.9
            };

        }
    }).addTo(map);
}

document.addEventListener("DOMContentLoaded", init);
