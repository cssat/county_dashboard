function wa_geo_map_region(g){
            
         var svg = g.append("svg")
                    .attr("id","wa_geo_map_region")
                    .attr("viewBox","0 0 900 700");
          
         var tip = d3.tip()
                  .attr('class', 'd3-tip-county')
                  .offset([-10, 0])
                  .html(function(d) {
                    return "<span>" + d.region_name + "</span>";
                  })
          
          svg.call(tip);
                  
          var region = svg.selectAll("g")
                          .data(regions)
                          .enter().append("g") 
                          .attr("class",function(d){ return d.region_code; })
                          .attr("name",function(d){ return d.region_name; });
             
          region.append("path")
                    .attr("d",function(d){ return d.path; })
                    .attr("class", "wa_geo_map_region")
                    .on("mouseover", function(d) {
                       d3.select(this).transition().duration(300).style("opacity", 1);
                       div.transition().duration(300)
                       .style("opacity", 1)
                       div.text(d.region_name)
                       .style("left", (d3.event.pageX -30) + "px")
                       .style("top", (d3.event.pageY -30) + "px");
                       })
                       .on("mouseout", function() {
                       d3.select(this)
                       .transition().duration(300)
                       .style("opacity", 1);
                       div.transition().duration(300)
                       .style("opacity", 0);
                     });
 
          for(var i=0, r_len=regions.length;i<r_len;i++){
            for(var j=0, p_len=region_path.length;j<p_len;j++){
                if(regions[i]["region_code"]==region_path[j]["region_code"]){
                    d3.select("#wa_geo_map_region")
                      .select("."+regions[i]["region_code"])
                      .append("path")
                        .attr("class", "wa_geo_map_region")
                        .attr("d",region_path[j]["path"]);
                }
            }
          }
     /*   
          var region_text = svg.append("g")
                                .selectAll("text")
                                .data(regions)
                                .enter().append("text")
                                .attr("id",function(d){ return "text_" + d.region_code; })
                                .attr("transform", function(d){ return d.text_transform; })
                                .text(function(d){ return d.region_name; });
        */                          
          d3.select("#wa_geo_map_region").selectAll("path")
              .style("stroke","black")
              .style("fill","none");    
}