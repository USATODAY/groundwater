var config = require('./');

module.exports = {
    src:  config.sourceDirectory + "/js/",
    dest: config.publicDirectory + "/js",
    shim: {
        "underscore": {
            "exports": "_"
        }
    },
    paths: {
        "d3": '../../bower_components/d3/d3',
        "topojson": '../../bower_components/topojson/topojson',
        "jquery": '../../bower_components/jquery/dist/jquery',
        "backbone": '../../bower_components/backbone/backbone',
        "underscore": '../../bower_components/underscore/underscore',
        "api/analytics": "lib/analytics"
    }
    
}