var d3 = require('d3');
var queue = require("queue-async");
var topojson = require('topojson');
var mapbox = require('mapbox.js');
var _ = require('lodash');
var $ = require('jquery');

var width = 960,
    height = 600;

var rateById = d3.map();

var VAL_COLUMN = "TO-WGWTo";
var DATA_URL = "data/county_usage_2010.json";
var $details;



  var colorScale = d3.scale.linear()
    .range(['#deebf7', '#3182bd']);

   

  var COLORS = ['#eff3ff','#c6dbef','#9ecae1','#6baed6','#3182bd','#08519c'];
  var scaleBreaks = [0, 1, 5, 10, 50, 100]



var projection = d3.geo.albersUsa()
    .scale(1280)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

function init() {
    queue()
        .defer(d3.json, "data/us_topo.json")
        .defer(d3.json, DATA_URL)
        // .defer(d3.csv, "data/county_output.csv")
        .await(ready);
}


function addLegend() {
    var html = "<div class='map-legend'>groundwater consumed in millions of gallons per day<div>";
    _.each(scaleBreaks, function(breakpoint, i) {
        html += "<span style='display: inline-block;width:20px; height:20px;background-color:" + COLORS[i] +"'></span><span>>" + breakpoint + "</span>";
    });
    html += "</div>"
    $('#legend').html(html);
}

function ready(error, us, usage) {
    if (error) throw error;
    // colorScale.domain(d3.extent(usage.objects.countyp010.geometries, function(d) {
    //   console.log(d);
    //   return +d.properties[VAL_COLUMN];
    // }));

    // console.log(d3.extent(usage.objects.countyp010.geometries, function(d) {
    //   return +d.properties[VAL_COLUMN];
    // }));

    $details = $('#details');
    svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(usage, usage.objects.counties).features)
    .enter().append("path")
      .attr("fill", function(d) { 
              if (d.properties[VAL_COLUMN]) {
                var val =+d.properties[VAL_COLUMN];
                if (val >= scaleBreaks[5]) {
                  return COLORS[5];
                } else if (val > scaleBreaks[4]) {
                  return COLORS[4];
                } else if (val > scaleBreaks[3]) {
                  return COLORS[3];
                } else if (val > scaleBreaks[1]) {
                  return COLORS[2];
                } else if (val > scaleBreaks[1]) {
                  return COLORS[1];
                } else {
                  return COLORS[0];
                }
              } else {
                return "none";
              }
      })
      .attr("d", path)
      .on("mouseover", mouseOver)
      .on("mouseout", mouseOut);

      svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);

      addLegend();
      

}
function mouseOut(d) {
  d3.select(this).classed("county-active", false);
  console.log(this);
}
function mouseOver(d) {
  d3.select(this).classed("county-active", true);
  console.log(this);
  var content;
  if (d.properties[VAL_COLUMN]) {
    content = "<h3 class='county'>" + d.properties.COUNTY + ", " + d.properties.STATE + "</h3> <p><strong>2010 Groundwater consumed per day: </strong>" + d.properties[VAL_COLUMN] + " million gallons</p>";
  } else {
    content = "<h3 class='county'>" + d.properties.COUNTY + ", " + d.properties.STATE + "</h3> <p>no groundwater data for this county</p>"
  }
  $details.html(content);
}


document.addEventListener("DOMContentLoaded", init);
