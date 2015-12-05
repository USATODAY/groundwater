/**
 * TODO
 * - xx
 */

 // TODO - Canvid
 // var c = canvid({
 //
 // });
 // console.log(c);

/**
 * Setup platform detection
 */

if (typeof window.mobileCheck != "function") {
  window.mobileCheck = function() {
    var check = false;
    (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|ad|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };
}

/**
 * Setup Slider Interactive
 */

var GRAPHICINFO = require("../data/GRAPHICINFO.json");
var id = '#' + GRAPHICINFO.GRAPHIC_SLUG;
var WIDTH;
var HEIGHT;

var $el;                    // jquery saved reference to element
var offsetTop;              // offsetTop of id
var elHeight;               // total height of id
var progress;               // progress of scroll through entire element from 0 - 1
var progressBottom;               // progress of scroll compared to bottom of container
var progressPerSlide;       // progress of the scroll through specific slide
var progressWeight = 1.5;   // weighted factor to move animation progress faster (to finish animation before slide is out of view)
var targetValue;            // ending value for animation property
var pos;                    // position of scrollTop

var slidesLength;           // length of total slides in GRAPHICINFO.SLIDER_IMAGES
var sliderPosArray = [];    // array to store offset().top positions internally

var debugMode = false;      // set [true] to enable box to output stuff
var $debug;                 // jquery saved reference to debug element

var $window;
var $graphic;
var $details;
var $sliderBG;
var $embedModule;
var VAL_COLUMN = "avg_chg";
var DATA_URL = getDataURL(GRAPHICINFO.DATA_URL);
var topojson_features_obj = "counties";
var _ = require("lodash");
var queue = require("queue-async");
var tooltip;
var path;
var svg;
var map;
var scale;
var currentStep = 1;
var projection;
var width = 960;
var height = 600;
var GRAPHICDATA;
var GRAPHICDATA2;
var ogallalaDataURL = getDataURL("http://www.gannett-cdn.com/experiments/usatoday/2015/groundwater/graphics/map-scroll/data/ogallala.topojson.json");


function prepareContainers() {
  // set app container to height of viewport
  // $el.height(HEIGHT * GRAPHICINFO.SLIDER_IMAGES.length);
  // $el.find('.gig-slider-panel').height(HEIGHT);
  $el.find('.gig-slider-panel-text-container').css({"margin-bottom": HEIGHT - 75});
  $el.find('.gig-slider-background').height(HEIGHT);
  $el.height(HEIGHT * slidesLength);
  // $('.gig-slider-container').height(HEIGHT);

  // set framework wrapper container to height of viewport plus length of scroll
  // if ( $(id).parents('.story-oembed') ) {
  //   $(id).parents('.story-oembed').height(HEIGHT * GRAPHICINFO.SLIDER_IMAGES.length);
  // }
}

function setup() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight + 162; // 162 extra pixels to account for browser ui
  $sliderBG = $('#gig-slider-background-1');

  slidesLength = GRAPHICINFO.SLIDER_IMAGES.length;

  document.addEventListener('scroll', updatePosition);
  document.addEventListener('touchmove', updatePosition);

  $el = $(id);
  getNewStep();
  
  if (debugMode) {
    $('body').append('<div id="debug"></div>');
    $('#debug').css({
        'position': 'fixed',
        'bottom': '20px',
        'right': '20px',
        'padding': '20px',
        'background-color': 'orange',
        'z-index': '99999',
        'font-size': '2em'
    });
  }
  $debug = $('#debug');

  prepareContainers();

  offsetTop = $el.offset().top;
  elHeight  = $el.height();

  setDataPosition();
  start();
}

/**
 * [setDataPosition]
 * sets data attribute with offset().top position of each slide
 * also stores values in an array for internal use
 */
function setDataPosition() {
  $el.find('.gig-slider-panel').each(function(i, val) {
    $(val).attr('data-pos', $(val).offset().top);
    sliderPosArray.push( $(val).offset().top );
  });
  sliderPosArray.push( sliderPosArray[sliderPosArray.length-1] + HEIGHT );
}

