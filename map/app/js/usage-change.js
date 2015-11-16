var d3 = require('d3');
var queue = require("queue-async");
var topojson = require('topojson');
var mapbox = require('mapbox.js');
var _ = require('lodash');
var $ = require('jquery');

var width = 960,
    height = 600;

var rateById = d3.map();

var VAL_COLUMN = "usage_difference";
var DATA_URL = "data/county_usage_change.topojson.json";



var colorScale = d3.scale.linear()
  .range(['#deebf7', '#3182bd']);

 

var COLORS = ['#e0f3f8','#abd9e9','#74add1','#4575b4','#313695'];
var COLORS2 = ['#a50026','#d73027','#f46d43','#fdae61','#fee090'];
var scaleBreaks = [0, 10, 50, 100, 500];
var scaleBreaks2 = [-500, -100, -50, -10, 0];

function getColor(val) {
    if (val < 0) {
        if (val < scaleBreaks2[0]) {
          return COLORS2[0];
        } else if (val < scaleBreaks2[1]) {
          return COLORS2[1];
        } else if (val < scaleBreaks2[2]) {
          return COLORS2[2];
        } else if (val < scaleBreaks2[3]) {
          return COLORS2[3];
        } else {
          return COLORS2[4];
        }
    } else {
        if (val > scaleBreaks[4]) {
          return COLORS[4];
        } else if (val > scaleBreaks[3]) {
          return COLORS[3];
        } else if (val > scaleBreaks[2]) {
          return COLORS[2];
        } else if (val > scaleBreaks[1]) {
          return COLORS[1];
        } else {
          return COLORS[0];
        }
    }
}



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
                return getColor(+d.properties[VAL_COLUMN]);
              } else {
                console.log(d.properties);
                return "grey";
              }
      })
      .attr("d", path);

      // svg.append("path")
      // .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      // .attr("class", "states")
      // .attr("d", path);

      // addLegend();
      

}


document.addEventListener("DOMContentLoaded", init);
