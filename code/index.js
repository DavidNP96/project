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
