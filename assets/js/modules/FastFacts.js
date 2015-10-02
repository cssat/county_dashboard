/**
 *  FAST FACTS
 *
 *  Appends fast facts to the bottom of the page with population-based
 *  demographic indicators.
 */

var Events = require('./Events.js');

var FastFacts = (function() {

	function init(defaultContext, files) {
		// Subscribe to the data load for each file we need to load
		for(var i = 0; i < files.length; i++) {
			var fileName = defaultContext + files[i];
			
			Events.subscribe(defaultContext + files[i], function(obj) {
				console.log('It happened: ' + defaultContext + files[i]);
			});
		}
	}

	function update() {

	}

	function switchContext() {

	}

	function extractData() {

	}

	function appendFactsContainer() {

	}

	function appendFact(context) {

	}

	function bindEvents() {

	}

	return {
		init: init
	}
})();

module.exports = FastFacts;