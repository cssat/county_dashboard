// map body layout
var context_w = 714;
var context_h = 420;
var map_w = context_w * 0.4379;
var map_h = 400;
var map_x = (context_w / 2 - map_w);
var map_y = ((context_h - map_h) / 2);
var map_loc = [{
        x : map_x,
        y : map_y
    }
];

// layout for population fast facts
var margin_p = {
    top : 0,
    right : 5,
    bottom : 0,
    left : 0
};
var width_p = 217 - margin_p.left - margin_p.right;
var height_p = 115 - margin_p.top - margin_p.bottom;
var population_w = 202;
var population_h = 115;

// layout for sparklines
var margin_t = {
    top : 5,
    right : 5,
    bottom : 5,
    left : 35
};
var width_t = 350 - margin_t.left - margin_t.right;
var height_t = 90 - margin_t.top - margin_t.bottom;
var sparkline_w = 340;
var sparkline_h = 90;

// change them once get the real description file
// BW: ???
var fast_fact_desc = fast_fact_desc;
var population_desc = population_desc;

// scope: state, county, region
var scope = "county";

// store the place selected
var current_status = "Washington";

// default setting for user
var default_county = "King";
var default_region = "region_2_south";

//index in the data
var current_pointer;

var color_main = "#3B6E8F";
var color_highlight = "#A3DCE6";
var color_map_highlight = "#A3DCE6";

// color for each level
var color_l_1 = d3.hsl(color_main).brighter(1.5);
var color_l_2 = color_main;
var color_l_3 = d3.hsl(color_main).darker(0.8);
var color_l_4 = d3.hsl(color_main).darker(2);
var color_l_5 = d3.hsl(color_main).darker(2.5);
var color_l_6 = d3.hsl(color_main).darker(3);
var color_l_NaN = "#ccc";

// color for each region
var color_rigon_1 = d3.hsl(color_main).brighter(0.7);
var color_rigon_2 = d3.hsl(color_main).brighter(1.5);
var color_rigon_3 = d3.hsl(color_main).brighter(1.2);
var color_rigon_4 = color_main;
var color_rigon_5 = d3.hsl(color_main).darker(0.5);
var color_rigon_6 = d3.hsl(color_main).darker(0.8);

// Create container for tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var svg_map = d3.select("#t_context").append("svg")
    .attr("width", context_w)
    .attr("height", context_h)
    .attr("id", "svg_context")
    .append("g")
    .attr("id", "chart_context")
    .attr("transform", "translate(10,10)");

var wa_map = svg_map.append("g")
    .attr("id", "wa_map");

d3.select("#wa_map").data(map_loc).enter();
wa_map.attr("transform", function (d) {
    return "translate(" + d.x + "," + d.y + ")";
});

var nav_bar = svg_map.append("g")
    .attr("id", "nav_bar")
    .attr("transform", "translate(" + (context_w - 210 - 20) + ",0)");

var sub_description = svg_map.append("g")
    .attr("id", "sub_description")
    .attr("transform", "translate(0,0)");

var svg_population = d3.select("#t_population").append("svg")
    .attr("id", "svg_population");

var svg_trend = d3.select("#t_trend").append("svg")
    .attr("id", "svg_trend");

//DATA IN CONTEXT

//map for county
var svg = d3.select("#wa_map").call(wa_geo_map);

d3.select("#wa_geo_map")
.attr("height", map_h);

d3.select("#wa_geo_map").selectAll("text").style("display", "none");

d3.select("#wa_geo_map").selectAll("text")
.style("font-size", "2005.942px");

d3.select("#wa_geo_map").selectAll("g").attr("checked", "false");

//map for region
var svg = d3.select("#wa_map").call(wa_geo_map_region);

d3.select("#wa_geo_map_region")
// .attr("transform","translate(0, -49)")
.attr("height", map_h * 1.33);

d3.select("#wa_geo_map_region").selectAll("g")
.attr("transform", "translate(0, -79)");

d3.select("#wa_geo_map_region").selectAll("text").style("display", "none");

d3.select("#wa_geo_map_region").selectAll("path")
.style("stroke", "white")
.style("display", "none");

d3.select("#wa_geo_map_region").selectAll("text")
.style("font-size", "28px");

d3.select("#wa_geo_map_region").selectAll("g").attr("checked", "false");

