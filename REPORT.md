# Final Report

## Student
Name: David Pantophlet
student Number: 12466638

## Short description

The website contains a home page, linked visualisations, and a information page.
Its purpose is to show how much meat is consumed by globally and thereby to create
consiousness about our meat consumption.
to get a feel of how the site looks there's an image of the visualizations below.

#### data
The data for the worlmap I load in directly from the url. The dataset I used for the values of meatconsumption I first convert form a csv file to a json file with datatojson.py. I do this in python because, especially starting this project I was most comfortable in python.s


## components
My site consist of three tabs, each showing a page of my site. When loading my page you'll arrive at my home page, with a quick intro to the topic.
the visualisation page show a data visualisation on which I will go in depth later on. The last tab is story about the importance of the topic.

### visualisations
I have a dynamic world map which shows the meat consumption per year per country. The darker the color red the more meat(kg) is consumed per capita. Users are able to click on a country which will then redirect them to a linegraph and a donutchart, which respectively shows the trend of meatconsumption of that specific country, and how much of which animals is being eaten. Furthermore I've got a dropdown that enables the user to select countries by theis name, and there is a slider which changes the year of the worldmap and the piechart.


#### code


#### index.html
In my index.html I load in all the functionality and the content, I create the three tabs and its content.
I also create a dropdown with its content.

##### index.js

In my index.js function I first load in the two datasets, then I call map.js to create the first worldmap and the slider.
from this point there is a fully functional website with a worlmap a dropdown and a slider.

#### map.js

In map.js I create the worldmap and its legend. I've loaded in a tooltip do the user can see the content of the country hovered on.
furthermore I used a 'click on' which calls createline.js and donut.js, so when clicked on a country you'll be redirected to the bottom of the page where the linegraph and donutchart are created.

#### dropdown.js

To create a more selective way to select a country I also implemented a dropdown. the dropdown component is created in the index.html, when clicked on a country the value is cought in dropdown.js and passed on to the createline() and the createpie() function.


#### createline.js

In createline.js obviously you'll find the createline() function to create a linechart. Though I also create a scatter of the data points, so its clear where the data can be found. To make the actual data accesable there is a tooltip that shows the data of the year hovered over. Furhtermore within this function the text above and the name of the first country you selected is created.
So basically createline fills the allready existing svg with the first content, to update the line graph I made the seperate function update.js.

#### updateline.js

In update line I update the linegraph with new data. I do this by means of a transition rather than deleting the svg and creating a new one.
because of this you see a smooth transition from the old to the new linegraph. Only the necessary changes are made recreated so that includes the line the scatter and the name of the selected country.

#### donut.js

Also donut.js is called when a country is selected. In donut.js there is a function createpie to create the donutchart. In the donutchart you'll see how much kg of a specific animal is eaten per year per county per person. Only the initial donut is created with tooltip and the selected country. The tooltip is created here with a 'hover over' to see the content for that animal. Also the title country name and legend is created here. To update the donut when another country is selected i've created update donut.js.

#### updatedonut.js

In update donut I again use a transition rather than throwing away the whole svg, but to make the transition work bugfree I used merge(), which resulted in the a static transition. Again only the necessary components are getting an update, which include the piechart pieces the tooltip and the selected country name shown underneath the title.

## schets
![schets](https://user-images.githubusercontent.com/44022245/50835750-d5b4f700-1357-11e9-8a50-e26aa1988447.png)

## plugins
d3 tooltip

## challenges

The first big challenge I walked into was to actually get a visual of the worldmap. I found some pretty useful code on blocks but which needed to be interpeted first, so by copy pasting the code I wouldn't get anywhere. So it took me some time to actually understand which features of the code I needed and which I could leave behind. Once I finally got my worldmap the tooltip came pretty easy because it was part of the given code and worked quite fine. By this time I figured out that my data wasn't really what i thought it to be, the values where kg per capita instead of the total meatconsumption per country in tonnes. Eventhough I thought the big numbers where really cool because they might shock you, I quickly desided that these values where even better, because it targets individuals better because the number tell you moree and are better comprehesable.

Once I was done with the Worldmap I unexpectedly stuggled with the linechart, I never made a line chart in d3 before so I needed to find the right examples to find out how to actually do this efficient with d3. Once the line chart came around I made my donutchart which was fairly easy because I made a piechart before. This is why my function name is createPie() and not createDonut() I was meaning to change the name but first wanted to make the functionality than care about the looks. In retrospect, this is not the way to go about this, because once functionality is there caring for function names is not something I want to spend time one anymore.

The next stepping stone where the update functions for the linechart and donutchart, Uptill this point I only made updates by deleting the whole svg. It took me two day to figure this out. I tried multiple examples but none did the job. For the biggest problem was that I tried to work with an example that used an older version of d3, this was unworkable for me at this point and costed me a lot of time. But, eventually by sticking to one example which used d3 v5 I finally found out how to update my linechart smoothly.

Also, the updateDonut() function was struggle, because some elements are deleted because some countries do not eat certain type of meat. With this I got assistence and made the donutchart updatable but eventually I ran in some bugs with the deleted elements needed to come back. So I used the merge() function to get rid of this problem, but the donut did not update smoothly anymore.

In retrosopect I can conlude that the biggest challenge for me was to take the time ro read and understand code and documentation. If I did this I might would've been quicker to search for a different example for my line chart and got my update functions done with more ease and better results. because I wanted to go to quick in the beginning I needed to fix a lot of things later on which was time I could've spend on the looks of my site and my code. Nevertheless I learned a lot not only in programming but also personally and within this project, My endresult is decend and I'm curious to what I could make if I would make a site right now.

## Decisions

In comparison to my earliest ideas for my site I stayed on track. I made no drastic alternating decisions considering my visualisation or my initial plan. I simply made what I said I was going to make. Because my initial idea only includes my design for my visualisation I can't really compare earlier ideas for the other interfaces. THe slight addition I made was that my initial idea included a slider or a dropdown for the years. I chose the slider to navigate through the years and added a dropdown menue for countries. The slider is usefull for the years because it makes the page more dynamic. The dropdown makes for an easier selection of countries If people don't know where asepcific country is located exactly. I'm happy with the visualisations and that it works but in an ideal world I would have done some things different. At this moment my website works with tabs and not with a navbar. In the beginning this looked really good, but in retrospect I'd rather have worked with a navbar, because this enables you to render whole new html pages with which you can switch up your design. The tabs make my website quite static. Also I started writing all my code in one file eventhough in python I didn't do this, because working with the new language I wanted to play it safe. But in the end I had one ver messy code which I didn't find the time for to clean up. So I had to do this all, very quickly, in the end. This is something I won't be doing anymore in future work. Finally I would have liked to use more years so you could really see how the consumption has changed over the years but for a first timer I'm very gratefull for the thing I have learned building this site which includes getting more comfortable with javascript working with bootstrap and knowing where to find designs and functions you want to implement.
