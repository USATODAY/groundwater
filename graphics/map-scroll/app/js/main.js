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
var tooltip;
var path;
var svg;
var map;
var scale;
var currentStep = 0;
var projection;
var width = 960;
var height = 600;
var GRAPHICDATA;


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

  start();

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
  progressBottom = (pos + window.innerHeight)/(elHeight + offsetTop);
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

  if (progress > .4) {
    nextStep();
  } else {
    previousStep();
  }
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
var colorScale = d3.scale.quantile()
  .domain(scaleBreaks)
  .range(['#A56600','#F5AE1B', '#F6EB16']);

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
    $embedModule = $('#' + GRAPHICINFO.GRAPHIC_SLUG).parents('.oembed-asset, .oembed');
    d3.json(DATA_URL, ready);
}


function addLegend() {
    var html = "<div class='map-legend'>decrease in water level<div>";
    scaleBreaks.forEach(function(breakpoint, i) {
        html += "<span style='display: inline-block;width:20px; height:20px;background-color:" + colorScale(breakpoint) +"'></span><span>>" + Math.abs(breakpoint) + " ft.</span>";
    });
    
        html += "<span style='display: inline-block;width:20px; height:20px;background-color:#0095C4'></span><span>no decrease</span>";
   
    html += "</div>"
    $graphic.append(html);
}

var reDraw = _.throttle(ready, 500, {
  leading: false,
  trailing: true
});

function ready(data) {
    width = $(window).width();
    height = width * (9/16);
    scale = width/1.2;
    $graphic.empty();

    if (GRAPHICINFO.FULL_WIDTH) {
      $embedModule.height(HEIGHT * slidesLength);
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
    .translate([WIDTH/2, HEIGHT / 2]);

    path = d3.geo.path()
      .projection(projection);


    svg = d3.select($graphic[0]).append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
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

     tooltip = d3.select($graphic[0]).append("div")
        .attr("class", "gig-tooltip")
        .style("display", "none");

      addLegend();
}

function nextStep() {
  if (currentStep === 0) {
    addOgallalaHighlight();
    currentStep++;
  } 
}

function previousStep() {
  if (currentStep == 1) {
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
      .attr("transform", "translate(" + ((width/2) - (coordinates[0] * zoomLevel)) + ", " + ((HEIGHT/2) - coordinates[1] * zoomLevel) + ")scale(" + zoomLevel + ")");
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
  var top = (d3.event.pageY - 12) - $window.scrollTop();
  if (!$graphic.hasClass("fixed")) {
    top = top - $graphic.offset().top;
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
  reDraw(GRAPHICDATA);
});
