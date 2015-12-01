//Global Variables
var width = 960;
var height = 600;
var $window;
var $graphic;
var $details;
var GRAPHICINFO = require("../data/GRAPHICINFO.json");
var VAL_COLUMN = "average_of_change";
var DATA_URL = getDataURL(GRAPHICINFO.DATA_URL);
var topojson_features_obj = "counties";
var _ = require("lodash");
var tooltip;
var path;
var svg;
var map;
var scale;
var currentStep = 0;
var projection;

//bundle map data into file
var GRAPHICDATA;

var colorScale = d3.scale.linear()
  .range(['#deebf7', '#3182bd']);

   


var COLORS2 = ['#F9DE00','#F5AE1B','#D22333'].reverse();
var COLORS = ['#000000', '#1A549C','#0095C4'];
var scaleBreaks = [0, 5, 15];
var scaleBreaks2 = [-15, -5, 0];

function getDataURL(dataURL) {
  var hostname = window.location.hostname;
  var dataURLSplit = dataURL.split('/');
  var filename = dataURLSplit[dataURLSplit.length - 1];
  if ((hostname == "localhost" || hostname == "10.0.2.2")) {
    dataURL = 'data/' + filename;
  } else if (hostname == "www.gannett-cdn.com") {
    dataURL = dataURL;
  } else {
    dataURL = "http://" + hostname + "/services/webproxy/?url=" + dataURL;
  }
  return dataURL;
}


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
        // if (val > scaleBreaks[4]) {
        //   return COLORS[4];
        // } else if (val > scaleBreaks[3]) {
        //   return COLORS[3];
        // } else if (val > scaleBreaks[2]) {
        //   return COLORS[2];
        // } else if (val > scaleBreaks[1]) {
        //   return COLORS[1];
        // } else if (val === 0) {
        //   return "none";
        // } else {
        //   return COLORS[0];
        // }
        if (val === 0) {
          return "none";
        } else {
          return COLORS[2];
        }
    }
}





  

function start() {
    
    
    $window = $(window);
    $graphic = $('#' + GRAPHICINFO.GRAPHIC_SLUG);
    $details = $graphic.find('#details');
    d3.json(DATA_URL, ready);
    addEventListeners();
}


function addLegend() {
    var html = "<div class='map-legend'>change in water level in feet<div>";
    scaleBreaks.reverse().forEach(function(breakpoint, i) {
        html += "<span style='display: inline-block;width:20px; height:20px;background-color:" + COLORS.reverse()[i] +"'></span><span>>" + breakpoint + "</span>";
    });
    scaleBreaks2.reverse().forEach(function(breakpoint, i) {
        html += "<span style='display: inline-block;width:20px; height:20px;background-color:" + COLORS2.reverse()[i] +"'></span><span><" + breakpoint + "</span>";
    });
    html += "</div>"
    $('#legend').html(html);
}

function ready(data) {
  console.log(data);
    width = $(window).width();
    height = width * (9/16);
    scale = width/1.2;
    $graphic.empty();
    if (GRAPHICINFO.FULL_WIDTH) {
      $('#' + GRAPHICINFO.GRAPHIC_SLUG).parents('.story-asset').height(height);
    }
    if(!GRAPHICDATA) {
      GRAPHICDATA = data;
    }
    var geo = {
      type: "FeatureCollection",
      features: topojson.feature(data, data.objects[topojson_features_obj]).features
    };

    var center = d3.geo.centroid(geo);

    projection = d3.geo.albersUsa()
    .scale(scale)
    .translate([width/2, height / 2]);

    path = d3.geo.path()
      .projection(projection);

    var graticule = d3.geo.graticule();



    svg = d3.select("#" + GRAPHICINFO.GRAPHIC_SLUG).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "rgba(255, 255, 255, 0.5)")
    .attr("style", "background: black")
    .on("click", nextStep);

    map = svg.append('g')
        .attr('class', 'gig-map')
        .attr("height", height)
        .attr("width", width);

    map.append('path')
      .datum(topojson.merge(data, data.objects["counties"].geometries))
      .attr("class", "country-shape")
      .attr("d", path);

    map.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(geo.features)
    .enter().append("path")
      .attr("fill", function(d) { 
              // console.log(path.centroid(d));
              if (d.properties[VAL_COLUMN]) {
                return getColor(+d.properties[VAL_COLUMN]);
              } else {
                return "#D4D4D4";
              }
      })
      .attr("class", function(d) {
              if (d.properties.ogallala_overlap == "t") {
                return "us-county-ogallala";
              } else {
                return "";
              }
      })
      .attr("d", path)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);

     tooltip = d3.select("#" + GRAPHICINFO.GRAPHIC_SLUG).append("div")
        .attr("class", "gig-tooltip")
        .style("display", "none");

      addLegend();
      

}

function nextStep() {
  console.log("next");
  if (currentStep === 0) {
    addOgallalaHighlight();
    currentStep++;
  } else {
    removeOgallalaHighlight();
    currentStep--;
  }
}

function addOgallalaHighlight() {
  zoomIn([-100.851404, 37.482529]);
  map.classed("ogallala-highlight", true);
}

function removeOgallalaHighlight() {
  zoomOut();
  map.classed("ogallala-highlight", false);
}

function zoomIn(center) {
  // var center = ;
  // var center = [-122.437609, 37.742687];
  // var center = [-73.991744, 40.748235];
  var coordinates = projection(center);
  var zoomLevel = 2;
  map.transition()
      .duration(500)
      .attr("transform", "translate(" + ((width/2) - (coordinates[0] * zoomLevel)) + ", " + ((height/2) - coordinates[1] * zoomLevel) + ")scale(" + zoomLevel + ")");

      
}

function zoomed() {
  console.log(d3.event.scale);
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function zoomOut() {
  map.transition()
      .duration(500)
      .attr("transform", "");
}

function mouseover(d) {
  tooltip.style("display", "block");
  tooltip.html("<p>" + d.properties.name + "</p>" + "average water level change: " + d.properties[VAL_COLUMN]);
}

function mousemove() {
  tooltip
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 12) + "px");
}

function mouseout(d) {
  tooltip.style("display", "none");
}

function addEventListeners() {
  $window.on("resize", function(e) {
    _.throttle(ready, 200)(GRAPHICDATA);
  });
}

function getGraphicLocation() {
  var windowScroll = $window.scrollTop();
  var graphicTop = $graphic.offset().top;
  return graphicTop - windowScroll;
}

function onScroll(e) {
  var graphicLocation = getGraphicLocation();
  if (graphicLocation <= 0) {
    e.preventDefault();
    e.stopPropagation();
    console.log("top!");
  }
  console.log(graphicLocation);
}
document.addEventListener("DOMContentLoaded", start);