/**
 *  DATA SERVICE
 *
 *  Ingests data and distributes it to the Events modules, which makes the data
 *  available to other modules. Responds to context changes by sending out new data for
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
        setupDataLoad(context);

        // Listen for data context changes from the ContextSwitcher module
        Events.subscribe('Switch contexts', function(obj) {
            var newContext = obj.context;
            setupDataLoad(newContext)
        });
    }

    // Loop over files that need to be loaded and load them using
    // d3.csv, then publish the data when ready
    function setupDataLoad(context) {
        var dataset;
        var filename;
        var toLoad;
        var msg;

        // Set up load options
        for (var i = 0; i < files.length; i++) {
            filename = context + files[i];
            toLoad = window.location.href + path + filename + '.csv';
            msg = filename.split('_')[1] + ' loaded';

            // Initiate D3 CSV load
            loadData(msg, context, toLoad);
        }    
    }

    // Uses d3.csv method to asynchronously load the data and publishes
    // when ready
    function loadData(msg, context, toLoad) {
        var dataset;

        d3.csv(toLoad, function(data) {
            dataset = data;

            Events.publish(msg, {
                context: context,
                data: dataset
            });
        });
    }

    return {
        init: init
    };

})();

module.exports = DataService;