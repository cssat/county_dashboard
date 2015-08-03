/* LAYOUT AND COLOR GLOBAL VARIABLES */
// base colors for the map, map scale, and radio button outlines - these get 
// manipulated with d3 functions to produce the full gradient needed for
// the map scale
var color_main = "#3B6E8F";
var color_highlight = "#A3DCE6";

// the extended color palette made from the base colors for the map and map
// scale
var color_l_1 = d3.hsl(color_main).brighter(1.5);
var color_l_2 = color_main;
var color_l_3 = d3.hsl(color_main).darker(0.8);
var color_l_4 = d3.hsl(color_main).darker(2);
var color_l_5 = d3.hsl(color_main).darker(2.5);
var color_l_6 = d3.hsl(color_main).darker(3);
var color_l_NaN = "#ccc";

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

// layout for fast facts
var margin_p = {
    top : 0,
    right : 5,
    bottom : 0,
    left : 0
};
var width_p = 217 - margin_p.left - margin_p.right;
var height_p = 115 - margin_p.top - margin_p.bottom;
var fastfact_w = 202;
var fastfact_h = 115;

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

/* USER DEFAULTS GLOBAL VARIABLES */
// defaults for what the user sees when they arrive at the app
var default_scope = "state";
var default_map_title = "Washington";
// defaults for what the user sees when they arrive at county/region maps
var default_county = "King";
var default_region = "region_2_south";

/* DATE GLOBAL VARIABLE */
// this is used during the sparkline creation/updating but not entirely
// sure why it is needed (see sparkline_functions.js for calls)
parseDate = d3.time.format("%Y-%m-%d").parse;

/* RADIO BUTTON INITIALIZATION */
/* NOTE: this doesn't include the button logic - just definition and styling;
see end of app.js for what buttons do when clicked */
// button div
d3.select("#t_context")
.append("div")
.attr("id", "radios");

// buttons (will appear left-to-right in reverse order from laid out here)
d3.select("#radios")
.append("div")
.attr("class", "s_r_c")
.attr("id", "radio_region")
.text("Region");

d3.select("#radios")
.append("div")
.attr("class", "s_r_c")
.attr("id", "radio_county")
.text("County");

d3.select("#radios")
.append("div")
.attr("class", "s_r_c")
.attr("id", "radio_state")
.text("State");

// button selection behavior
d3.select("#radios")
.selectAll("div")
.attr("checked", "unchecked")
.style("border-color", d3.hsl(color_main).brighter(1.2));

// button hover behavior
d3.select("#radios")
.selectAll("div")
.on("mouseover", function () {
    d3.select(this).style("border-color", d3.hsl(color_highlight).brighter(0.5));
})
.on("mouseout", function () {
    if (d3.select(this).attr("checked") == "unchecked") {
        d3.select(this).style("border-color", d3.hsl(color_main).brighter(1.2));
    } else {
        d3.select(this).style("border-color", color_highlight);

    }
});

/* TOOLTIP INITIALIZATION AND GLOBALS */
// tooltip (used by map, sparklines, and fast facts on mouse hover)
// NOTE: needs to be declared before county/region map declarations as the
//       function that produces those has a dependency on this
var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

/* MAP INIITALIZATION AND GLOBALS */
// base svg (where map svgs will be placed and map features will be drawn)
var svg_map = d3.select("#t_context")
    .append("svg")
    .attr("width", context_w)
    .attr("height", context_h)
    .attr("id", "svg_context")
    .append("g")
    .attr("id", "chart_context")
    .attr("transform", "translate(10,10)");

var sub_description = svg_map.append("g")
    .attr("id", "sub_description")
    .attr("transform", "translate(0,0)");

// base svg feature: map title
d3.select("#t_context h2")
.append("text")
.attr("id", "sub_description_title")
.text(
    // replace '-' with ' ', and make the first letter upercase
    default_region.replace(/_/g, " ").replace(/(^|\s+)\w/g, function (s) {

        return s.toUpperCase();
    }));