//style state/region/county buttons
d3.select("#radios").selectAll("div")
.attr("checked", "unchecked")
.style("border-color", d3.hsl(color_main).brighter(1.2));

//sub_description
// temporary solution
d3.select("#t_context h2").append("text")
.attr("id", "sub_description_title")
.text(
    // replace '-' with ' ', and make the first letter upercase
    default_region.replace(/_/g, " ").replace(/(^|\s+)\w/g, function (s) {

        return s.toUpperCase();
    }));

d3.select("#sub_description").append("text")
.attr("id", "sub_description_measure")
.attr("transform", "translate(-10,6)")
.text("Percent Employment");

var measure_desc = d3.select("#sub_description").append("g")
    .attr("transform", "translate(-10,20)")
    .attr("class", "measure_desc");

var m_1 = measure_desc.append("g")
    .attr("transform", "translate(5,0)")
    .attr("id", "mea_level_1");

m_1.append("circle")
.attr("r", 4.5)
.attr("fill", color_l_1);

m_1.append("text")
.text("0% - 20%")
.attr("dy", ".51em")
.attr("x", 15);

var m_2 = measure_desc.append("g")
    .attr("transform", "translate(5,13)")
    .attr("id", "mea_level_2");

m_2.append("circle")
.attr("r", 4.5)
.attr("fill", color_l_2);

m_2.append("text")
.text("20% - 40%")
.attr("dy", ".51em")
.attr("x", 15);

var m_3 = measure_desc.append("g")
    .attr("transform", "translate(5,26)")
    .attr("id", "mea_level_3");

m_3.append("circle")
.attr("r", 4.5)
.attr("fill", color_l_3);

m_3.append("text")
.text("40% - 60%")
.attr("dy", ".51em")
.attr("x", 15);

var m_4 = measure_desc.append("g")
    .attr("transform", "translate(5,39)")
    .attr("id", "mea_level_4");

m_4.append("circle")
.attr("r", 4.5)
.attr("fill", color_l_4);

m_4.append("text")
.text("60% - 80%")
.attr("dy", ".51em")
.attr("x", 15);

var m_5 = measure_desc.append("g")
    .attr("transform", "translate(5,52)")
    .attr("id", "mea_level_5");

m_5.append("circle")
.attr("r", 4.5)
.attr("fill", color_l_5);

m_5.append("text")
.text("80% - 100%")
.attr("dy", ".51em")
.attr("x", 15);

var m_6 = measure_desc.append("g")
    .attr("transform", "translate(5,65)")
    .attr("id", "mea_level_6");

m_6.append("circle")
.attr("r", 4.5)
.attr("fill", color_l_NaN);

m_6.append("text")
.text("No Data")
.attr("dy", ".51em")
.attr("x", 15);

//initialize current pointer
get_current_pointer(default_county, "county");

//initialize data in context
d3.select("#radio_county").attr('checked', 'checked').style("border-color", color_map_highlight);

d3.select("#sub_description_title").text(default_county);

//initialize map
map_county();

//initialize population fast fact
population_fast_fact(current_pointer, "county");

//initialize foster care trends
foster_care_trends(current_pointer, "county");

//initialize tool tips
tool_tip();

//hide the ranking
d3.select("#sub_description").style("display", "none");

d3.select("#radios").selectAll("div")
.on("mouseover", function () {
    d3.select(this).style("border-color", d3.hsl(color_map_highlight).brighter(0.5));
})
.on("mouseout", function () {
    if (d3.select(this).attr("checked") == "unchecked") {
        d3.select(this).style("border-color", d3.hsl(color_main).brighter(1.2));
    } else {
        d3.select(this).style("border-color", color_map_highlight);

    }
})

//state radio
d3.select("#radio_state").on("click", function () {

    scope = "state";

    d3.select("#radios").selectAll("div")
    .attr('checked', 'unchecked')
    .style("border-color", d3.hsl(color_main).brighter(1.2));

    d3.select("#radio_state")
    .attr('checked', 'checked');

    d3.select(this).style("border-color", color_map_highlight);

    d3.select("#sub_description_title")
    .text("Washington");

    d3.select("#sub_description").style("display", "none");

    map_state();

    get_current_pointer("Washington", scope);

    population_fast_fact(current_pointer, scope);

    foster_care_trends(current_pointer, scope);

    tool_tip();

})

