/**
 *  MAP
 *
 *  Appends an SVG mp of Washington to the page and binds
 *  data to paath fills.
 */

var Events = require('./Events.js');

var Map = (function() {
   // base colors for the map, map scale, and radio button outlines - these get 
   // manipulated with d3 functions to produce the full gradient needed for
   // the map scale
   var color_main = "#3B6E8F";
   var color_highlight = "#A3DCE6";

   // Initialize event listeners
   function init(defaultContext, colors) {
      appendMap(defaultContext, colors);

      Events.subscribe('Switch contexts', function(obj) {
         var context = obj.context;
         console.log(context);
         document.getElementById('map-container').innerHTML = '';
         appendMap(context, colors);
      });
   }

   function switchContext() {

   }

   function appendMap(context, colors) {
     // mapID and mapHeight are used in the same way regardless of context
     var mapID = 'wa_' + context + '_map';
     var mapHeight = 500;

      // Settings for region or county SVG
     var settings = getContextSettings(context);

      // First check to make sure that the map does not already exist. Each map context
      // has a different ID; if it already exists, we don't need to append the map again.
        var svg = d3.select("#map-container").append("svg")
                .attr("id", mapID)
                .attr("class", "map")
                .attr("viewBox", settings.viewBox)
                .attr("width", settings.mapWidth)
                .attr("height", mapHeight);
        
        // Loops over the data in the regions array and attaches name, id, and class to a <g> element
        var map = svg.selectAll("g")
                          .data(settings.geography)
                          .enter().append("g") 
                          .attr("class", context)
                          .attr("id", function(d){ return d.id; });

        // Appends path and "d" attribute to each item from the data
        map.append("path")
                  .attr("d",function(d){ return d.path; })
                  .attr("id", function(d){ return d.geog; })
                  .attr("name", function(d){ return d.name; })
                  .attr("transform", settings.transform)
                  .attr("class", "wa_geo_map")
                  .style("stroke","#fff")
                  .style("stroke-width", settings.strokeWidth);

      // Loops over data array and checks it against the county/region_path array. If the ID matches the name of a county/region in county/region_path, an additional path is appended to the <g> element. This catches all of the islands that cannot be captured with a single path.
        for(var i=0, c_len=settings.geography.length;i<c_len;i++){
          for(var j=0, p_len=settings.extraPaths.length;j<p_len;j++){
              if(settings.geography[i]["id"]==settings.extraPaths[j][context]){
                  d3.select("#"+settings.geography[i]["id"]).append("path")
                      .attr("d",settings.extraPaths[j]["path"])
                       .attr("class", "wa_geo_map")
                      .style("stroke","#fff")
                      .style("stroke-width", settings.strokeWidth);  
              }
          }
        }
   }

   function updateFill() {

   }

   function bindEvents() {

   }

   function getContextSettings(context) {
       var svgSettings;

       switch(context) {
         case "state":
           svgSettings = {
             viewBox: "50 50 860 500",
             geography: regions,
             extraPaths: region_path,
             transform: "translate(0, -50)",
             strokeWidth: "0",
             mapWidth: 615
           };
           break;
         case "region":
           svgSettings = {
             viewBox: "50 50 860 500",
             geography: regions,
             extraPaths: region_path,
             transform: "translate(0, -50)",
             strokeWidth: "2",
             mapWidth: 615
           };
           break;
         case "county":
           svgSettings = {
             viewBox: "-32550,-19037 59361,38626",
             geography: counties,
             extraPaths: county_path,
             transform: "translate(0, 0)",
             strokeWidth: "100",
             mapWidth: 580
           };
           break;
       }

       return svgSettings;
   }

   return {
      init: init
   }
})();

module.exports = Map;