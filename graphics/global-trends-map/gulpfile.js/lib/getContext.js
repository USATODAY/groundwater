var dataConfig = require('../config/data');
var fs = require('fs');
var _ = require('lodash');


module.exports = function() {
    var file = dataConfig.src + "GRAPHICINFO.json";
    var data = {};
    data["GRAPHICINFO"] = JSON.parse(fs.readFileSync(file));

    // _.each(dataFiles, function(dataFile) {
    //     if (dataFile.indexOf(".json") > 0) {
    //         var filename = dataFile.split(".")[0]
    //         data[filename] = JSON.parse(fs.readFileSync(dataConfig.src + "/" + dataFile));
    //     }
    // });
    return data;
};
