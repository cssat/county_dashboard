/**
 *  SPARKLINES
 *
 *  Appends a series of sparklines to the page sidebar with indicators related
 *  to the child welfare system in the current context
 */

var Events = require('./Events.js');

var Sparklines = (function() {
   // Display options made available to all fucntions
   var margin_t = {
       top : 5,
       right : 5,
       bottom : 5,
       left : 35
   };
   var svg_w = 500;
   var svg_h = 90;
   var sparkline_w = 340;
   var sparkline_h = 90;
   var years;
   var dataLength;

   // Run on dashboard initialization
   function init(defaultContext, files, domain, colors) {
      // Set the years array for use by the appendSparklinesGrid
      // and appendSparklinesAxis functions
      years = getNumYears(domain);

      // Subscribe to context load event, which returns all
      // of the data for sparklines
      Events.subscribe('context loaded', function(result) {
         var data = getSparklineData(result.data);

         // The number of objects in the data array gives the multiplier for the
         // height of the SVG. Defined globally within the module because several
         // different functions initiated below need it.
         dataLength = Object.keys(data).length;

         // Start by removing the existing sparkline container. D3 works by appending
         // elements and does not seem to be great at simply updating state, so this
         // route is simpler if a bit clunk
         d3.select('#sparklines').remove();

         // Append the different components of the sparkline grid, from
         // general to specific. They need to be created in this order for
         // the elements to overlap properly.
         appendSparklines(data, domain);
         appendSparklineGrid();
         appendSparklineAxis(domain);
      });
   }

   function update() {

   }

   // Although the HTML markup provides a lot of structure, D3 binds data by
   // first appending elements. It would be nice to separate the steps into
   // different functions, but D3 seems to handle this poorly and the workarounds
   // can become difficult to follow.
   function appendSparklines(data, domain) {
       // Append the SVG
       var svg = d3.select("#t_trend")
                   .append("svg")
                   .attr("id", "sparklines");

       // Append one container for each row of data
       var sparkline = svg.attr("width", svg_w)
                          .attr("height", svg_h * dataLength + 50)
                          .selectAll("g")
                          .data(data)
                          .enter()
                          .append("g")
                          .attr("class", "sparkline")
                          .attr('id', function(d) { return d.code_name; })
                          .attr("transform", function (d, i) {
                              return "translate(" + margin_t.left + "," + ((margin_t.top + svg_h) * i) + ")";
                          });

       // Append the title text
       sparkline.append("text")
            .text(function(d) { return d.pretty_name})
            .attr("class", "sparkline_title")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "start");

      // Append a text element with the initial statistic
       sparkline.append("text")
            .text(function(d) {
              // Return current data with the specified format (f for fixed or p for percentage)
              // The ".2" indicates the level of precision for how numbers are displayed
              // See http://koaning.s3-website-us-west-2.amazonaws.com/html/d3format.html
              return d3.format(".2" + d.value_format)(d.global_min);
            })
            .attr("class", "sparkline_first")
            .attr("transform", "translate(-3,45)")
            .attr("y", 6)
            .attr("dy", ".25em")
            .style("text-anchor", "end");

      // Append a text display of the most current statistic
       sparkline.append("text")
            .text(function(d) {
              // Return current data with the specified format (f for fixed or p for percentage)
              // The ".2" indicates the level of precision for how numbers are displayed
              // See http://koaning.s3-website-us-west-2.amazonaws.com/html/d3format.html
              return d3.format(".2" + d.value_format)(d.current_max);
            })
            .attr("class", "sparkline_current")
            .attr("transform", "translate(" + (sparkline_w - 25) + "," + (sparkline_h / 2) + ")")
            .attr("y", 6)
            .attr("dy", ".25em")
            .style("text-anchor", "start");

       // Append two circles for the current statistic
       // THIS IS WRONG RIGHT NOW
       sparkline.append("circle")
          .attr("cx", sparkline_w - 40)
          .attr("cy", function(d){ return (sparkline_h * d.current_max); })
          .attr("r", 7)
          .attr("class", "trend_end_point")
          .style("fill", "white")
          .attr("transform", "translate(0, 5)");

       sparkline.append("circle")
          .attr("cx", sparkline_w - 40)
          .attr("cy", function(d){ return (sparkline_h * d.current_max); })
          .attr("r", 5)
          .attr("class", "trend_end_point")
          .attr("transform", "translate(0, 5)");

   }

   // Appends a year for every other year from the min and max years passed in from
   // dashboard.js
   function appendSparklineAxis(domain) {
        var xScale = d3.scale.linear()
                       .domain(domain)
                       .range([margin_t.left, sparkline_w - margin_t.right]);

        // First set up the method for creating an axis using d3.svg.axis()
        // and the years array build on initialization
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickFormat(function (d) {
                var strYear = d.toString();
                var formattedYear = "'" + strYear.slice(2);
                return formattedYear;
            })
            .ticks(years.length /2);

        d3.select("#sparklines")
            .append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (svg_h * dataLength + 20) + ")")
            .call(xAxis);
   }

   // Appends one line for each year running the height of the container. This is a little tricky
   // because it is not actually an axis, so the math is different from appendSparklineAxis
   function appendSparklineGrid() {
      // We need a gridline for each year inclusive of the min and
      // max. Build an array of even increments that express how far
      // a line should be from the lft boundary of the container
      var spacedLines = getYearSpacing();

      // Append an element to contain the gridlines
      var grid = d3.select('#sparklines')
                   .append('g')
                   .attr('id', 'grid');

      grid.selectAll('line')
          .data(spacedLines)
          .enter()
          .append('line')
          .attr("x1", function(d) { return d; })
          .attr('y1', 0)
          .attr('x2', function(d) { return d; })
          .attr('y2', svg_h * dataLength + 20)
          .style("stroke", "#aaa")
          .style("stroke-width", .5)
          .style("stroke-opacity", .5)
          .attr("transform", "translate(" + (margin_t.left) + ",0)");

   }

   function bindEvents() {

   }

   // Returns the years between the domain set in dashboard.js
   // This enables us to create the right number of gridlines and
   // axis labels without hand coding the values as was done before.
   //
   // NOTE: The date array is technically two integers. For the purposes
   // of this app and the data that goes into it, integers are fine, but
   // this would need to be rewritten if you want to do more sophisticated
   // date manipulation.
   function getNumYears(domain) {
      // Get the difference between the years so we know how many times
      // to loop. The domain always consists of two integers [min, max],
      // so we can rely on the index numbers
      var diff = domain[1] - domain[0];
      var yearStart = domain[0];
      var years = [];

      for (var i = 0; i <= diff; i++) {
        years.push(yearStart);
        yearStart++;
      }
      return years;
   }

    // Builds an array of even increments that express how far
    // an axis element should be from the left boundary of the 
    // container
   function getYearSpacing() {
      var spacedLines = [];
      var yearObj = {};
      var numYears = years.length;
      for (var i = 0; i < numYears; i++) {
        spacedLines[i] = (320 / numYears) * i;
        yearObj[i] = (320 / numYears) * i;
      }

      return spacedLines;
   }

   function getSparklineData(data) {
        var sparklineData = data.filter(function(row) {
            return row['group'] === 'foster_care_trend';
        });

        return sparklineData;
   }

   return {
      init: init
   }
})();

module.exports = Sparklines;