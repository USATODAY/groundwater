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
var DATA_URL_2 = getDataURL(GRAPHICINFO.DATA_URL_2);
var topojson_features_obj = "south_america.geo";
var topojson_features_obj_2 = "PER_adm3";
var _ = require("lodash");
var queue = require("queue-async");
var tooltip;
var path;
var svg;
var map;
var scale;
var currentStep = 0;
var projection;
var width = 960;
var height = 600;
var transisitonDuration;
var GRAPHICDATA; //cache 1st data source
var GRAPHICDATA2; //cache 2nd data source
var centerCoordinates; //store coordinates for center of focus


function prepareContainers() {
  // set app container to height of viewport
  // $el.height(HEIGHT * GRAPHICINFO.SLIDER_IMAGES.length);
  // $el.find('.gig-slider-panel').height(HEIGHT);
  $el.find('.gig-slider-panel-text-container').css({"margin-bottom": HEIGHT - 75});
  $el.find('.gig-slider-background').height(HEIGHT);
  $embedModule = $('#' + GRAPHICINFO.GRAPHIC_SLUG).parents('.oembed-asset, .oembed');
  $embedModule.height(HEIGHT * slidesLength + 30);
  $el.height(HEIGHT * slidesLength);
  // $('.gig-slider-container').height(HEIGHT);

  // set framework wrapper container to height of viewport plus length of scroll
  // if ( $(id).parents('.story-oembed') ) {
  //   $(id).parents('.story-oembed').height(HEIGHT * GRAPHICINFO.SLIDER_IMAGES.length);
  // }
}

