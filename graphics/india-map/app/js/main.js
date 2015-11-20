//Global Variables
var width = 960;
var height = 600;
var $window;
var $graphic;
var $details;
var GRAPHICINFO = require("../data/GRAPHICINFO.json");
var VAL_COLUMN = "differece";
var DATA_URL = getDataURL(GRAPHICINFO.DATA_URL);

//bundle map data into file
var GRAPHICDATA = require("../data/india.topo.json");


var colorScale = d3.scale.linear()
  .range(['#deebf7', '#3182bd']);

   


var COLORS2 = ['#e06666','#cc0000','#660000'].reverse();
var COLORS = ['#b6d7a8','#6aa84f','#38761d'];
var scaleBreaks = [0, 10, 50];
var scaleBreaks2 = [-50, -10, 0];

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





  

function start() {
    width = $(window).width();
    height = width * (6/16);
    if (GRAPHICINFO.FULL_WIDTH) {
      $('#india-map').parents('.story-asset').height(height);
    }
    $window = $(window);
    $graphic = $('#' + GRAPHICINFO.GRAPHIC_SLUG);
    $details = $graphic.find('#details');
    // d3.json(DATA_URL, ready);
    ready(GRAPHICDATA);
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

function ready(india) {

    var geo = {
      type: "FeatureCollection",
      features: topojson.feature(india, india.objects.IND_adm3).features
    };

    var center = d3.geo.centroid(geo);

    var projection = d3.geo.mercator()
    .scale(1080)
    .center(center)
    .translate([width / 2, height / 2]);

    var path = d3.geo.path()
    .projection(projection);

    var svg = d3.select("#india-map .gig-graphic-slide-1").append("svg")
    .attr("width", width)
    .attr("height", height);


    svg.append('path')
      .datum(topojson.merge(india, india.objects.IND_adm3.geometries))
      .attr("class", "country-shape")
      .attr("d", path);

    svg.append("g")
      .attr("class", "india-states")
    .selectAll("path")
      .data(geo.features)
    .enter().append("path")
      .attr("fill", function(d) { 
              if (d.properties[VAL_COLUMN]) {
                return getColor(+d.properties[VAL_COLUMN]);
              } else {
                return "none";
              }
      })
      .attr("d", path);
      // .on("mouseover", mouseOver)
      // .on("mouseout", mouseOut);

      
      addLegend();
      

}
function mouseOut(d) {
  d3.select(this).classed("county-active", false);
}

function mouseOver(d) {
  d3.select(this).classed("county-active", true);
  var content;
  if (d.properties[VAL_COLUMN]) {
    content = "<h3 class='county'>" + d.properties.COUNTY + ", " + d.properties.STATE + "</h3> <p><strong>2010 Groundwater consumed per day: </strong>" + d.properties[VAL_COLUMN] + " million gallons</p>";
  } else {
    content = "<h3 class='county'>" + d.properties.COUNTY + ", " + d.properties.STATE + "</h3> <p>no groundwater data for this county</p>"
  }
  $details.html(content);
}

function getGraphicLocation() {
  var windowScroll = $window.scrollTop();
  var graphicTop = $graphic.offset().top;
  return graphicTop - windowScroll;
}

function onScroll(e) {
  console.log(e);
  var graphicLocation = getGraphicLocation();
  if (graphicLocation <= 0) {
    e.preventDefault();
    e.stopPropagation();
    console.log("top!");
  }
  console.log(graphicLocation);
}
document.addEventListener("DOMContentLoaded", start);