//region radio
d3.select("#radio_region").on("click", function () {

    scope = "region";

    d3.select("#radios").selectAll("div")
    .attr('checked', 'unchecked')
    .style("border-color", d3.hsl(color_main).brighter(1.2));

    d3.select("#radio_region")
    .attr('checked', 'checked');

    d3.select(this)
    .style("border-color", color_map_highlight);

    d3.select("#sub_description_title")
    .text(default_region);

    d3.select("#sub_description").style("display", "none");

    map_region();

    get_current_pointer(default_region.replace(/_/g, " ").replace(/(^|\s+)\w/g, function (s) {

            return s.toUpperCase();
        }).replace(/ /g, "_"), scope);

    population_fast_fact(current_pointer, scope);

    foster_care_trends(current_pointer, scope);

    tool_tip();
})

//county radio
d3.select("#radio_county").on("click", function () {
    scope = "county";

    d3.select("#radios").selectAll("div")
    .attr('checked', 'unchecked')
    .style("border-color", d3.hsl(color_main).brighter(1.2));

    d3.select("#radio_county")
    .attr('checked', 'checked');

    d3.select(this)
    .style("border-color", color_map_highlight);

    d3.select("#sub_description_title")
    .text(default_county);

    d3.select("#sub_description").style("display", "none");

    map_county();

    get_current_pointer(default_county, scope);

    population_fast_fact(current_pointer, scope);

    foster_care_trends(current_pointer, scope);

    tool_tip();

})

// interations on WA map
function map_state() {
    //change scope
    scope = "state";

    if (scope == "state") {
        d3.select(".tooltip").style("display", "none");
    }

    d3.select("#wa_geo_map").selectAll("path").style("display", "block");

    d3.select("#wa_geo_map_region").selectAll("path").style("display", "none");
    d3.selectAll(".d3-tip-county").style("display", "none");
    d3.select("#sub_description_title").text("Washington");

    d3.select("#wa_geo_map").selectAll("path").style("fill", "").style("stroke", d3.hsl(color_main).brighter(1.2));
    d3.select("#wa_geo_map_region").selectAll("path").style("display", "none");
    d3.select("#wa_geo_map").selectAll("g")
    .on("mouseover", function () {
        d3.select("#wa_geo_map").selectAll("path").style("fill", d3.hsl(color_map_highlight).brighter(0.5)).style("stroke", d3.hsl(color_map_highlight).brighter(0.5));
    })
    .on("mouseout", function () {
        d3.select("#wa_geo_map").selectAll("path").style("fill", d3.hsl(color_main).brighter(1.2)).style("stroke", d3.hsl(color_main).brighter(1.2));
    })
    .on("click", function () {});

}

function map_county() {

    //change scope
    scope = "county";

    if (scope == "county") {
        d3.select(".tooltip").style("display", "block");
    }

    // clear all settings
    d3.select("#wa_geo_map").selectAll("path").style("display", "block").style("stroke", "white");

    d3.select("#wa_geo_map_region").selectAll("path").style("display", "none");

    d3.selectAll(".d3-tip-county").style("display", "block");

    // default setting
    d3.select("#wa_geo_map").selectAll("path").style("fill", "");
    d3.select("#" + default_county).selectAll("path").style("fill", color_map_highlight);
    d3.select("#sub_description_title").text(default_county);

    // mouse events
    d3.select("#wa_geo_map").selectAll("g")
    // when click on a county, changes county color and change sub title
    .on("mouseover", function () {})
    .on("mouseout", function () {})
    .on("click", function () {
        d3.select("#wa_geo_map").selectAll("path").style("fill", "");
        d3.select(this).selectAll("path").style("fill", color_map_highlight);
        d3.select("#sub_description").style("display", "none");
        var county_id = d3.select(this).attr("id");
        current_status = d3.select(this).attr("id");

        // small counties
        var isSmallCounty = small_counties.some(function (d) {
                return county_id == d;
            });
        if (isSmallCounty) {
            small_counties.forEach(function (d) {
                d3.select("#" + d).selectAll("path").style("fill", color_map_highlight);
            })
            d3.select("#sub_description_title").text("Small Counties");

        } else {
            d3.select("#sub_description_title").text(county_id.replace("_", " "));

        }

        // change display at fast fact and population
        get_current_pointer(county_id, scope);
        population_fast_fact(current_pointer, scope);

        foster_care_trends(current_pointer, scope);
        tool_tip();

    });

}

