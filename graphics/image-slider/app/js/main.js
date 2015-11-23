/**
 * Setup Slider Interactive
 */

var GRAPHICINFO = require("../data/GRAPHICINFO.json");
var id = '#slider-1';
var duration = 400;
var WIDTH;
var HEIGHT;

// init controller
var controller = new ScrollMagic.Controller();

function setup() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  // $(id).height(HEIGHT);
  $('#gig-slider').height(HEIGHT);

  // set framework container to height of viewport
  if ( $(id).parents('.story-asset') ) {
    $(id).parents('.story-asset').height(HEIGHT + duration);
  }

  // create a scene
  new ScrollMagic.Scene({
    triggerElement: id,
    duration: duration,
    triggerHook: 0,
    // reverse: true
  })
  .setPin(id) // pins the element for the the scene's duration
  .addTo(controller); // assign the scene to the controller
}

document.addEventListener('DOMContentLoaded', setup);
