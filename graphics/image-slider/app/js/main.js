/**
 * Setup Slider Interactive
 */

var GRAPHICINFO = require("../data/GRAPHICINFO.json");
var id = '#gig-slider';
var duration = 400;
var WIDTH;
var HEIGHT;

// init controller
var controller = new ScrollMagic.Controller();

function setup() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  // set container height to full screen
  $(id).height(HEIGHT);

  // set framework wrapper container to height of viewport
  if ( $(id).parents('.story-oembed') ) {
    $(id).parents('.story-oembed').height(HEIGHT + duration);
    console.log('setting story-oembed height.');
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
