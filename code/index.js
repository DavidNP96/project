// name: David Pantophlet
// student number: 12466638
// This is where all my code starts running when loaded

// create global global variable
var datamaps
var dropyear
var newCountry

window.onload = function() {

    // load in two datasets one for to create the world map and one dataset of meatconsumption
    var countries = 'https://raw.githubusercontent.com/DavidNP96/project/master/code/countries.json'
    var data = 'https://raw.githubusercontent.com/DavidNP96/project/master/data/data.json'
    var requests = [d3.json(countries), d3.json(data)]
    var format = d3.format(',');

  Promise.all(requests).then(function(response) {

    var countries = response[0]
    var data = response[1]
    datamap = data

    // create margins
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

    // create projections for dworldmap
    var projection = d3.geoMercator()
      .scale(130)
      .translate( [width / 2, height / 1.5]);

    // create path varibale for worldmap
    var path = d3.geoPath().projection(projection);


     // initialize year to create worldmap
     var year = 2003
     dropyear = year

     // create worldmaps
     map(countries, data, year, path);


     // create slider over time
      var dataTime = d3.range(0, 11).map(function(d) {
        return new Date(2003 + d, 10, 3);
      });

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