// base svg feature: map scale and map scale elements
d3.select("#sub_description")
.append("text")
.attr("id", "sub_description_measure")
.attr("transform", "translate(-10,6)")
.text("Percent Employment");

var nav_bar = svg_map.append("g")
    .attr("id", "nav_bar")
    .attr("transform", "translate(" + (context_w - 210 - 20) + ",0)");

var measure_desc = d3.select("#sub_description")
    .append("g")
    .attr("transform", "translate(-10,20)")
    .attr("class", "measure_desc");

var m_1 = measure_desc.append("g")
    .attr("transform", "translate(5,0)")
    .attr("id", "mea_level_1");

var m_2 = measure_desc.append("g")
    .attr("transform", "translate(5,13)")
    .attr("id", "mea_level_2");

var m_3 = measure_desc.append("g")
    .attr("transform", "translate(5,26)")
    .attr("id", "mea_level_3");

var m_4 = measure_desc.append("g")
    .attr("transform", "translate(5,39)")
    .attr("id", "mea_level_4");

var m_5 = measure_desc.append("g")
    .attr("transform", "translate(5,52)")
    .attr("id", "mea_level_5");

var m_6 = measure_desc.append("g")
    .attr("transform", "translate(5,65)")
    .attr("id", "mea_level_6");

m_1.append("circle")
.attr("r", 4.5)
.attr("fill", color_l_1);

m_1.append("text")
.text("0% - 20%")
.attr("dy", ".51em")
.attr("x", 15);

m_2.append("circle")
.attr("r", 4.5)
.attr("fill", color_l_2);

m_2.append("text")
.text("20% - 40%")
.attr("dy", ".51em")
.attr("x", 15);

m_3.append("circle")
.attr("r", 4.5)
.attr("fill", color_l_3);

m_3.append("text")
.text("40% - 60%")
.attr("dy", ".51em")
.attr("x", 15);

m_4.append("circle")
.attr("r", 4.5)
.attr("fill", color_l_4);

m_4.append("text")
.text("60% - 80%")
.attr("dy", ".51em")
.attr("x", 15);

m_5.append("circle")
.attr("r", 4.5)
.attr("fill", color_l_5);

m_5.append("text")
.text("80% - 100%")
.attr("dy", ".51em")
.attr("x", 15);

m_6.append("circle")
.attr("r", 4.5)
.attr("fill", color_l_NaN);

m_6.append("text")
.text("No Data")
.attr("dy", ".51em")
.attr("x", 15);

// generic map svg (placed on base svg)
var wa_map = svg_map.append("g")
    .attr("id", "wa_map");

d3.select("#wa_map")
.data(map_loc)
.enter();

wa_map.attr("transform", function (d) {
    return "translate(" + d.x + "," + d.y + ")";
});

// create a div with a county map svg
var svg = d3.select("#wa_map").call(wa_geo_map);

d3.select("#wa_geo_map")
.attr("height", map_h);

d3.select("#wa_geo_map")
.selectAll("text")
.style("display", "none");

d3.select("#wa_geo_map")
.selectAll("text")
.style("font-size", "2005.942px");

d3.select("#wa_geo_map")
.selectAll("g")
.attr("checked", "false");

// create a div with a region map svg
// NOTE: the region map needs its own code because it is actually based on a
//       different map than state or county (which share their map)
var svg = d3.select("#wa_map").call(wa_geo_map_region);

d3.select("#wa_geo_map_region").attr("height", map_h * 1.33);

d3.select("#wa_geo_map_region")
.selectAll("g")
.attr("transform", "translate(0, -79)");

d3.select("#wa_geo_map_region")
.selectAll("text")
.style("display", "none");

d3.select("#wa_geo_map_region")
.selectAll("path")
.style("stroke", "white")
.style("display", "none");

d3.select("#wa_geo_map_region")
.selectAll("text")
.style("font-size", "28px");

d3.select("#wa_geo_map_region")
.selectAll("g")
.attr("checked", "false");