function map_region() {
    /***************map region********************/
    //change scope
    scope = "region";

    if (scope == "region") {
        d3.select(".tooltip").style("display", "block");
    }

    // clear all settings
    d3.select("#wa_geo_map").selectAll("path").style("display", "none");

    d3.select("#wa_geo_map_region").selectAll("path")
    .style("display", "block")
    .style("fill", "");

    d3.selectAll(".d3-tip-county").style("display", "block");

    // default setting
    d3.selectAll("." + default_region).selectAll("path").style("fill", color_map_highlight);

    d3.select("#sub_description_title").text(
        // replace '-' with ' ', and make the first letter upercase
        default_region.replace(/_/g, " ").replace(/(^|\s+)\w/g, function (s) {

            return s.toUpperCase();
        }));

    // mouse events
    d3.select("#wa_geo_map_region").selectAll("g")
    // when click on a region, changes region color and change sub title
    .on("click", function () {
        d3.select("#wa_geo_map_region").selectAll("path").style("fill", "");
        d3.select(this).selectAll("path").style("fill", color_map_highlight);
        d3.select("#sub_description").style("display", "none");
        var region_name = d3.select(this).attr("name");
        d3.select("#sub_description_title").text(region_name);

        // change display at fast fact and population
        get_current_pointer(region_name.replace(/ /g, "_"), scope);
        population_fast_fact(current_pointer, scope);

        foster_care_trends(current_pointer, scope);
        tool_tip();

    });

}

function population_fast_fact(current_pointer, scope) {

    var population_chart = d3.population()
        .population_w(population_w)
        .population_h(population_h);

    if (scope == "county")
        var data = data_county;
    else {
        var data = data_region;
        population_chart.titles(titles_region);
    }

    d3.selectAll(".population").remove();

    d3.select("#svg_population")
    .attr("width", (width_p + margin_p.left + margin_p.right) * 5)
    .attr("height", height_p + margin_p.top + margin_p.bottom)
    .selectAll("g")
    .data(data[current_pointer]["population_fast_fact"]).enter()
    .append("g")
    .attr("class", "population")
    .attr("transform", function (d, i) {
        return "translate(" + (margin_p.left + (width_p + margin_p.left + margin_p.right) * i) + "," + margin_p.top + ")";
    })
    .call(population_chart);

    d3.selectAll(".population").on("mouseover", function () {
        d3.select(this).select(".population_axis path").style("stroke", d3.hsl(color_main).brighter(0.5));

    })
    .on("mouseout", function () {
        if (d3.select(this).attr("checked") != "true") {
            d3.select(this).select(".population_axis path").style("stroke", "#555");
        } else {
            d3.select(this).select(".population_axis path").style("stroke", color_main);
        }

    })
    .on("click", function () {
        d3.selectAll(".population").attr("checked", "false").selectAll(".population_axis path").style("stroke", "#555");

        d3.select(this).attr("checked", "true");
        d3.select(this).select(".population_axis path").style("stroke", color_main);
        if (scope != "state")
            map_ranking(scope, "population_fast_fact", d3.select(this).select("svg").attr("id"));
    });
}

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
    .data(data[current_pointer]["foster_care_trend"]).enter()
    .append("g")
    .attr("class", "sparkline")
    .attr("transform", function (d, i) {
        return "translate(" + margin_t.left + "," + ((margin_t.top + (height_t + margin_t.top + margin_t.bottom)) * i) + ")";
    })
    .call(sparkline_chart);

    d3.selectAll(".sparkline").on("mouseover", function () {
        d3.select(this).select(".trend_line").style("stroke", d3.hsl(color_main).brighter(0.5));

    })
    .on("mouseout", function () {
        if (d3.select(this).attr("checked") != "true") {
            d3.select(this).select(".trend_line").style("stroke", "#555");
        } else {
            d3.select(this).select(".trend_line").style("stroke", color_main);
        }

    })
    .on("click", function () {
        d3.selectAll(".sparkline").attr("checked", "false").selectAll(".trend_line").style("stroke", "#555");

        d3.select(this).attr("checked", "true");
        d3.select(this).select(".trend_line").style("stroke", color_main);

        if (scope != "state")
            map_ranking(scope, "foster_care_trend", d3.select(this).select(".trend").attr("id"));
    });

}

