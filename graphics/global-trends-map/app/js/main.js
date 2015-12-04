//Global Variables
var width = 960;
var height = 600;
var $window;
var $graphic;
var $details;
var GRAPHICINFO = require("../data/GRAPHICINFO.json");
var VAL_COLUMN = "sub-surface_storage_trends_mm_per_yr";
var DATA_URL = getDataURL(GRAPHICINFO.DATA_URL);
var topojson_features_obj = "world_aquifer_systems_nocoast";
var _ = require("lodash");
var queue = require("queue-async");
var tooltip;
var path;

//bundle map data into file
var GRAPHICDATA;

var colorScale = d3.scale.linear()
  .range(['#deebf7', '#3182bd']);

   


var COLORS2 = ['#feedaf','#fee27b','#fecb2e'].reverse();
var COLORS = ['#addefd','#77cafd','#1b9efc'];
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
    $window = $(window);
    $graphic = $('#' + GRAPHICINFO.GRAPHIC_SLUG);
    $details = $graphic.find('#details');
    // queue()
    //   .defer(d3.json, DATA_URL)
    //   .defer(d3.json, "data/test.topo.json")
    //   .await(ready);
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

function ready(err, data, data2) {
  console.log(data);
  console.log(data2);
    width = $(window).width();
    height = width * (9/16);
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

    var projection = d3.geo.naturalEarth()
    .scale(width / 6)
    .center(center)
    .translate([width/1.8, height / 2.8]);

    path = d3.geo.path()
      .projection(projection);

    var graticule = d3.geo.graticule();



    var svg = d3.select("#" + GRAPHICINFO.GRAPHIC_SLUG).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "rgba(255, 255, 255, 0.5)")
    .attr("style", "background: black");

    svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

    svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);


    svg.append('path')
      .datum(topojson.merge(data, data.objects["ne_110m_land"].geometries))
      .attr("class", "country-shape")
      .attr("d", path);

    svg.append("g")
      .attr("class", "india-states")
    .selectAll("path")
      .data(geo.features)
    .enter().append("path")
      .attr("fill", function(d) { 
              // console.log(path.centroid(d));
              if (d.properties[VAL_COLUMN]) {
                return getColor(+d.properties[VAL_COLUMN]);
              } else {
                return "none";
              }
      })
      .attr("d", path)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);

      // svg.append("g")
      //   .selectAll("path")
      //   .data(topojson.feature(data2, data2.objects.test).features)
      //   .enter()
      //   .append("path")
      //   .attr("fill", function(d) {
      //     if (d.properties.DN !== 0) {
      //       return "steelblue";
      //     } else {
      //       console.log(d.properties.DN);
      //       return "none";
      //     }
      //   })
      //   .attr("opacity", 0.5)
      //   .attr("d", path);

     tooltip = d3.select("#" + GRAPHICINFO.GRAPHIC_SLUG).append("div")
        .attr("class", "gig-tooltip")
        .style("display", "none");

      addLegend();
      

}

function mouseover(d) {
  tooltip.style("display", "block");
  tooltip.text(d.properties.aquifer_name);
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