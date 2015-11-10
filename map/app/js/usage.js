var d3 = require('d3');
var queue = require("queue-async");
var topojson = require('topojson');
var mapbox = require('mapbox.js');
var _ = require('lodash');
var $ = require('jquery');

var width = 960,
    height = 600;

var rateById = d3.map();

var VAL_COLUMN = "pcnt_groundwater";
var DATA_URL = "data/county_usage_average_2010.topojson.json";



  var colorScale = d3.scale.linear()
    .range(['#deebf7', '#3182bd']);

   

  var COLORS = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
  var scaleBreaks = [0, .25, .5, .75, 1]



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
        .defer(d3.json, DATA_URL)
        // .defer(d3.csv, "data/county_output.csv")
        .await(ready);
}


function addLegend() {
    var html = "<div>percent of total water consumed that is groundwater<div>";
    _.each(scaleBreaks, function(breakpoint, i) {
        html += "<span style='display: inline-block;width:20px; height:20px;background-color:" + COLORS[i] +"'></span><span>" + parseInt(breakpoint * 100) + "%</span>";
    });
    html += "</div>"
    $('body').append(html);
}

function ready(error, us, usage) {
    if (error) throw error;
    console.log(usage);
    // colorScale.domain(d3.extent(usage.objects.countyp010.geometries, function(d) {
    //   console.log(d);
    //   return +d.properties[VAL_COLUMN];
    // }));

    // console.log(d3.extent(usage.objects.countyp010.geometries, function(d) {
    //   return +d.properties[VAL_COLUMN];
    // }));


    svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(usage, usage.objects.countyp010).features)
    .enter().append("path")
      .attr("fill", function(d) { 
              
              if (d.properties[VAL_COLUMN]) {
                var val =+d.properties[VAL_COLUMN];
                if (val >= scaleBreaks[4]) {
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
      .attr("d", path);

      // svg.append("path")
      // .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      // .attr("class", "states")
      // .attr("d", path);

      addLegend();
      

}


document.addEventListener("DOMContentLoaded", init);
