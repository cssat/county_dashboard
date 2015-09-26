/**
 *  COUNTY DASHBOARD
 *
 *  This app creates a dashboard that allows the user to toggle between
 *  Washington state, region and county maps and get population/trend data
 *  for each view. It was originally created in 2013.
 */

// Require all modules so that they can be initialized
var Events = require('./modules/Events.js');
var DataService = require('./modules/Dataservice.js');

// UI Modules
var ContextSwitcher = require('./modules/ContextSwitcher.js');
var FastFacts = require('./modules/FastFacts.js');
var Map = require('./modules/Map.js');
var Sparklines = require('./modules/Sparklines.js');

// Initialize the dashboard
var Dashboard = (function() {
	// Configuration options used throughout the app. These are
	// the only options that should need occasional attention or
	// updating. Eventually the date range should be determined
	// automatically.
	var defaultContext = 'state';
	var path = '/data/new-data/';
	var files = ['_context', '_data']; // files to be loaded per context
	var dateRange = [ "2000-01-01", "2015-01-01"];
	var contexts = ['state', 'county', 'region'];
	var colors = {
		main: "#3B6E8F",
		highlight: "#A3DCE6",
		accent: "green"
	};

	// Initialize the application
	function init() {
		DataService.init(defaultContext, path, files);
		ContextSwitcher.init(contexts, colors);
		FastFacts.init(defaultContext, files);
		Map.init(defaultContext, colors);
		Sparklines.init(defaultContext, files);
	}

	return {
		run: init
	}
})();

Dashboard.run();