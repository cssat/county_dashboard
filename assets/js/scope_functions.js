/*
These are the core functions that adjust which map and data the application
is using when the user adjusts the "scope" (switches between state, region,
and county views or switches between aggregrate views versus views that
are specific to the context of a particular sparkine or fast fact).
 */

// switching the the data based on the current map and focus
function get_current_pointer(id, scope) {
    if (scope == "county")
        var data = data_county;
    else
        var data = data_region;

    for (var i = 0; i < data.length; i++) {
        if (data[i]["id"] == id) {
            current_pointer = i;
        }
    }
}

// switching to the state map
function map_state() {
    //change scope variable
    scope = "state";

    // stop map tooltips
    if (scope == "state") {
        d3.select(".tooltip").style("display", "none");
    }

    // make all map settings/behavior appropriate for the scope
    d3.select("#wa_geo_map")
    .selectAll("path")
    .style("display", "block");

    d3.select("#wa_geo_map_region")
    .selectAll("path")
    .style("display", "none");
    d3.selectAll(".d3-tip-county")
    .style("display", "none");
    d3.select("#sub_description_title").text("Washington");

    d3.select("#wa_geo_map")
    .selectAll("path")
    .style("fill", "")
    .style("stroke", d3.hsl(color_main).brighter(1.2));
    d3.select("#wa_geo_map_region").selectAll("path").style("display", "none");
    d3.select("#wa_geo_map")
    .selectAll("g")
    .on("mouseover", function () {
        d3.select("#wa_geo_map").selectAll("path").style("fill", d3.hsl(color_highlight).brighter(0.5)).style("stroke", d3.hsl(color_highlight).brighter(0.5));
    })
    .on("mouseout", function () {
        d3.select("#wa_geo_map").selectAll("path").style("fill", d3.hsl(color_main).brighter(1.2)).style("stroke", d3.hsl(color_main).brighter(1.2));
    })
    .on("click", function () {});

}

// switching to the county map
function map_county() {
    //change scope variable
    scope = "county";

    // start map tooltips
    if (scope == "county") {
        d3.select(".tooltip").style("display", "block");
    }

    // make all map settings/behavior appropriate for the scope
    d3.select("#wa_geo_map")
    .selectAll("path")
    .style("display", "block")
    .style("stroke", "white");

    d3.select("#wa_geo_map_region")
    .selectAll("path")
    .style("display", "none");

    d3.selectAll(".d3-tip-county").style("display", "block");

    d3.select("#wa_geo_map")
    .selectAll("path")
    .style("fill", "");
    d3.select("#" + default_county)
    .selectAll("path")
    .style("fill", color_highlight);
    d3.select("#sub_description_title").text(default_county);

    d3.select("#wa_geo_map")
    .selectAll("g")
    .on("mouseover", function () {})
    .on("mouseout", function () {})
    .on("click", function () {
        d3.select("#wa_geo_map")
        .selectAll("path")
        .style("fill", "");
        d3.select(this)
        .selectAll("path")
        .style("fill", color_highlight);
        d3.select("#sub_description").style("display", "none");
        var county_id = d3.select(this).attr("id");
        current_status = d3.select(this).attr("id");

        // small counties behavior
        var isSmallCounty = small_counties.some(function (d) {
                return county_id == d;
            });
        if (isSmallCounty) {
            small_counties.forEach(function (d) {
                d3.select("#" + d)
                .selectAll("path")
                .style("fill", color_highlight);
            });
            d3.select("#sub_description_title").text("Small Counties");

        } else {
            d3.select("#sub_description_title").text(county_id.replace("_", " "));

        }

        // update fast facts, sparklines, and tooltips
        get_current_pointer(county_id, scope);
        get_fastfacts(current_pointer, scope);

        foster_care_trends(current_pointer, scope);
        tool_tip();

    });

}

// switching to the region map
function map_region() {
    //change scope variable
    scope = "region";

    if (scope == "region") {
        d3.select(".tooltip").style("display", "block");
    }

    // make all map settings/behavior appropriate for the scope
    d3.select("#wa_geo_map")
    .selectAll("path")
    .style("display", "none");

    d3.select("#wa_geo_map_region")
    .selectAll("path")
    .style("display", "block")
    .style("fill", "");

    d3.selectAll(".d3-tip-county").style("display", "block");

    d3.selectAll("." + default_region)
    .selectAll("path")
    .style("fill", color_highlight);

    d3.select("#sub_description_title").text(
        // replace '-' with ' ', and make the first letter upercase
        default_region.replace(/_/g, " ").replace(/(^|\s+)\w/g, function (s) {

            return s.toUpperCase();
        }));

    d3.select("#wa_geo_map_region")
    .selectAll("g")
    .on("click", function () {
        d3.select("#wa_geo_map_region")
        .selectAll("path")
        .style("fill", "");
        d3.select(this)
        .selectAll("path")
        .style("fill", color_highlight);
        d3.select("#sub_description").style("display", "none");
        var region_name = d3.select(this).attr("name");
        d3.select("#sub_description_title").text(region_name);

        // update fast facts, sparklines, and tooltips
        get_current_pointer(region_name.replace(/ /g, "_"), scope);
        get_fastfacts(current_pointer, scope);

        foster_care_trends(current_pointer, scope);
        tool_tip();

    });

}

