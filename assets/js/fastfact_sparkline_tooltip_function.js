/*
The central function for creating the fast fact and sparkline tooltips.
Gets called whenever a new scope is selected.
 */

function tool_tip() {

    var tip_f_0 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + sparkline_desc[0]["title"] + "</strong><br /><span>" + sparkline_desc[0]["descrption"] + "</span>";
        });

    var tip_f_1 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + sparkline_desc[1]["title"] + "</strong><br /><span>" + sparkline_desc[1]["descrption"] + "</span>";
        });

    var tip_f_2 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + sparkline_desc[2]["title"] + "</strong><br /><span>" + sparkline_desc[2]["descrption"] + "</span>";
        });

    var tip_f_3 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + sparkline_desc[3]["title"] + "</strong><br /><span>" + sparkline_desc[3]["descrption"] + "</span>";
        });

    var tip_f_4 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + sparkline_desc[4]["title"] + "</strong><br /><span>" + sparkline_desc[4]["descrption"] + "</span>";
        });

    d3.select("#svg_trend").call(tip_f_0);
    d3.select("#trend_0")
    .select(".sparkline_title")
    .on('mouseover', tip_f_0.show)
    .on('mouseout', tip_f_0.hide);

    d3.select("#svg_trend").call(tip_f_1);
    d3.select("#trend_1")
    .select(".sparkline_title")
    .on('mouseover', tip_f_1.show)
    .on('mouseout', tip_f_1.hide);

    d3.select("#svg_trend").call(tip_f_2);
    d3.select("#trend_2")
    .select(".sparkline_title")
    .on('mouseover', tip_f_2.show)
    .on('mouseout', tip_f_2.hide);

    d3.select("#svg_trend").call(tip_f_3);
    d3.select("#trend_3")
    .select(".sparkline_title")
    .on('mouseover', tip_f_3.show)
    .on('mouseout', tip_f_3.hide);

    d3.select("#svg_trend").call(tip_f_4);
    d3.select("#trend_4")
    .select(".sparkline_title")
    .on('mouseover', tip_f_4.show)
    .on('mouseout', tip_f_4.hide);

    var tip_p_0 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + fastfact_desc[0]["title"] + "</strong><br /><span>" + fastfact_desc[0]["descrption"] + "</span>";
        });

    var tip_p_1 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + fastfact_desc[1]["title"] + "</strong><br /><span>" + fastfact_desc[1]["descrption"] + "</span>";
        });

    var tip_p_2 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + fastfact_desc[2]["title"] + "</strong><br /><span>" + fastfact_desc[2]["descrption"] + "</span>";
        });

    var tip_p_3 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + fastfact_desc[3]["title"] + "</strong><br /><span>" + fastfact_desc[3]["descrption"] + "</span>";
        });

    var tip_p_4 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + fastfact_desc[4]["title"] + "</strong><br /><span>" + fastfact_desc[4]["descrption"] + "</span>";
        });

    // rather than "population_#" these should be "fastfact_#", however this is
    // currently dependent on naming in the data files and so cannot be
    // changed here
    d3.select("#svg_fastfact").call(tip_p_0);
    d3.select("#population_0")
    .select(".text_title")
    .on('mouseover', tip_p_0.show)
    .on('mouseout', tip_p_0.hide);

    d3.select("#svg_fastfact").call(tip_p_1);
    d3.select("#population_1")
    .select(".text_title")
    .on('mouseover', tip_p_1.show)
    .on('mouseout', tip_p_1.hide);

    d3.select("#svg_fastfact").call(tip_p_2);
    d3.select("#population_2")
    .select(".text_title")
    .on('mouseover', tip_p_2.show)
    .on('mouseout', tip_p_2.hide);

    d3.select("#svg_fastfact").call(tip_p_3);
    d3.select("#population_3")
    .select(".text_title")
    .on('mouseover', tip_p_3.show)
    .on('mouseout', tip_p_3.hide);

    d3.select("#svg_fastfact").call(tip_p_4);
    d3.select("#population_4")
    .select(".text_title")
    .on('mouseover', tip_p_4.show)
    .on('mouseout', tip_p_4.hide);

}
