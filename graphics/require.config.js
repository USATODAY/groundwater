/*
 *Store require paths for shared libraries that will run on pages in this file. This must be loaded onto each page that runs these graphics.
 */
require.config({
    paths: {
        'd3': 'http://www.gannett-cdn.com/experiments/usatoday/_common/_scripts/d3.min.js',
        'topojson': 'http://www.gannett-cdn.com/experiments/usatoday/_common/_scripts/topojson.v1.min.js'
    }
})