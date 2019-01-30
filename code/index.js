var datamaps
var dropyear
var newCountry
window.onload = function() {
    var countries = 'https://raw.githubusercontent.com/DavidNP96/project/master/code/countries.json'
    var data = 'https://raw.githubusercontent.com/DavidNP96/project/master/data/data.json'
    var requests = [d3.json(countries), d3.json(data)]
    var format = d3.format(',');

  Promise.all(requests).then(function(response) {
    var countries = response[0]
    var data = response[1]
    datamap = data

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

    var projection = d3.geoMercator()
      .scale(130)
      .translate( [width / 2, height / 1.5]);

    var path = d3.geoPath().projection(projection);


    // Time
     var dataTime = d3.range(0, 11).map(function(d) {
       return new Date(2003 + d, 10, 3);
     });

     var year = 2003

     dropyear = year

     map(countries, data, year, path);

     var sliderTime = d3
       .sliderBottom()
       .min(d3.min(dataTime))
       .max(d3.max(dataTime))
       .step(1000 * 60 * 60 * 24 * 365)
       .width(300)
       .tickFormat(d3.timeFormat('%Y'))
       .tickValues(dataTime)
       .default(new Date(2003, 10, 3))
       .on('onchange', val => {

         d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
         year = d3.timeFormat('%Y')(sliderTime.value());
         dropyear = year;
         try{
           map(countries, data, year, path);
           updateDonut(data, year, country);
         }
         catch (err) {
           {};
         };
       });

     var gTime = d3
       .select('div#slider-time')
       .append('svg')
       .attr('width', 500)
       .attr('height', 100)
       .append('g')
       .attr('transform', 'translate(30, 30)');

     gTime.call(sliderTime);



  }).catch(function(e){
      throw(e);
  });
};

function map(countries, data, year, path) {

var colorDomain = [0, 5, 10, 25, 50, 100, 150];
var colorRange = ['ffffff', '#ff6666', '#ff3333', '#ff0000', '#b30000', '#800000', '#4d0000'];

var color = d3.scaleThreshold()
  .domain(colorDomain)
  .range(colorRange);

data1 = data[year]

var keys = Object.keys(data1)

var values = []

for (var i = 0; i < Object.values(data1).length; i++) {

  countryValues = Object.values(data1);

  countryValues = Object.values(countryValues[i]).map(Number)

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

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    // .offset([100, 100])
    .html(function(d) {
      if (dataset[d.properties.name] === undefined) {
        dataset[d.properties.name] = 'no data'
      }
      return "<strong>Country: </strong><span class='details'>" + d.properties.name + '<br></span>' + "<strong>Meat consumption: </strong><span class='details'>" + dataset[d.properties.name]+'</span>';
    })

  var svg = d3.select('#worldmap');

  var counter = 0;

  svg.append('g')
    .attr('class', 'countries')
    .attr('transform', 'translate(50, 0)')
    .selectAll('path')
    .data(countries.features)
    .enter().append('path')
    .attr('d', path)
    .style('fill', function(d) { return color(dataset[d.properties.name]); })
    .style('stroke', 'white')
    .style('stroke-width', 1.5)
    .style('opacity', 0.8)
    .style('stroke','white')
    .style('stroke-width', 0.3)

    .on('mouseover',function(d) {
      tip.show(d);
      d3.select(this)
        .style('opacity', 1)
        .style('stroke', 'white')
        .style('stroke-width', 3);
    })
    .on('mouseout', function(d) {
      tip.hide(d);
      d3.select(this)
        .style('opacity', 0.8)
        .style('stroke','white')
        .style('stroke-width', 0.3);
      })
      .on('click', function(d) {
        country = d.properties.name;
        newCountry = country
        if ( dataset[d.properties.name] === 'no data') {
          {};
        }

        else if (d3.select('.line').empty()) {

          window.scrollTo(0, 1500);
          createLine(data, country);
          createPie(data, year, country);

        }
        else {
          window.scrollTo(0, 1500);
          updateLine(data, country);
          updateDonut(data, year, country);
        }
      });

  svg.call(tip);

  if (svg.select("#legend").empty()) {

  }

  var legends = svg.append('g')
    .attr("id", "legend")
    .attr('transform', 'translate(0, 30)')
    .selectAll('.legend')
    .data(colorDomain);

  // create eacht bar of legend
  var legend = legends.enter()
    .append('g')
    .classed('legend', true)
    .attr('transform', function(d, i){return 'translate(0, ' + (i + 1) * 30 + ')';
    });

  //  give right color to eacht legend
  legend.append('rect')
    .attr('width', 20)
    .attr('height', 20)
    .style('fill', function(d, i) {
        return colorRange[7 - i];
      })

  var legendText = ['No data', '100-150 kg', '50-100 kg', '25-50 kg', '10-25 kg', '5-10 kg' , '<5 kg'];

  // append text to leend
  legend.append('text')
    .classed('label', true)
    .text(function(d, i){return legendText[i]})
    .attr('x', 20)
    .attr('y', 12)

}

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

function createLine(data, country) {

  var svg = d3.selectAll('#linegraph')

  margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  try{

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

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([2003, 2013]) // input
        .range([0, width - margin.right]); // output

    // 6. Y scale will use the randomly generate number
    var yScale = d3.scaleLinear()
        .domain([0, 200]) // input
        .range([height, 0]); // output


      // 7. d3's line generator
      var line = d3.line()
        .x(function(d) { return xScale(d); }) // set the x values for the line generator
        .y(function(d) { return yScale(dataset[d]);}) // set the y values for the line generator

        // 3. Call the x axis in a group tag
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate('+ margin.left + ',' + (height + margin.top)  + ')')
        .call(d3.axisBottom(xScale).tickFormat(d3.format(''))); // Create an axis component with d3.axisBottom

      // 4. Call the y axis in a group tag
      svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')')
        .call(d3.axisLeft(yScale)) // Create an axis component with d3.axisLeft
        .append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .attr('fill', '#5D6971')
        .text('Meatconsumption (kg/capita)');

      // 9. Append the path, bind the data, and call the line generator
      svg.append('path')
        .datum(Object.keys(dataset)) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')')
        .attr('d', line) // 11. Calls the line generator
        .style('fill',  'none')
        .style('stroke', 'black')
        .style('stroke-width', 1.5)

          // Define the div for the tooltip
      var div = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);


      svg.selectAll('.dot')
        .data(Object.keys(dataset))
        .enter().append('circle') // Uses the enter().append() method
        .attr('class', 'dot') // Assign a class for styling
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
