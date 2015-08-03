/*
These are the workhorse functions for creating and updating the sparklines
(the over-time trend lines that currently display right of the map).
 */
// inconsistent structure with map_functions but consistent with fastfact
// functions - functions are collected in an object (sparkline)

d3.sparkline = function () {
    // key sparkline variables
    var sparkline_w = 411;
    var sparkline_h = 25;
    var titles = titles_county; // this is currently set in one of the js data files - will need to replace this when correct the data format
    // if sparkline_domain fails to align with the data it is likely to cause
    // issues with tick marks aligning with gridlines
    var sparkline_domain = ["2000-01-01", "2012-01-01"];
    // unsure why sparkline_domain is double-defined like this but note that
    // order of these declarations is rigid
    var sparkline_domain = sparkline_domain.map(function (d) {
            return parseDate(d);
        });

    // helper functions
    function idz(d) {
        return d.id;
    }

    function statisticz(d) {
        // return d.statistic;
        return d.statistic.map(function (_) {
            return {
                time : parseDate(_.time),
                value : _.value
            };
        });
    }

    function valuez(d) {
        return d.statistic.map(function (_) {
            return _.value;
        });
    }

    function timez(d) {
        return d.statistic.map(function (_) {
            return parseDate(_.time);
        });
    }

    // the primary sparkline function
    function sparkline(g) {

        g.each(function (d, i) {
            var statistic = statisticz.call(this, d, i);
            var id = idz.call(this, d, i);
            var title = titles_county["foster_care_trend"][id].title;
            var valueFormat = d3.format(".2" + titles_county["foster_care_trend"][id].valueFormat);
            var min = titles["foster_care_trend"][id].min;
            var max = titles["foster_care_trend"][id].max;
            var values = valuez.call(this, d, i);
            var times = timez.call(this, d, i);
            var current = values[values.length - 1];

            g = d3.select(this);

            var x = d3.time.scale()
                .range([0, sparkline_w / 20 * 13])
                .domain(sparkline_domain);
            var y = d3.scale.linear()
                .range([sparkline_h, 0])
                .domain([min, max]);

            var trend = g.append("g")
                .attr("class", "trend")
                .attr("id", id)
                .attr("title", title)
                .attr("width", sparkline_w)
                .attr("height", sparkline_h);

            trend.append("rect")
            .attr("width", sparkline_w)
            .attr("height", sparkline_h)
            .attr("class", "trend_rect")
            .style("fill", "white")
            .style("opacity", 0.001);

            // in case there is no data
            if (!isNaN(current)) {

                trend.append("text")
                .text(valueFormat(current))
                .attr("class", "sparkline_current")
                .attr("transform", "translate(" + (sparkline_w / 20 * 14) + "," + (sparkline_h / 2) + ")")
                .style("display", "none")
                .attr("y", 6)
                .attr("dy", ".25em")
                .style("text-anchor", "start");

                trend.append("text")
                .text(valueFormat(values[0]))
                .attr("class", "sparkline_first")
                .attr("transform", "translate(" + (x(times[0]) - 3) + "," + y(values[0]) + ")")
                .style("display", "none")
                .attr("y", 6)
                .attr("dy", ".25em")
                .style("text-anchor", "end");

                var line = d3.svg.line()
                    .x(function (d) {
                        return x(d.time);
                    })
                    .y(function (d) {
                        return y(d.value);
                    });

                var path = trend.append("path")
                    .attr("class", "trend_line")
                    .attr("d", line(statistic))
                    .attr("transform", "translate(0, 5)");

                var circle = trend.append("circle")
                    .attr("cx", x(times[times.length - 1]))
                    .attr("cy", y(current))
                    .attr("r", 7)
                    .attr("class", "trend_end_point")
                    .style("fill", "white")
                    .attr("transform", "translate(0, 5)")
                    .style("display", "none");

                var circle = trend.append("circle")
                    .attr("cx", x(times[times.length - 1]))
                    .attr("cy", y(current))
                    .attr("r", 5)
                    .attr("class", "trend_end_point")
                    .attr("transform", "translate(0, 5)")
                    .style("display", "none");

                trend.append("rect")
                .attr("class", "cover")
                .attr("width", sparkline_w / 20 * 14)
                .attr("height", sparkline_h + 5)
                .attr("x", 0)
                .style("fill", "white")
                .style("stroke", "white")
                .attr("transform", "translate(0, " + (5 - 2) + ")");

                d3.selectAll(".sparkline_first")
                .transition()
                .style("display", "block");

                d3.selectAll(".cover")
                .transition()
                .duration(1000)
                .attr("x", sparkline_w / 20 * 14 + 1)
                .attr("width", .01);
                d3.selectAll(".cover")
                .transition()
                .delay(1000)
                .style("display", "none");

                d3.selectAll(".trend_end_point")
                .transition()
                .delay(1000)
                .style("display", "block");

                d3.selectAll(".sparkline_current")
                .transition()
                .delay(1000)
                .style("display", "block");

            }

            trend.append("text")
            .text(title)
            .attr("class", "sparkline_title")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "start");
        });

        // the following appears to append to the sparkline container - given
        // that I'm unsure about how the full flow of container construction,
        // I'm leaving these where/as they are to avoid breaking anything
        //x-axis to key foster care trend
        /***************temporary************************/
        var xScale = d3.time.scale()
            .range([0, sparkline_w / 20 * 13])
            .domain(sparkline_domain);

        var yearFormat = d3.time.format("%y");
        var format = function (d) {
            return "'" + yearFormat(d);
        };

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickFormat(function (d) {
                return format(d);
            })
            .ticks(6);

        // note: not define height_t, margin_t variables
        d3.select("#svg_trend")
        .append("g")
        .attr("class", "sparkline_axis")
        .attr("transform", "translate(" + margin_t.left + "," + ((height_t + margin_t.top + margin_t.bottom) * 5 + 20) + ")")
        .call(xAxis);

        var lines = new Array();

        for (var j = 0; j < (yearFormat(sparkline_domain[1]) - yearFormat(sparkline_domain[0]) - 1); j++) {
            lines[j] = (sparkline_w / 20 * 13) / 12 * j;
        }

        //y-axis lines
        d3.select("#svg_trend")
        .append("g")
        .attr("class", "sparkline_lines")
        .selectAll("line")
        .data(lines).enter()
        .append("line")
        .attr("id", function (d, i) {
            return "y_lines_" + i;
        })
        .attr("x1", function (d) {
            return d;
        })
        .attr("y1", 0)
        .attr("x2", function (d) {
            return d;
        })
        .attr("y2", (height_t + margin_t.top + margin_t.bottom) * 5 + 20)
        .style("stroke", "#aaa")
        .style("stroke-width", .5)
        .style("stroke-opacity", .5)
        .attr("transform", "translate(" + (margin_t.left) + ",0)");
        /**************************************************/
    }

    sparkline.sparkline_w = function (_) {
        if (!arguments.length)
            return sparkline_w;
        sparkline_w = _;
        return sparkline;
    };

    sparkline.sparkline_h = function (_) {
        if (!arguments.length)
            return sparkline_h;
        sparkline_h = _;
        return sparkline;
    }

    sparkline.sparkline_domain = function (_) {
        if (!arguments.length)
            return sparkline_domain;
        sparkline_domain = _.map(function (d) {
                return parseDate(d);
            });
        return sparkline;
    };

    sparkline.titles = function (_) {
        if (!arguments.length)
            return titles;
        titles = _;
        return sparkline;
    };

    return sparkline;
};
