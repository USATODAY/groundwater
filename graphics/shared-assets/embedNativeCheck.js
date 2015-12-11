////////////////////////
///embedNativeCheck///
///////////////////////

/******
Module for checking if page is a native view, 
and then destroying all custom oembeds on the pages.
******/


function removeEmbeds() {
    //find all embeds and nav modules
    var customEmbeds = document.getElementsByClassName('gig-slider');
    var navModules = document.getElementsByClassName('gwl-nav-module');
    //loop through embeds
    for(var i = 0; i < customEmbeds.length; i++) {
        var el = customEmbeds[i];
        //remove them
        el.parentNode.removeChild(el);
    }
    //loop through nav embeds
    for(var i = 0; i < navModules.length; i++) {
        var el = navModules[i];
        //remove them
        el.parentNode.removeChild(el);
    }
}

function isNative() {
    //checks to see if page is a native view
    return typeof GD !== 'undefined';
}

function check() {
    //removes embeds if native
    if (isNative()) {
        removeEmbeds();
    }
}

document.addEventListener('DOMContentLoaded', check);