function updatePosition(e) {
  pos = $(document).scrollTop();
  offsetTop = $el.offset().top;
  progress = (pos - offsetTop)/elHeight;
  if (pos + window.innerHeight > offsetTop) {
    progressBottom = ((pos + window.innerHeight) - offsetTop)/(elHeight);
  } else {
    progressBottom = 0;
  }
  if (debugMode) $debug.html(progressBottom);

  

  // for (var i = 0; i < sliderPosArray.length + 1; i++) {
  //   if ( pos > sliderPosArray[i] && pos <= sliderPosArray[i+1] ) {
  //     progressPerSlide = (pos - sliderPosArray[i]) / HEIGHT;

      /**
       * PER SLIDE CODE GOES HERE
       * use [progressPerSlide] to get progress of current slide 0-1
       */

       // if ( (progressPerSlide * progressWeight) < 0 ) {
       //   targetValue = 0;
       // }
       // else if ( (progressPerSlide * progressWeight) < 1 ) {
       //   targetValue = (progressPerSlide * progressWeight);
       // }
       // else {
       //   targetValue = 1;
       // }

       // $el.find('.gig-slider-background').eq(i+1).css({
       //   'opacity': targetValue
       // });
       // if ( $el.find('.gig-slider-background').eq(i+2) ) {
       //   $el.find('.gig-slider-background').eq(i+2).css({
       //     opacity: 0
       //   });
       // }

       /* END PER SLIDE CODE */
  //   }
  // }

  /**
   * ENTIRE ELEMENT PROGRESS ANIMATION GOES HERE
   * use [progress] to get progress of current slide 0-1
   */

   //fix bg 
  if (progress > 0 && progressBottom < 1) {
    $graphic.addClass("fixed");
  } else {
    $graphic.removeClass("fixed");
  }

  var newStep = getNewStep(progressBottom);
  if (newStep != currentStep) {
    currentStep = newStep;
    stepMap[newStep]();
  }
  // if (progress > .3 ) {
    // nextStep();
  // } else {
    // previousStep();
  // }
   if (progressBottom >= 1) {
     $graphic.addClass("bottom");
   } else {
     $graphic.removeClass("bottom");
   }
   if ( pos < offsetTop ) {
     $el.find('.gig-slider-background').eq(0).css({
       opacity: 1
     });
   }

   /* END SLIDE CODE */
}


/*
* Begin map code
*/
var scaleBreaks = [-15, -5, 0];
var scaleColors = ['#A56600','#F5AE1B', '#F6EB16'];

var colorScale = function(input) {
  var r;
  if (input <= scaleBreaks[0]) {
    r = scaleColors[0];
  } else if (input <= scaleBreaks[1]) {
    r = scaleColors[1];
  } else {
    r = scaleColors[2];
  }
  return r;
}
// var colorScale = d3.scale.quantize()
//   .domain(scaleBreaks)
//   .range(scaleColors);

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
  console.log(dataURL);
  return dataURL;
}


function getColor(val) {
    if (val < 0) {
        return colorScale(val);
    } else if (val === 0) {
          return "none";
    } else {
          return '#0095C4';
    }
}

function start() {
    $window = $(window);
    $graphic = $el.find(".gig-map");
    $details = $graphic.find('#details');
    $embedModule = $('#' + GRAPHICINFO.GRAPHIC_SLUG).parents('.oembed-asset, .oembed');
    queue()
      .defer(d3.json, DATA_URL)
      .defer(d3.json, ogallalaDataURL)
      .await(ready);
}


function addLegend() {
    var html = "<div class='map-legend'>decrease in water level<div>";
    scaleBreaks.forEach(function(breakpoint, i) {
        html += "<span style='display: inline-block;width:20px; height:20px;background-color:" + colorScale(breakpoint) +"'></span><span>>" + Math.abs(breakpoint) + " ft.</span>";
    });
    
        html += "<span style='display: inline-block;width:20px; height:20px;background-color:#0095C4'></span><span>no decrease</span>";
        html += "<p>Source: " + GRAPHICINFO.SOURCE + "</p>";
   
    html += "</div>"
    $graphic.append(html);
}

var reDraw = _.throttle(ready, 500, {
  leading: false,
  trailing: true
});

