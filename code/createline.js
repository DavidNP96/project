// name: David Pantophlet
// student number: 12466638
// This code creates a interactive linechart

function createLine(data, country) {

  // Select right svg
  var svg = d3.selectAll('#linegraph')

  // Create margins
  margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  try{

    //  Reformat data output dataset
    var keys = Object.keys(data).map(Number)
    var values = []
    for (var i = 0; i < Object.values(data).length; i++) {
      if ( typeof Object.values(data)[i][country] === 'undefined'){
        {};
      }

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

    // The number of datapoints
    var n = 11;

    // Create x scale
    var xScale = d3.scaleLinear()
        .domain([2003, 2013]) // input
        .range([0, width - margin.right]); // output

    // Create y scale
    var yScale = d3.scaleLinear()
        .domain([0, 200]) // input
        .range([height, 0]); // output


      // Set x and y values for line generator
      var line = d3.line()
        .x(function(d) { return xScale(d); })
        .y(function(d) { return yScale(dataset[d]);})

      // Call the x axis in a group tag
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate('+ margin.left + ',' + (height + margin.top)  + ')')
        .call(d3.axisBottom(xScale).tickFormat(d3.format(''))); // Create an axis component with d3.axisBottom

      // Call the y axis in a group tag
      svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .attr('fill', '#5D6971')
        .text('Meatconsumption (kg/capita)');

      // Append the path, bind the data, and call the line generator
      svg.append('path')
        .datum(Object.keys(dataset))
        .attr('class', 'line')
        .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')')
        .attr('d', line)
        .style('fill',  'none')
        .style('stroke', 'black')
        .style('stroke-width', 1.5)

      // define the div for the tooltip
      var div = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);


      // Create dot with tooltip
      svg.selectAll('.dot')
        .data(Object.keys(dataset))
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')')
        .attr('cx', function(d) { return xScale(d) })
        .attr('cy', function(d) { return yScale(dataset[d]); })
        .attr('r', 5)

        .on('mouseover', function(d) {
        var reverseScale = d3.scaleLinear()
        .domain([0, width - margin.right]) // input
        .range([2003, 2013]); // output
        var year = reverseScale(d3.select(this).attr('cx'));

        div.transition()
            .duration(200)
            .style('opacity', .9);

        div	.html('year: '+ year + '<br/>'  + 'consumption: ' + dataset[year] + ' kg')
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY -50) + 'px');
        })
        .on('mouseout', function(d) {
        div.transition()
            .duration(500)
            .style('opacity', 0);
        })

      // create title for piechart
      svg.append('text')
        .attr('x', 60)
        .attr('y', 20)
        .attr('font-family', 'arial')
        .style('font-size', '20px')
        .text('meatconsumption of country per year kg/capita');

      svg.append('text')
        .attr('x', 60)
        .attr('y', 40)
        .attr('id', 'land')
        .attr('fontfamily', 'arial')
        .style('fontsize', '20px')
        .text(country)
  }
  catch(err){
   alert('no data available for this country');
  }
}