// get location's ID
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

// tool tips, term descrptions
function tool_tip() {

    var tip_f_0 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + fast_fact_desc[0]["title"] + "</strong><br /><span>" + fast_fact_desc[0]["descrption"] + "</span>";
        })

        var tip_f_1 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + fast_fact_desc[1]["title"] + "</strong><br /><span>" + fast_fact_desc[1]["descrption"] + "</span>";
        })

        var tip_f_2 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + fast_fact_desc[2]["title"] + "</strong><br /><span>" + fast_fact_desc[2]["descrption"] + "</span>";
        })

        var tip_f_3 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + fast_fact_desc[3]["title"] + "</strong><br /><span>" + fast_fact_desc[3]["descrption"] + "</span>";
        })

        var tip_f_4 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + fast_fact_desc[4]["title"] + "</strong><br /><span>" + fast_fact_desc[4]["descrption"] + "</span>";
        })

        d3.select("#svg_trend").call(tip_f_0);
    d3.select("#trend_0").select(".sparkline_title").on('mouseover', tip_f_0.show)
    .on('mouseout', tip_f_0.hide);

    d3.select("#svg_trend").call(tip_f_1);
    d3.select("#trend_1").select(".sparkline_title").on('mouseover', tip_f_1.show)
    .on('mouseout', tip_f_1.hide);

    d3.select("#svg_trend").call(tip_f_2);
    d3.select("#trend_2").select(".sparkline_title").on('mouseover', tip_f_2.show)
    .on('mouseout', tip_f_2.hide);

    d3.select("#svg_trend").call(tip_f_3);
    d3.select("#trend_3").select(".sparkline_title").on('mouseover', tip_f_3.show)
    .on('mouseout', tip_f_3.hide);

    d3.select("#svg_trend").call(tip_f_4);
    d3.select("#trend_4").select(".sparkline_title").on('mouseover', tip_f_4.show)
    .on('mouseout', tip_f_4.hide);

    var tip_p_0 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + population_desc[0]["title"] + "</strong><br /><span>" + population_desc[0]["descrption"] + "</span>";
        })

        var tip_p_1 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + population_desc[1]["title"] + "</strong><br /><span>" + population_desc[1]["descrption"] + "</span>";
        })

        var tip_p_2 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + population_desc[2]["title"] + "</strong><br /><span>" + population_desc[2]["descrption"] + "</span>";
        })

        var tip_p_3 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + population_desc[3]["title"] + "</strong><br /><span>" + population_desc[3]["descrption"] + "</span>";
        })

        var tip_p_4 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + population_desc[4]["title"] + "</strong><br /><span>" + population_desc[4]["descrption"] + "</span>";
        })

        d3.select("#svg_population").call(tip_p_0);
    d3.select("#population_0").select(".text_title").on('mouseover', tip_p_0.show)
    .on('mouseout', tip_p_0.hide);

    d3.select("#svg_population").call(tip_p_1);
    d3.select("#population_1").select(".text_title").on('mouseover', tip_p_1.show)
    .on('mouseout', tip_p_1.hide);

    d3.select("#svg_population").call(tip_p_2);
    d3.select("#population_2").select(".text_title").on('mouseover', tip_p_2.show)
    .on('mouseout', tip_p_2.hide);

    d3.select("#svg_population").call(tip_p_3);
    d3.select("#population_3").select(".text_title").on('mouseover', tip_p_3.show)
    .on('mouseout', tip_p_3.hide);

    d3.select("#svg_population").call(tip_p_4);
    d3.select("#population_4").select(".text_title").on('mouseover', tip_p_4.show)
    .on('mouseout', tip_p_4.hide);

}

function map_ranking(scope, category, id) { //categrory ["foster_care_trend" or "population_fast_fact"]; id is the "id" inside that category
    var counties = get_ranking(scope, category, id);

    counties.map(function (d) {
        if (scope == "county") {
            d3.selectAll("#" + d.id).selectAll("path").style("fill", d.color);
        } else {
            d3.selectAll("." + d.id.toLowerCase()).selectAll("path").style("fill", d.color);
        }
    });
}

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
                if (element.length != 0)
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
        d3.select("#mea_level_" + i).select("text").text(valueFormat(range[i - 1]) + " - " + valueFormat(range[i]));
    }

    return counties;
}
