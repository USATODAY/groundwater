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
var progressPerSlide;       // progress of the scroll through specific slide
var progressWeight = 1;   // weighted factor to move animation progress faster (to finish animation before slide is out of view)
var targetValue;            // ending value for animation property
var pos;                    // position of scrollTop

var slidesLength;           // length of total slides in GRAPHICINFO.SLIDER_IMAGES
var sliderPosArray = [];    // array to store offset().top positions internally

var debugMode = false;      // set [true] to enable box to output stuff
var $debug;                 // jquery saved reference to debug element
var $embedModule;       //jquery reference to parent embed container
var currentStep = 0;    //start current step at 1

function prepareContainers() {
  // set app container to height of viewport
  $el.height(HEIGHT * GRAPHICINFO.SLIDER_IMAGES.length);
  $el.find('.gig-slider-panel').height(HEIGHT);
  $el.find('.gig-slider-background-container').height(HEIGHT);
  $embedModule.height(HEIGHT * slidesLength + 30);
  // $('.gig-slider-container').height(HEIGHT);

  // set framework wrapper container to height of viewport plus length of scroll
  if ( $(id).parents('.story-oembed') ) {
    $(id).parents('.story-oembed').height(HEIGHT * GRAPHICINFO.SLIDER_IMAGES.length);
  }
}

function setup() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  slidesLength = GRAPHICINFO.SLIDER_IMAGES.length;

  document.addEventListener('scroll', updatePosition);
  document.addEventListener('touchmove', updatePosition);

  $el = $(id);
  $embedModule = $('#' + GRAPHICINFO.GRAPHIC_SLUG).parents('.oembed-asset, .oembed');

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
  progress = (pos - offsetTop)/elHeight;
  // if (debugMode) $debug.html(pos);

  for (var i = 0; i < sliderPosArray.length + 1; i++) {
    if ( pos > sliderPosArray[i] && pos <= sliderPosArray[i+1] ) {
      progressPerSlide = (pos - sliderPosArray[i]) / HEIGHT;

      /**
       * PER SLIDE CODE GOES HERE
       * use [progressPerSlide] to get progress of current slide 0-1
       */

       if (debugMode) $debug.html(progressPerSlide);

       var newStep = getNewStep(progress);
       if (newStep !== currentStep) {
        setStep(newStep);
       }

       if ( (progressPerSlide * progressWeight) < 0 ) {
         targetValue = 0;
       }
       else if ( (progressPerSlide * progressWeight) < 1 ) {
         targetValue = (progressPerSlide * progressWeight);
       }
       else {
         targetValue = 1;
       }

       // $el.find('.gig-slider-background').eq(i+1).css({
       //   'opacity': targetValue
       // });
       // if ( $el.find('.gig-slider-background').eq(i+2) ) {
       //   $el.find('.gig-slider-background').eq(i+2).css({
       //     opacity: 0
       //   });
       // }

       /* END PER SLIDE CODE */
    }
  }


   if ( progress > 0 && pos < elHeight + offsetTop - (elHeight / GRAPHICINFO.SLIDER_IMAGES.length) ) {
     $el.find('.gig-slider-background-container').css({
       position: 'fixed'
     });
   } else if ( progress > 0 && pos < elHeight + offsetTop ) {
     $el.find('.gig-slider-background-container').css({
       position: 'absolute',
       top: 'auto'
     });
   } else {
     $el.find('.gig-slider-background-container').css({
       position: 'absolute',
       top: 0
     });
   }

  /**
   * ENTIRE ELEMENT PROGRESS ANIMATION GOES HERE
   * use [progress] to get progress of current slide 0-1
   */


   // if ( pos < offsetTop ) {
   //   $el.find('.gig-slider-background').css({
   //     opacity: 0
   //   });
   //   $el.find('.gig-slider-background').eq(0).css({
   //     opacity: 1
   //   });
   // }

   /* END SLIDE CODE */
}

//returns the correct step based on progress
function getNewStep(progress) {
  var padding = 0.1;
  progress = progress + padding;
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

function setStep(newStep) {
  //takes a new step value and sets it as the current step

  //first remove active class from current slide
  $el.find('.gig-slider-background').eq(currentStep).removeClass('gig-slider-active-background');

  //next set currentStep to new value
  currentStep = newStep;
  //add active class to new slide
  $el.find('.gig-slider-background').eq(currentStep).addClass('gig-slider-active-background');
}

function range(num) {
  return Array.apply(null, Array(num)).map(function (_, i) {return i;});
}

document.addEventListener('DOMContentLoaded', setup);
window.addEventListener('resize', function() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  prepareContainers();
  elHeight = $el.height();
  setDataPosition();
});
