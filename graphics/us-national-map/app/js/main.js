//Global Variables
var queue = require("queue-async");
var width = 960;
var height = 600;
var $window;
var $graphic;
var $details;
var $embedModule;
var GRAPHICINFO = require("../data/GRAPHICINFO.json");
var VAL_COLUMN = "avg_chg";
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

var colorScale = d3.scale.quantile()
  .domain([-15, -5, 0])
  .range(['#D22333','#F5AE1B', '#F9DE00']);

   


var COLORS2 = ['#D22333','#F5AE1B', '#F9DE00'];
var COLORS = ['papayawhip', '#0095C4','#0095C4'];
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
        return colorScale(val);
    } else {
        if (val === 0) {
          return "none";
        } else {
          return '#0095C4';
        }
    }
}





  

function start() {
    
    
    $window = $(window);
    $graphic = $('#' + GRAPHICINFO.GRAPHIC_SLUG);
    $details = $graphic.find('#details');
    $embedModule = $('#' + GRAPHICINFO.GRAPHIC_SLUG).parents('.oembed-asset');
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

var reDraw = _.throttle(ready, 500, {
  leading: false,
  trailing: true
});

function ready(data) {
  console.log(data);
    width = $(window).width();
    height = width * (9/16);
    scale = width/1.2;
    $graphic.empty();

    if (GRAPHICINFO.FULL_WIDTH) {
      $embedModule.height(height);
    }
    if(!GRAPHICDATA) {
      GRAPHICDATA = data;
    }
    var geo = {
      type: "FeatureCollection",
      features: topojson.feature(data, data.objects[topojson_features_obj]).features
    };

    projection = d3.geo.albersUsa()
    .scale(scale)
    .translate([width/2, height / 2]);

    path = d3.geo.path()
      .projection(projection);


    svg = d3.select("#" + GRAPHICINFO.GRAPHIC_SLUG).append("svg")
    .attr("width", width)
    .attr("height", height)
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
          if (d.properties[VAL_COLUMN]) {
            return getColor(parseFloat(d.properties[VAL_COLUMN]));
          } else {
            return "none";
          }
      })
      .attr("stroke", function(d) {
          return "#D4D4D4";
      })
      .attr("stroke-width", 0.25)
      .attr("class", function(d) {
              if (d.properties.ogallala == "t") {
                return "us-county-highlight";
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
  map.classed("gig-county-highlight", true);
}

function removeOgallalaHighlight() {
  zoomOut();
  map.classed("gig-county-highlight", false);
}

function zoomIn(center) {
  var coordinates = projection(center);
  var zoomLevel = 2;
  map.transition()
      .duration(500)
      .attr("transform", "translate(" + ((width/2) - (coordinates[0] * zoomLevel)) + ", " + ((height/2) - coordinates[1] * zoomLevel) + ")scale(" + zoomLevel + ")");
}

function zoomOut() {
  map.transition()
      .duration(500)
      .attr("transform", "");
}

function mouseover(d) {
  tooltip.style("display", "block");
  tooltip.html("<p>" + d.properties.n + "</p>" + "average water level change: " + d.properties[VAL_COLUMN] + " ft.");
}

function mousemove() {
  var top = (d3.event.pageY - 12);
  if ($embedModule.length > 0) {
    top = top - $embedModule.offset().top;
  }
  tooltip
      .style("left", (d3.event.pageX) + "px")
      .style("top", top + "px");
}

function mouseout(d) {
  tooltip.style("display", "none");
}

function addEventListeners() {
  $window.on("resize", function(e) {
    reDraw(GRAPHICDATA);
  });
}

document.addEventListener("DOMContentLoaded", start);