
a list of data sources if you will get data from an external source, including information on how your are going to filter and transform the data for your project

## datasets

The datasets I'll use can be found here project/data.



a diagram with an overview of the technical components of your app (visualizations, scraper etc etc)

## components

I'll have a  dynamic world heat map which shows meat consumption per year per country. The darker the color the more meat is consumed.
Users will be able to click on a country wich will then redirect them to a linegraph which wil show the trend of meatconsumption of that specific country. Also you'll be redirected to a pie chart that shows you whcich animals are being eaten

## worldmap
dataset.csv -> pandas dataset -> json
topojson -> put data in
tooltip to click on country
dropdown or slider to scroll through years and render new worldmap

## linechart
by clicking on counntry the value country will be returned with which is linked to data in the json file. with this i'll be able to render a linechart which shows the trend in animal consumption.

## piechart 

with the same return value i'll render a pichart which will show the specified animals that are being eaten by percentage.

## schets
![schets](https://user-images.githubusercontent.com/44022245/50835750-d5b4f700-1357-11e9-8a50-e26aa1988447.png)

## plugins
d3 tooltip