function ready(err, data, data2) {
    width = $(window).width();
    height = width * (9/16);
    scale = width/1.2;
    $graphic.empty();
    console.log(data);
    console.log(data2);

    $embedModule.height(HEIGHT * slidesLength + 30);
    if(!GRAPHICDATA) {
      GRAPHICDATA = data;
    }
    if(!GRAPHICDATA2) {
      GRAPHICDATA2 = data2;
    }
    var geo = {
      type: "FeatureCollection",
      features: topojson.feature(data, data.objects[topojson_features_obj]).features
    };

    projection = d3.geo.albersUsa()
    .scale(scale)
    .translate([WIDTH/2, HEIGHT / 2]);

    path = d3.geo.path()
      .projection(projection);


    svg = d3.select($graphic[0]).append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .attr("style", "background: black");

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
      .attr("class", function(d) {
          var classname = "";
          if (d.properties.ogallala == "t") {
            classname += " us-county-highlight";
          } 
          if (d.properties.fips == 20081) {
            classname += " haskell-highlight";
          }
          return classname;
      })
      .attr("d", path)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);

      

     tooltip = d3.select($graphic[0]).append("div")
        .attr("class", "gig-tooltip")
        .style("display", "none");

      addLegend();
}

//returns the correct step based on progress
function getNewStep(progress) {
  var padding = 0.05;
  progress = progress - padding;
  var breaks = [] //store each progress break point in this array
  _.each(d3.range(1,slidesLength), function(slideIndex) {
    var stepBreak = (1/slidesLength) * slideIndex;
    breaks.push(stepBreak);
  });
  if (progress > breaks[2]) {
    return 4;
  } else if (progress > breaks[1]) {
    return 3;
  } else if (progress > breaks[0]) {
    return 2;
  } else {
    return 1;
  }
}

//maps each step to a function
var stepMap = {
  1: removeOgallalaOutline,
  2: addOgallalaOutline,
  3: addOgallalaHighlight,
  4: showHaskell
}

function removeOgallalaOutline() {
  var shape = map.select('.ogallala-shape')
    .transition()
    .duration(500)
    .attr('opacity', 0);

  shape.remove();
}

function addOgallalaOutline() {
  removeOgallalaHighlight();
  var ogallala_data = topojson.feature(GRAPHICDATA2, GRAPHICDATA2.objects.ogallala).features;
  var shape = map.append("path")
        .data(ogallala_data)
        .attr("class", "ogallala-shape")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("fill", "#1B9CFA")
        .attr("opacity", 0)
        .attr("d", path);
 shape
    .transition()
    .duration(500)
    .attr('opacity', 0.8);

}

function addOgallalaHighlight() {
  removeOgallalaOutline();
  map.classed("gig-haskell-highlight", false);
  zoomIn([-100.851404, 37.482529], 2);
  map.classed("gig-haskell-highlight", false);
  map.classed("gig-county-highlight", true);
  map.select('.county-detail-text').remove();
}

function removeOgallalaHighlight() {
  zoomOut();
  map.classed("gig-county-highlight", false);
}

function showHaskell() {
  // zoomIn([-100.851404, 37.482529], 3);
  map.append('g')
    .attr('class', 'county-detail-text')
    .attr('transform', 'translate(' + projection([-100.851404, 37.482529]) + ')')
    .append('text')
    .attr("fill", "white")
    .attr('transform', 'translate(10, 5)')
    .text('Haskell, KS');
  map.classed("gig-county-highlight", false);
  map.classed("gig-haskell-highlight", true);
}

function zoomIn(center, zoomLevel) {
  var coordinates = projection(center);
  map.transition()
      .duration(500)
      .attr("transform", "translate(" + ((width/2) - (coordinates[0] * zoomLevel)) + ", " + ((HEIGHT/2) - coordinates[1] * zoomLevel) + ")scale(" + zoomLevel + ")");
}

function zoomOut() {
  map.transition()
      .duration(500)
      .attr("transform", "");
}

function mouseover(d) {
  tooltip.style("display", "block");
  tooltip.html("<p>" + d.properties.n + "</p>" + "average water level change: " + Math.round(d.properties[VAL_COLUMN] * 100) / 100 + " ft.");
}

function mousemove() {
  var top = (d3.event.pageY - 12) - $window.scrollTop();
  if (progress <= 0) {
    top = top - (offsetTop - $(document).scrollTop());
  }
  // if ($embedModule.length > 0) {
  //   top = top - $embedModule.offset().top;
  // }
  tooltip
      .style("left", (d3.event.pageX) + "px")
      .style("top", top + "px");
}

function mouseout(d) {
  tooltip.style("display", "none");
}



document.addEventListener('DOMContentLoaded', setup);
window.addEventListener('resize', function() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight + 162; // 162 extra pixels to account for browser ui
  prepareContainers();
  elHeight = $el.height();
  offsetTop = $el.offset().top;
  setDataPosition();
  reDraw(null, GRAPHICDATA, GRAPHICDATA2);
});
