function createPie(data, year, country) {

    // determine colors
    svg = d3.selectAll('#donutchart')

    var colors = { 0 : '#b30000', 1 : '#ff6666', 2 : '#cca300'};

    // selects right data
    data = data[year][country];

    // define tooltip
    var div = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

try{
    // transform data suitable for piechart
    values = []
    values = Object.values(data)
    animals = Object.keys(data)
    var angles = d3.pie().sort(null)(values);


    // create each segment of piechart
    var segments = d3.arc()
                     .innerRadius(100)
                     .outerRadius(200)
                     .padAngle(.05)
                     .padRadius(50);

    //  deteremine section for eacht part element
    var sections = svg.append('g')
                      .attr('class', 'pie')
                      .attr('transform', 'translate(250, 250)')
                      .selectAll('path').data(angles);


      //  give color to eacht section of piechart
      sections.enter()
        .append('path')
        .attr('d', segments)
        .attr('fill', function(d,i){
          return colors[i];
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


    // create legend
    var legends = svg.append('g')
      .attr('transform', 'translate(500, 300)')
      .selectAll('.legend')
      .data(angles);

    // create eacht bar of legend
    var legend = legends.enter()
      .append('g')
      .classed('legend', true)
      .attr('transform', function(d, i){return 'translate(0,' + (i + 1) * 30 + ')';
      });

    //  give right color to eacht legend
    legend.append('rect')
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', function(d,i){
        return colors[i];
    })

    var legendText = ['Beef', 'Pig', 'Poultry'];

    // append text to legend
    legend.append('text')
      .classed('label', true)
      .text(function(d, i){return legendText[i]})
      .attr('x', 20)
      .attr('y', 12)

    // create title for piechart
    svg.append('text')
      .attr('x', 50)
      .attr('y', 20)
      .attr('font-family', 'arial')
      .style('font-size', '20px')
      .text('meatconsumption of country per animal (kg/capita)')

    svg.append('text')
      .attr('x', 50)
      .attr('y', 40)
      .attr('id', 'country')
      .attr('fontfamily', 'arial')
      .style('fontsize', '20px')
      .text(country)
}
catch(err){
 {};
}
}