// switching the map to focus on a particular fast fact
function get_fastfacts(current_pointer, scope) {

    var fastfact_chart = d3.fastfact()
        .fastfact_w(fastfact_w)
        .fastfact_h(fastfact_h);

    if (scope == "county")
        var data = data_county;
    else {
        var data = data_region;
        fastfact_chart.titles(titles_region);
    }

    d3.selectAll(".fastfact").remove();

    d3.select("#svg_fastfact")
    .attr("width", (width_p + margin_p.left + margin_p.right) * 5)
    .attr("height", height_p + margin_p.top + margin_p.bottom)
    .selectAll("g")
    .data(data[current_pointer]["population_fast_fact"])
    .enter()
    .append("g")
    .attr("class", "fastfact")
    .attr("transform", function (d, i) {
        return "translate(" + (margin_p.left + (width_p + margin_p.left + margin_p.right) * i) + "," + margin_p.top + ")";
    })
    .call(fastfact_chart);

    d3.selectAll(".fastfact")
    .on("mouseover", function () {
        d3.select(this)
        .select(".fastfact_axis path")
        .style("stroke", d3.hsl(color_main).brighter(0.5));

    })
    .on("mouseout", function () {
        if (d3.select(this).attr("checked") != "true") {
            d3.select(this)
            .select(".fastfact_axis path")
            .style("stroke", "#555");
        } else {
            d3.select(this)
            .select(".fastfact_axis path")
            .style("stroke", color_main);
        }

    })
    .on("click", function () {
        d3.selectAll(".fastfact")
        .attr("checked", "false")
        .selectAll(".fastfact_axis path")
        .style("stroke", "#555");

        d3.select(this).attr("checked", "true");
        d3.select(this)
        .select(".fastfact_axis path")
        .style("stroke", color_main);
        if (scope != "state")
            map_ranking(
                scope, "population_fast_fact",
                d3.select(this)
                .select("svg")
                .attr("id"));
    });
}

// switching the map to focus on a particular sparkline
function foster_care_trends(current_pointer, scope) {

    var sparkline_chart = d3.sparkline()
        .sparkline_w(sparkline_w)
        .sparkline_h(sparkline_h)
        .sparkline_domain(sparkline_domain);

    if (scope == "county")
        var data = data_county;
    else {
        var data = data_region;
        sparkline_chart.titles(titles_region);
    }

    d3.selectAll(".sparkline").remove();
    d3.selectAll(".sparkline_axis").remove();
    d3.selectAll(".sparkline_lines").remove();
    d3.select("#svg_trend")
    .attr("width", width_t + margin_t.left + margin_t.right)
    .attr("height", (height_t + margin_t.top + margin_t.bottom) * 5 + 50)
    .selectAll("g")
    .data(data[current_pointer]["foster_care_trend"])
    .enter()
    .append("g")
    .attr("class", "sparkline")
    .attr("transform", function (d, i) {
        return "translate(" + margin_t.left + "," + ((margin_t.top + (height_t + margin_t.top + margin_t.bottom)) * i) + ")";
    })
    .call(sparkline_chart);

    d3.selectAll(".sparkline").on("mouseover", function () {
        d3.select(this)
        .select(".trend_line")
        .style("stroke", d3.hsl(color_main).brighter(0.5));

    })
    .on("mouseout", function () {
        if (d3.select(this).attr("checked") != "true") {
            d3.select(this)
            .select(".trend_line")
            .style("stroke", "#555");
        } else {
            d3.select(this)
            .select(".trend_line")
            .style("stroke", color_main);
        }

    })
    .on("click", function () {
        d3.selectAll(".sparkline")
        .attr("checked", "false")
        .selectAll(".trend_line")
        .style("stroke", "#555");

        d3.select(this).attr("checked", "true");
        d3.select(this)
        .select(".trend_line")
        .style("stroke", color_main);

        if (scope != "state")
            map_ranking(
                scope, "foster_care_trend",
                d3.select(this)
                .select(".trend")
                .attr("id"));
    });

}
