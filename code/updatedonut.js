function updateDonut(data, year, country) {

  var colors = { 0 : '#b30000', 1 : '#ff6666', 2 : '#cca300'};
  // selects right data
  data = data[year][country];
  svg = d3.select('#donutchart');

  values = Object.values(data);
  animals = Object.keys(data);


  var angles = d3.pie()
    .sort(null)(values);

  // create each segment of piechart
  var segments = d3.arc()
   .innerRadius(100)
   .outerRadius(200)
   .padAngle(.05)
   .padRadius(50);

  var sections = svg.select(".pie").selectAll('path')
    .data(angles)

  var div = d3.select(".tooltip")

  //  give color to eacht section of piechart
  sections.enter()
    .append('path')
    .merge(sections)
    .attr('d', segments)
    .attr('fill', function(d, i) {
      return colors[i]
  })
  .on('mousemove',function(d){

    country = newCountry

    div.transition()
        .duration(200)
        .style('opacity', .9)
    div	.html('country: ' + country + '<br/>' + 'year: '+ dropyear + '<br/>'  + 'consumption: ' + d.value + ' kg')
        .style('left', (d3.event.pageX +20) + 'px')
        .style('top', (d3.event.pageY - 20) + 'px');
   })
   .on('mouseout', function(d) {
     div.transition()
         .duration(500)
         .style('opacity', 0);
   });

    sections.exit().remove()

    sections.transition()
      .duration(500)
      .attr('d', segments)
      .attr('fill', function(d, i) {
        return colors[i]
    })

    svg.select('#country').remove()

    svg.append('text')
      .attr('x', 50)
      .attr('y', 40)
      .attr('id', 'country')
      .attr('fontfamily', 'arial')
      .style('fontsize', '20px')
      .text(country)

}

function dropdown(country){
    if (d3.select('.line').empty()) {
      createLine(datamap, country);
      createPie(datamap, dropyear, country);
    }
    else {
      updateLine(datamap, country);
      updateDonut(datamap, dropyear, country);
    }
  }
