/**
 *  SPARKLINES
 *
 *  Appends a series of sparklines to the page sidebar with indicators related
 *  to the child welfare system in the current context
 */

var Events = require('./Events.js');

var Sparklines = (function() {

	function init(defaultContext, files) {
		// Subscribe to the data load for each file we need to load
		for(var i = 0; i < files.length; i++) {
			var fileName = defaultContext + files[i];
			
			Events.subscribe(fileName, function(obj) {
				console.log(obj);
			});
		}
	}

	function update() {

	}
	
	function switchContext() {

	}

	function appendSparklinesContainer() {

	}

	function appendSparkline(context) {

	}

	function bindEvents() {

	}

	return {
		init: init
	}
})();

module.exports = Sparklines;