function updateLine(data, country) {

  margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  try {
    svg = d3.select('#linegraph');
    var div = d3.select('body').select(".tooltip")
    svg.select('#land').remove()
    svg.append('text')
      .attr('x', 60)
      .attr('y', 40)
      .attr('id', 'land')
      .attr('fontfamily', 'arial')
      .style('fontsize', '20px')
      .text(country)

    var keys = Object.keys(data).map(Number)
    var values = []

    for (var i = 0; i < Object.values(data).length; i++) {
      countryValues = Object.values(data)[i][country]
      countryValues = Object.values(countryValues).map(Number)
      countryValuesSum = countryValues.reduce(add, 0);
      function add(a, b) {
          return a + b;
      }
      function round(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
      }
      values.push(round(countryValuesSum, 2))
    }
    var dataset = {};
    keys.forEach((key, i) => dataset[key] = values[i]);


    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
      .domain([2003, 2013]) // input
      .range([0, width - margin.right]); // output

    // 6. Y scale will use the randomly generate number
    var yScale = d3.scaleLinear()
      .domain([0, 200]) // input
      .range([height, 0]); // output

    var line = d3.line()
      .x(function(d) { return xScale(d); }) // set the x values for the line generator
      .y(function(d) { return yScale(dataset[d]); }) // set the y values for the line generator


    var newLine = d3.select('.line').datum(Object.keys(dataset));
    newLine.transition()
      .duration(500)
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke', 'black');

    var newDots = d3.selectAll('.dot').data(Object.keys(dataset));

    newDots.transition()
       .duration(500)
       .attr('d', line)
       .attr('cx', function(d, i) { return xScale(d)})
       .attr('cy', function(d) { return yScale(dataset[d]) })
       .attr('r', 5)
       .attr('fill', 'black')

       newDots.on('mouseover', function(d) {
       var reverseScale = d3.scaleLinear()
       .domain([0, width - margin.right]) // input
       .range([2003, 2013]); // output
       var year = reverseScale(d3.select(this).attr('cx'));

       div.transition()
           .duration(200)
           .style('opacity', .9);

       div  .html('year: '+ year + '<br/>'  + 'consumption: ' + dataset[year] + ' kg')
           .style('left', (d3.event.pageX) + 'px')
           .style('top', (d3.event.pageY -50) + 'px');
       })
       .on('mouseout', function(d) {
       div.transition()
           .duration(500)
           .style('opacity', 0);
       })

  }
  catch(err){
   alert('no data available for this country');
  }

}
