/**
 *  CONTEXT SWITCHER
 *
 *  Constructs a list of buttons that allow the user to switch between
 *  the state, region and county contexts
 */

var Events = require('./Events.js');


var ContextSwitcher = (function() {

	function init(contexts, colors) {
		appendButtons(contexts, colors);
		bindEvents(colors);
	}

	function appendButtons(contexts, colors) {
		var buttons = d3.select("#context-buttons");

		// buttons (will appear left-to-right in reverse order from laid out here)
		buttons.selectAll('.s_r_c')
			.data(contexts)
			.enter()
			.append("div")
			.attr("class", "s_r_c")
			.attr("id", function(d){ return d; })
			.text(function(d){ return d; });

		// Set default state
		d3.select("#context-buttons")
		.selectAll("div")
		.attr("checked", "unchecked")
		.style("border-color", d3.hsl(colors['main']).brighter(1.2));
	}

	function bindEvents(colors) {
		// button hover behavior
		d3.select("#context-buttons")
		.selectAll("div")
		.on("mouseover", function () {
		    d3.select(this).style("border-color", d3.hsl(colors['highlight']).brighter(0.5));
		})
		.on("mouseout", function () {
		    if (d3.select(this).attr("checked") == "unchecked") {
		        d3.select(this).style("border-color", d3.hsl(colors['main']).brighter(1.2));
		    } else {
		        d3.select(this).style("border-color", colors['highlight']);

		    }
		})
		.on('click', function() {
			var newContext;
			// Uncheck and unhighlight whatever was previously selected
			d3.selectAll('div.s_r_c')
		    .attr('checked', 'unchecked')
		    .style("border-color", d3.hsl(colors['main']).brighter(1.2));

		   // Now check and highlight the current selection
		   d3.select(this)
		    .attr('checked', 'checked')
			 .style("border-color", colors['highlight']);

			// Get the ID of the current selection and publish it as a context
			// switch event
			var id = d3.select(this).attr('id');			
			Events.publish('Switch contexts', {
				context: id
			});
		});
	}

	return {
		init: init
	}
})();

module.exports = ContextSwitcher;