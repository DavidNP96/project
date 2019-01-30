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
