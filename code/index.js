window.onload = function() {
    var countries = "https://raw.githubusercontent.com/DavidNP96/project/master/code/countries.json"
    var data = "https://raw.githubusercontent.com/DavidNP96/project/master/data/data.json"
    var requests = [d3.json(countries), d3.json(data)]
    var format = d3.format(",");

  Promise.all(requests).then(function(response) {
    var countries = response[0]
    var data = response[1]
    // Set tooltips

    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                  return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" +"x" +"</span>";
                })

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

    // var color = d3.scaleThreshold()
    //     .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
    //     .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

    var projection = d3.geoMercator()
                       .scale(130)
                      .translate( [width / 2, height / 1.5]);

    var path = d3.geoPath().projection(projection);
    var svg = d3.select("#worldmap")
    map(countries, path, tip)

    year = 2003
    country = "Albania"
    createPie(data, year, country);
    svg.call(tip);
    createLine(data, country)


  }).catch(function(e){
      throw(e);
  });
};
function map(data, path, tip) {
  // var populationById = {};

  // population.forEach(function(d) { populationById[d.name] = +d.population; });
  // data.features.forEach(function(d) { d.population = populationById[d.name] });
  var svg = d3.select("#worldmap");

  svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", "red")
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);
          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          tip.hide(d);
          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        });
  // svg.append("path")
  //     .datum(topojson.mesh(data.features, function(a, b) { return a.name !== b.name; }))
  //     .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
  //     .attr("class", "names")
  //     .attr("d", path);
}

function createPie(data, year, country){

    // determine colors
    svg = d3.selectAll("#donutchart")
    var colors = d3.scaleOrdinal(d3.schemeSet1);

    // selects right data
    data = data[year][country]

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
    var sections = svg.append("g")
                      .attr("class", "pie")
                      .attr("transform", "translate(250, 250)")
                      .selectAll("path").data(angles);

      //  give color to eacht section of piechart
      sections.enter().append("path")
              .attr("d", segments)
              .attr("fill", function(d){
        return colors(d.value);
        });


    var content = svg.select("g")
                    .selectAll("text")
                    .data(angles);
    // write values in eacht section of piechart
    content.enter().append("text")
          .classed("inside", true)
          .each(function(d){
                var center = segments.centroid(d);
                d3.select(this).attr("x",center[0]).attr("y", center[1])
                .text(Math.round(d.value))
            })

    // create legend
    var legends = svg.append("g")
                    .attr("transform", "translate(500, 300)")
                    .selectAll(".legend")
                    .data(angles);

    // create eacht bar of legend
    var legend = legends.enter()
                        .append("g")
                        .classed("legend", true)
                        .attr("transform", function(d, i){return "translate(0," + (i + 1) * 30 + ")";
                        });
    //  give right color to eacht legend
    legend.append("rect")
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", "red");

    // append text to leend
    legend.append("text")
          .classed("label", true)
          // .text(function(d, i){return animals[i]})
          .attr("x", 20)
          .attr("y", 12)

    // create title for piechart
    svg.append("text")
      .attr("x", 250)
      .attr("y", 20)
      .attr("font-family", "arial")
      .style("font-size", "20px")
      .text("meatconsumption of country per animal")
}

function createLine(data, country) {

  var svg = d3.selectAll("#linegraph")
  margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

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
  console.log(dataset);

  // The number of datapoints
  var n = 11;

  // 5. X scale will use the index of our data
  var xScale = d3.scaleLinear()
      .domain([2003, 2013]) // input
      .range([0, width]); // output

  // 6. Y scale will use the randomly generate number
  var yScale = d3.scaleLinear()
      .domain([30, 50]) // input
      .range([height, 0]); // output

  for (var i = 0; i<11; i++) {
    console.log(dataset);
  }

  // 7. d3's line generator
  var line = d3.line()
      .x(function(d) { return xScale(d); }) // set the x values for the line generator
      .y(function(d) { return yScale(dataset[d]); }) // set the y values for the line generator
      // .curve(d3.curveMonotoneX) // apply smoothing to the line

      // 3. Call the x axis in a group tag
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+ margin.left + "," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+ margin.left + ", 0 )")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft
console.log(1);
    // 9. Append the path, bind the data, and call the line generator
    svg.append("path")
        .datum(Object.keys(dataset)) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("transform", "translate("+ margin.left + ", 0 )")
        .attr("d", line) // 11. Calls the line generator
        .style("fill",  "#CCD1CC")
        .style("stroke", "black")
        .style("stroke-width", 1.5)

console.log(2);
    svg.selectAll(".dot")
    .data(Object.keys(dataset))
    .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("transform", "translate("+ margin.left + ", 0 )")
    .attr("cx", function(d) { return xScale(d) })
    .attr("cy", function(d) { return yScale(dataset[d]); })
    .attr("r", 5)
    
}
