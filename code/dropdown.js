// name: David Pantophlet
// student number: 12466638
// This code updates the donutchart and linechart by a dropdown input

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
