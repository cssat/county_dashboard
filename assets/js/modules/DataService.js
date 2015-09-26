/**
 *  DATA SERVICE
 *
 *  Ingests data and distributes it to the
 *  Events modules, which makes the data
 *  available to other modules. Responds to 
 *  context changes by sending out new data for
 *  the current context.
 */

var Events = require('./Events.js');

var DataService = (function() {

    // Private variables accessible throughout the module
    // that get set on init
    var path;
    var files;

    function init(context, dataPath, filesList) {
        // Set module globals
        path = dataPath;
        files = filesList;

        // Load the data with the defaults
        loadData(context);

        // Listen for data context changes
        Events.subscribe('Switch contexts', function(obj) {
            var newContext = obj.context;
            loadData(newContext)
        });
    }

    // Loop over files that need to be loaded and load them using
    // d3.csv, then publish the data when ready
    function loadData(context) {
        var dataset;
        var filename;
        var toLoad;

        for (var i = 0; i < files.length; i++) {
            fileName = context + files[i];
            toLoad = window.location.href + path + fileName + '.csv';

            d3.csv(toLoad, function(data) {
                dataset = data;

                Events.publish(fileName, {
                    context: context,
                    data: dataset
                });
            });
        }    
    }

    return {
        init: init
    };

})();

module.exports = DataService;