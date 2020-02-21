
// set the dimensions and margins of the graph
// Barchart part

function barchart(columnname){

    d3.select("#cleansheet").remove();
    d3.select("#cleansheet1").remove();

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.1);
    var y = d3.scaleLinear()
              .range([height, 0]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#Content").append("svg")
        .attr("id","cleansheet1")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // get the data
    d3.csv(filename, function(error, data) {
      if (error) throw error;

      // format the data
      data.forEach(function(d) {
        d.sales = +d.sales;
      });
      //console.log(data);

      var dict = d3.nest()
      .key(function(d) { return d[columnname]; })
      .rollup(function(v) { return v.length; })
      .entries(data);

        // Scale the range of the data in the domains
      x.domain(dict.map(function(d) { return d.key; }));
      y.domain([0, d3.max(dict, function(d) { return d.value; })]);

      var bar = svg.selectAll(".bar").data(dict)
          .enter()
          .append("rect")
          .attr("class","bar")
          .attr("x", function(d) { return x(d.key); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); })

      // add the x Axis

      if (columnname == "religion"){
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "rotate(10)")
            .style("text-anchor", "start");
      }
      else{
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
      }
      svg.append("text")             
            .attr("transform",
                  "translate(" + (width/2) + " ," + 
                                 (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text(columnname);

      // add the y Axis
      svg.append("g")
          .call(d3.axisLeft(y));

      svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left - 1)
          .attr("x",0 - (height / 2-10))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Frequency");
      

      d3.selectAll("rect")
      .on("mouseover", function(d) {
          d3.select(this)
          .attr("x", function() { return x(d.key) - 5; })
          .attr("width", x.bandwidth()+10)
          .attr("y", function() { return y(d.value)-10; })
          .attr("height", function() { return height - y(d.value)+10;})
          .style("fill", "orange") 
          

          d3.select(this.parentNode)
            .append("text")
            .attr("id","hovertext")
            .text(function() {return d.value;})
            .attr("text-anchor", "middle")
            .attr("x", function() { return x(d.key)+ x.bandwidth()/2; })
            .attr("width", x.bandwidth()+10)
            .attr("y", function() { return y(d.value)-10; })
            .attr("height", function() { return height - y(d.value)+10;})
            .style("fill", "black");

        })
      
      .on("mouseout",function(d){
          d3.select(this)
          .attr("x", function() { return x(d.key); })
          .attr("width", x.bandwidth())
          .attr("y", function() { return y(d.value); })
          .attr("height", function() { return height - y(d.value);})
          .style("fill", "steelblue")
          d3.select("#hovertext").remove()
        });
      
      } ); 
}

/*   Histogram part   */
function histogram(columnname,numBins){

    console.log(columnname)
    console.log(numBins)
    d3.select("#cleansheet").remove();
    d3.select("#cleansheet1").remove();

      
    d3.csv(filename, function (data) {
        map = data.map(function(d,i){ return parseFloat(d[columnname]); })
        var formatCount = d3.format(",.0f");
        //console.log(formatCount)


      var margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 1000 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

      var svg = d3.select("#Content").append("svg")
          .attr("id","cleansheet")
          .attr("width", width+ margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)

      g = svg.append("g")
      g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleLinear()
          .range([0, width])
          .domain([d3.min(map),d3.max(map)]);

      var bins = d3.histogram()
          .domain(x.domain())
          .thresholds(x.ticks(numBins))(map);


      var y = d3.scaleLinear()
          .domain([0, d3.max(bins, function(d) { return d.length; })])
          .range([height, 0]);

      var bar = g.selectAll(".bar")
        .data(bins)
        .enter().append("g")
          .attr("class", "bar")
          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });


      bar.append("rect")
          .attr("width", x(bins[0].x1) - x(bins[0].x0)-2)
          .attr("height", function(d) { return height - y(d.length); });

      g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")    
            .attr("dx", "6px")
            .attr("dy", "-5px")
              .attr("transform", "rotate(90)")
              .style("text-anchor", "start");
  
      g.append("text")             
              .attr("transform",
                    "translate(" + (width/2) + " ," + 
                                   (height + margin.top + 20) + ")")
              .style("text-anchor", "middle")
              .text(columnname);

      g.append("g")
          .call(d3.axisLeft(y));
              
      g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left - 1)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Frequency");

      d3.selectAll("rect")
        .on("mouseover", function(d) {
            // on mouse-over make the bin wider and higher to focus on it
            d3.select(this)
            .attr("y", -10)
            //.attr("width", x(bins[0].x1) - x(bins[0].x0) - 1+10)
            .attr("height", function() { return height - y(d.length)+10; })
            .style("fill", "orange") 

            //console.log(d3.event.y);

            d3.select(this.parentNode)
              .append("text")
              .attr("id","hovertext")
              .text(function() { return formatCount(d.length); })
              .attr("text-anchor", "middle")
              .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
              .attr("y", -10)
              .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
              .attr("height", function() { return height - y(d.length)+10; })
              .style("fill", "black");
            
          })
          
      
        .on("mouseout",function(d){
            d3.select(this)
            .attr("y", 0)
            .attr("height", function() { return height - y(d.length); })
            .style("fill", "steelblue") 
            d3.select("#hovertext").remove()
          
            //console.log(d3.event.y);
          });

      //Click and drag to change the number of bins   
      var currX, currY;
      var newX, newY;

      function started(){
        currX = d3.event.x
        currY = d3.event.y
      }

      function ended(){
        newX = d3.event.x
        newY = d3.event.y
        if (ty == "numeric"){
          if (currX > newX) {histogram(columnname,numBins-5);}
          if (currX < newX) {histogram(columnname,numBins+5);}
        }
      }

      d3.selectAll("body").call(d3.drag()
        .on("start", started)
        .on("end",ended))
    });

}


function mainhandler(columnname){
      console.log(columnname);
     
      d3.csv(filename, function (data) {     
        var variables = data.columns;
        variables.forEach(function(d) {
              if (d == columnname){
                  ty = (isNaN(data[0][d]) ? "categorical" : "numeric");
              }        
        })
        console.log(ty)
        if (ty == "categorical"){
          barchart(columnname);
        }
        else{
          numBins = 13;
          histogram(columnname,numBins);
        }
      })
 
}

var columnname = "_golden";
var filename = "Oscars-demographics-DFE.csv";
var ty;
mainhandler(columnname,filename);
var allcolumns = ["_golden","_unit_state","_trusted_judgments","birthplace:confidence","year_of_birth",
"year_of_birth:confidence","race_ethnicity","race_ethnicity:confidence","religion","religion:confidence","sexual_orientation",
"sexual_orientation:confidence","year_of_award","year_of_award:confidence","award"]

d3.select("#selectButton")
  .selectAll('myOptions')
  .data(allcolumns)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; })
  .style("fill","red")

// When the button is changed, run the updateChart function
d3.select("#selectButton").on("change", function(d) {
// recover the option that has been chosen
    columnname = d3.select(this).property("value")
    mainhandler(columnname);
    //console.log(columnname)
})