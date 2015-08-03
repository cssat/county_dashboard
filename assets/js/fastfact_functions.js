/*
These are the workhorse functions for creating and updating the fast facts
(the panels that show single numerical summaries below the map).
 */
// inconsistent structure with map_functions but consistent with
// sparkline_functions - functions are collected in an object (fastfact)


d3.fastfact = function () {
    // key variables
    var fastfact_w = 133;
    var fastfact_h = 80;
    var padding = 10;
    var titles = titles_county; // from one of the data files - needs to be replaced when data structures corrected

    // helper functions
    function idz(d) {
        return d.id;
    }

    function statisticz(d) {
        return d.statistic;
    }

    fastfact.fastfact_w = function (_) {
        if (!arguments.length)
            return fastfact_w;
        fastfact_w = _;
        return fastfact;
    };

    fastfact.fastfact_h = function (_) {
        if (!arguments.length)
            return fastfact_h;
        fastfact_h = _;
        return fastfact;
    };

    fastfact.titles = function (_) {
        if (!arguments.length)
            return titles;
        titles = _;
        return fastfact;
    };

    // primary fast facts function
    function fastfact(g) {
        g.each(function (d, i) {

            var id = idz.call(this, d, i),
            peak = titles.population_fast_fact[id].max,
            nadir = titles.population_fast_fact[id].min,
            title = titles.population_fast_fact[id].title,
            valueFormat = d3.format(".2" + titles.population_fast_fact[id].valueFormat),
            statistic = statisticz.call(this, d, i);

            var g = d3.select(this);

            var yScale = d3.scale.linear()
                .domain([nadir, peak])
                .range([fastfact_h - padding, padding]);

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(0);

            var svg = g.append("svg")
                .attr("width", fastfact_w)
                .attr("height", fastfact_h)
                .attr("id", id)
                .append("g");

            svg.append("rect")
            .attr("width", fastfact_w)
            .attr("height", fastfact_h)
            .attr("class", "fastfact_rect")
            .style("fill", "white")
            .style("opacity", .005);

            var axis = svg.append("g")
                .attr("class", "fastfact_axis")
                .attr("transform", "translate(55,0)");

            axis.call(yAxis);

            axis.append("text")
            .attr("class", "text_axis")
            .text(valueFormat(peak))
            .attr("transform", "translate(-10,0)")
            .attr("y", 9)
            .attr("dy", ".71em")
            .style("text-anchor", "end");

            axis.append("text")
            .attr("class", "text_axis")
            .text(valueFormat(nadir))
            .attr("y", 11)
            .style("text-anchor", "end")
            .attr("transform", "translate(-10," + (fastfact_h - 2 * padding) + ")");

            svg.append("circle")
            .attr("class", "circle_fastfact_background")
            .attr("r", 7)
            .attr("cx", 55)
            .attr("cy", yScale(nadir))
            .style("fill", "white")
            .transition()
            .duration(500)
            .attr("cy", yScale(statistic));

            svg.append("circle")
            .attr("class", "circle_fastfact")
            .attr("r", 5)
            .attr("cx", 55)
            .attr("cy", yScale(nadir))
            .transition()
            .duration(500)
            .attr("cy", yScale(statistic));

            svg.append("text")
            .attr("class", "text_title")
            .text(title)
            .attr("y", 9)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .attr("transform", "translate(120," + (fastfact_h / 2 - 40) + ")");

            svg.append("text")
            .attr("class", "text_statis")
            .text(valueFormat(statistic))
            .attr("y", 3)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .attr("transform", "translate(120," + (fastfact_h / 2) + ")");

        });
    }

    return fastfact;
};
