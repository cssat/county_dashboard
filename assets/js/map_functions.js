/* 
These are the workhorse functions for creating and updating the map objects and
map scale.
*/

// creates the county map svg from the base map svg
function wa_geo_map(g) {

    var svg = g.append("svg")
        .attr("id", "wa_geo_map")
        .attr("viewBox", "-33254,-19037 59361,38626");

    var tip = d3.tip()
        .attr('class', 'd3-tip-county')
        .offset([-10, 0])
        .html(function (d) {
            return "<span>" + d.county + "</span>";
        });

        svg.call(tip);

    var div = d3.select("div.tooltip");

    var county = svg.selectAll("g")
        .data(counties)
        .enter().append("g")
        .attr("class", function (d) {
            return d.region_id;
        })
        .attr("name", function (d) {
            return d.region;
        })
        .attr("id", function (d) {
            return d.id;
        });

    county.append("path")
    .attr("d", function (d) {
        return d.path;
    })
    .attr("class", "wa_geo_map")
    .on("mouseover", function (d) {
        d3.select(this)
        .transition()
        .duration(300)
        .style("opacity", 1);
        div.transition()
        .duration(300)
        .style("opacity", 1);
        div.text(d.county)
        .style("left", (d3.event.pageX - 30) + "px")
        .style("top", (d3.event.pageY - 30) + "px");
    })
    .on("mouseout", function () {
        d3.select(this)
        .transition()
        .duration(300)
        .style("opacity", 1);
        div.transition()
        .duration(300)
        .style("opacity", 0);
    });

    for (var i = 0, c_len = counties.length; i < c_len; i++) {
        for (var j = 0, p_len = county_path.length; j < p_len; j++) {
            if (counties[i]["id"] == county_path[j]["county"]) {
                d3.select("#" + counties[i]["id"])
                .append("path")
                .attr("class", "wa_geo_map")
                .attr("d", county_path[j]["path"]);
            }
        }
    }

    d3.select("#wa_geo_map")
    .selectAll("path")
    .style("stroke", "white")
    .style("stroke-width", "50");

}

// creates the region map svg from the base map svg
function wa_geo_map_region(g) {

    var svg = g.append("svg")
        .attr("id", "wa_geo_map_region")
        .attr("viewBox", "0 0 900 700");

    var tip = d3.tip()
        .attr('class', 'd3-tip-county')
        .offset([-10, 0])
        .html(function (d) {
            return "<span>" + d.region_name + "</span>";
        });

        svg.call(tip);

    var region = svg.selectAll("g")
        .data(regions)
        .enter().append("g")
        .attr("class", function (d) {
            return d.region_code;
        })
        .attr("name", function (d) {
            return d.region_name;
        });

    region.append("path")
    .attr("d", function (d) {
        return d.path;
    })
    .attr("class", "wa_geo_map_region")
    .on("mouseover", function (d) {
        d3.select(this)
        .transition()
        .duration(300)
        .style("opacity", 1);
        div.transition()
        .duration(300)
        .style("opacity", 1);
        div.text(d.region_name)
        .style("left", (d3.event.pageX - 30) + "px")
        .style("top", (d3.event.pageY - 30) + "px");
    })
    .on("mouseout", function () {
        d3.select(this)
        .transition()
        .duration(300)
        .style("opacity", 1);
        div.transition()
        .duration(300)
        .style("opacity", 0);
    });

    for (var i = 0, r_len = regions.length; i < r_len; i++) {
        for (var j = 0, p_len = region_path.length; j < p_len; j++) {
            if (regions[i]["region_code"] == region_path[j]["region_code"]) {
                d3.select("#wa_geo_map_region")
                .select("." + regions[i]["region_code"])
                .append("path")
                .attr("class", "wa_geo_map_region")
                .attr("d", region_path[j]["path"]);
            }
        }
    }

    d3.select("#wa_geo_map_region")
    .selectAll("path")
    .style("stroke", "black")
    .style("fill", "none");
}

// gets scale information appropriate for selected fact/sparkline and current
// scope; also adjusts the map scale and map scale elements to match
function get_ranking(scope, category, id) { //categrory ["foster_care_trend" or "population_fast_fact"]; id is the "id" inside that category

    if (scope == "county") {
        var data = data_county;
        var element = titles_county[category][id];
    } else {
        var data = data_region;
        var element = titles_region[category][id];
    }

    var valueFormat = d3.format(".2" + element.valueFormat);

    if (category == "foster_care_trend") {
        var index = id.substr(6, 1);
        var max = element.maxCurrent,
        min = element.minCurrent;
    } else {
        var index = id.substr(11, 1);
        var max = element.max,
        min = element.min;
    }

    var range = d3.range(min, max, ((max - min) / 5));
    range.push(max);

    var counties = data.map(function (d) {
            if (category == "foster_care_trend") {
                var element = (d[category][index]["statistic"]);
                if (element.length !== 0)
                    return {
                        "id" : d.id,
                        "value" : element[element.length - 1].value
                    };
                else
                    return {
                        "id" : d.id,
                        "value" : NaN
                    };
            } else {
                var element = (d[category][index]["statistic"]);
                return {
                    "id" : d.id,
                    "value" : element
                };
            }
        });

    counties.map(function (d) {
        if (d.value < range[1])
            d.color = color_l_1;
        else if (d.value < range[2])
            d.color = color_l_2;
        else if (d.value < range[3])
            d.color = color_l_3;
        else if (d.value < range[4])
            d.color = color_l_4;
        else if (isNaN(d.value))
            d.color = color_l_NaN; // empty value;
        else
            d.color = color_l_5;
    });

    d3.select("#sub_description").style("display", "block");

    d3.select("#sub_description_measure").text(element.title);

    for (var i = 1; i <= 5; i++) {
        d3.select("#mea_level_" + i)
        .select("text")
        .text(valueFormat(range[i - 1]) + " - " + valueFormat(range[i]));
    }

    return counties;
}

// adjusts map coloring when scaling is appropriate
function map_ranking(scope, category, id) { //categrory ["foster_care_trend" or "population_fast_fact"]; id is the "id" inside that category
    var counties = get_ranking(scope, category, id);

    counties.map(function (d) {
        if (scope == "county") {
            d3.selectAll("#" + d.id)
            .selectAll("path")
            .style("fill", d.color);
        } else {
            d3.selectAll("." + d.id.toLowerCase())
            .selectAll("path")
            .style("fill", d.color);
        }
    });
}