/* SPARKLINES INITIALIZATION AND GLOBALS */
// svg to draw the sparklines on
var svg_trend = d3.select("#t_trend")
    .append("svg")
    .attr("id", "svg_trend");

/* FAST FACTS INITIALIZATION AND GLOBALS */
// svg to draw the fast facts on
var svg_fastfact = d3.select("#t_fastfact")
    .append("svg")
    .attr("id", "svg_fastfact");

/* INITIALIZE APPLICATION STATE (COUNTY VIEW, DEFAULT COUNTY, NO SCALE) */
/* NOTE: This is not an ideal way to initialize the application. It should be
initialized with a function corresponding to a particular radio
button's logic. However, the logic for each radio button is not
captured in functions (or, better, one function for them all) and
would require more effort to refactor than is currently available.
 */
// initialize data/scope to default county
get_current_pointer("Washington", default_scope);

// initialize radio buttons to show current scope is default
d3.select("#radio_state")
.attr('checked', 'checked')
.style("border-color", color_highlight);

// intialize nav bar subtitle to show default map title
d3.select("#sub_description_title").text(default_map_title);

// initialize map to state map
map_state();

// initialize fast fact to show default county results
get_fastfacts(current_pointer, "state");

// initialize sparklines to show default county results
foster_care_trends(current_pointer, "state");

// initialize tool tips
tool_tip();

// hide the mape scale since no appropriate feature is selected by default
d3.select("#sub_description")
.style("display", "none");

/* RADIO BUTTON LOGIC - MAP/DATA TOGGLING */
/* NOTE: Ideally, the button logic would be captured in a single function
with appropriate options for discriminating among which button was
clicked. Currently do not have time/effort to do the necessary
bug fixing and refactoring to make this happen.
 */
/* NOTE: At least for the time being, this needs to come at the end of the file
as it has dependencies on all sorts of stuff above.
 */
// "State" radio button
d3.select("#radio_state").on("click", function () {

    scope = "state";

    d3.select("#radios")
    .selectAll("div")
    .attr('checked', 'unchecked')
    .style("border-color", d3.hsl(color_main).brighter(1.2));

    d3.select("#radio_state")
    .attr('checked', 'checked');

    d3.select(this).style("border-color", color_highlight);

    d3.select("#sub_description_title")
    .text("Washington");

    d3.select("#sub_description").style("display", "none");

    map_state();

    get_current_pointer("Washington", scope);

    get_fastfacts(current_pointer, scope);

    foster_care_trends(current_pointer, scope);

    tool_tip();

});

// "County" radio button
d3.select("#radio_county").on("click", function () {
    scope = "county";

    d3.select("#radios")
    .selectAll("div")
    .attr('checked', 'unchecked')
    .style("border-color", d3.hsl(color_main).brighter(1.2));

    d3.select("#radio_county")
    .attr('checked', 'checked');

    d3.select(this)
    .style("border-color", color_highlight);

    d3.select("#sub_description_title")
    .text(default_county);

    d3.select("#sub_description").style("display", "none");

    map_county();

    get_current_pointer(default_county, scope);

    get_fastfacts(current_pointer, scope);

    foster_care_trends(current_pointer, scope);

    tool_tip();

});

// "Region" radio button
d3.select("#radio_region").on("click", function () {

    scope = "region";

    d3.select("#radios")
    .selectAll("div")
    .attr('checked', 'unchecked')
    .style("border-color", d3.hsl(color_main).brighter(1.2));

    d3.select("#radio_region")
    .attr('checked', 'checked');

    d3.select(this)
    .style("border-color", color_highlight);

    d3.select("#sub_description_title")
    .text(default_region);

    d3.select("#sub_description").style("display", "none");

    map_region();

    get_current_pointer(default_region.replace(/_/g, " ")
        .replace(/(^|\s+)\w/g, function (s) {

            return s.toUpperCase();
        }).replace(/ /g, "_"), scope);

    get_fastfacts(current_pointer, scope);

    foster_care_trends(current_pointer, scope);

    tool_tip();
});