function setup() {
  WIDTH = window.innerWidth;
  // HEIGHT = window.innerHeight + 162; // 162 extra pixels to account for browser ui
  // if (window.mobileCheck()) {
  HEIGHT = window.innerHeight;
  // }
  $sliderBG = $('#gig-slider-background-1');
  transisitonDuration = window.mobileCheck() ? 0 : 500;

  slidesLength = GRAPHICINFO.SLIDER_IMAGES.length;

  document.addEventListener('scroll', updatePosition);
  document.addEventListener('touchmove', updatePosition);

  $el = $(id);
  // getNewStep();
  
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
  // console.log(newStep);
  if (newStep != currentStep) {
    setSlide(newStep);
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
var scaleColors = ['#de862e','#F5AE1B', '#F6EB16'];

var rScale = d3.scale.linear()
  .range([1, 8]);

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
    queue()
      .defer(d3.json, DATA_URL)
      .defer(d3.csv, DATA_URL_2)
      .await(draw);
}


function addLegend() {
    var html = "<div class='map-legend'>groundwater extracted (cubic hectometers)<div>";
    
        html += "<span class='gig-circle-legend'style='display: inline-block;width:8px; height:8px;background-color:" + "#0095C4" +"'></span><span>>" + d3.max(GRAPHICDATA, function(d) {return d[VAL_COLUMN];}) + " ft.</span>";
   
    
        html += "<span class='gig-circle-legend'style='display: inline-block;width:64px; height:64px;background-color:" + "#0095C4" +"'></span><span>>" + d3.max(GRAPHICDATA, function(d) {return d[VAL_COLUMN];}) + " ft.</span>";
   
    html += "</div>"
    $graphic.append(html);
}

var reDraw = _.throttle(draw, 500, {
  leading: true,
  trailing: true
});

function draw(err, data, data2) {
    width = $(window).width();
    height = width * (9/16);
    scale = HEIGHT / 2;
    if (width < 800) {
      scale = width;
    }
    $graphic.empty();
    data2 = data2.map(function(d) {
      return {
        region: d.region,
        volume_withdrawn: +d.volume_withdrawn,
        coordinates: d.coordinates,
        lat_long: d.coordinates.split(', ').reverse()
      }
    });
    rScale.domain([1, d3.max(data2.map(function(d) {return d.volume_withdrawn}))]);
    console.log(rScale.domain());

    if(!GRAPHICDATA) {
      GRAPHICDATA = data;
    }
    if(!GRAPHICDATA2) {
      GRAPHICDATA2 = data2;
    }
    var geo = topojson.feature(data, data.objects[topojson_features_obj]);
    var geo2 = topojson.feature(data, data.objects[topojson_features_obj_2]);

    var center = d3.geo.centroid(geo);
    centerCoordinates = d3.geo.centroid(geo2);

    projection = d3.geo.mercator()
    .scale(scale)
    .center(center)
    .translate([WIDTH/2, HEIGHT / 2.5]);

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

    map.selectAll('path')
      .data(geo.features)
      .enter()
      .append('path')
      .attr("class", "country-shape")
      .attr("d", path);

    map.append("g")
      .attr("class", "country-detail")
      .append("path")
      .datum(topojson.merge(data, data.objects[topojson_features_obj_2].geometries))
      // .enter().append("path")
      .attr("fill", function(d) { 
          return "rgba(255, 255, 255, 0.75)";
          // if (d.properties[VAL_COLUMN]) {
          //   return getColor(parseFloat(d.properties[VAL_COLUMN]));
          // } else {
          //   return "none";
          // }
      })
      .attr("d", path);
      // .on("mouseover", mouseover)
      // .on("mousemove", mousemove)
      // .on("mouseout", mouseout);

      map.append('g')
        .attr('class', 'gig-country-label')
        .attr('transform', 'translate(' + projection(centerCoordinates) + ')')
        .attr('fill', 'white')
        .append('text')
        .attr('transform', 'translate(15, 0)')
        .text('Peru');

      map.append('g')
        .attr('class', 'gig-data-point-wrapper')
        .selectAll('circle')
        .data(GRAPHICDATA2)
        .enter()
        .append('circle')
        .attr('r', 0)
        .attr('fill', '#0095C4')
        .attr('opacity', 0.5)
        .attr('cx', function(d) {
          return projection(d.lat_long)[0];
        })
        .attr('cy', function(d) {
          return projection(d.lat_long)[1];
        });

      

     tooltip = d3.select($graphic[0]).append("div")
        .attr("class", "gig-tooltip")
        .style("display", "none");

      // addLegend();
      addProgressIndicator();
}

function addProgressIndicator() {
  var html = '<div class="gig-progress-indicator-wrap">'
  _.each(GRAPHICINFO.SLIDER_IMAGES, function(image, i) {
    html += '<div class="gig-progress-entry"></div>';
  });
  
  html += '</div>'
  $graphic.append(html);
}

//returns the correct step based on progress
function getNewStep(progress) {
  var padding = 0.05;
  progress = progress - padding;
  var breaks = [] //store each progress break point in this array
  range(slidesLength).forEach(function(slideIndex) {
    var stepBreak = (1/slidesLength) * slideIndex;
    breaks.push(stepBreak);
  });
    //default new step is 0
  var result = 0;

  //loop through each break point
  breaks.forEach(function(breakpoint, i) {
    //if progress is past a break point, update result
    if (progress > breakpoint) {
      result = i;
    }
  });
  return result;
}

function range(num) {
  return Array.apply(null, Array(num)).map(function (_, i) {return i;});
}

function setSlide(newSlide) {
  currentStep = newSlide;
  stepMap[newSlide]();
  var progressEntries = $el.find('.gig-progress-entry');
  progressEntries.removeClass('gig-progress-current');
  progressEntries.eq(newSlide - 1).addClass('gig-progress-current');
}

//maps each step to a function
var stepMap = {
  0: stepOne,
  1: stepTwo
}

function stepOne() {
  zoomOut();
   var container = d3.select('.gig-data-point-wrapper');
  container.selectAll('circle')
    .transition()
    .duration(200)
    .attr('r', 0);
}

function stepTwo() {
  zoomIn(centerCoordinates, 4);
 

  var container = d3.select('.gig-data-point-wrapper');
  container.selectAll('circle')
    .transition()
    .duration(200)
    .delay(function(d, i) {
      return 50 * i;
    })
    .attr('r', function(d) {
      return rScale(d.volume_withdrawn);
    });
}

function stepThree() {
  zoomIn(centerCoordinates, 4);
  var container = d3.select('.gig-data-point-wrapper');
  container.selectAll('circle')
    .transition()
    .duration(200)
    .delay(function(d, i) {
      return 50 * i;
    })
    .attr('r', function(d) {
      return rScale(d.volume_withdrawn);
    });


}

function zoomIn(center, zoomLevel) {
  var coordinates = projection(center);
  map.transition()
      .duration(transisitonDuration)
      .attr("transform", "translate(" + ((width/2) - (coordinates[0] * zoomLevel)) + ", " + ((HEIGHT/2) - coordinates[1] * zoomLevel) + ")scale(" + zoomLevel + ")");
}

function zoomOut() {
  map.transition()
      .duration(transisitonDuration)
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
  HEIGHT = window.innerHeight;
  prepareContainers();
  elHeight = $el.height();
  offsetTop = $el.offset().top;
  setDataPosition();
  reDraw(null, GRAPHICDATA, GRAPHICDATA2);
  setSlide(getNewStep(progress));
});
