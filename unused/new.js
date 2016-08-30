// Define dimensions of the plot
var margin = {top: 120, right: 60, bottom: 60, left: 180};
var height = 500;
var width = 960;

// Define the transition duration
var transDur = 500;

// Set up a global variable for the names of the stats reported here
// (in hopes of making it easier to keep line colors consistent
var reportStats = [];

var stats;

// Load in the CRD quarterly stats table
d3.csv("qtr_stats.csv", function(crd) {

    // Format the variables as neeeded
    crd.forEach(function(d) {
        d.stat_year = +d.stat_year;
        d.stat_qtr = +d.stat_qtr;
        d.datestring = d.stat_year + " Q" + d.stat_qtr;
        d.qtr_result = +d.qtr_result;
    });

    // Subset to two sets of stats:
    // 1. Active Cases Reported for all metro residents and, separately,
    // just Denver residents.
    // 2. Active and latent tx starts and visits, for everyone
    var other_stats = ["Active Therapy Starts", "LTBI Therapy Starts",
                       "Visits"];

    var qtrly = crd.filter(function(d) {
        return (d.stat_name == "Active Cases Reported" &&
                d.pt_group == "County of Residence: Denver") ||

               ((other_stats.indexOf(d.stat_name) > -1) &&
                d.pt_group == "All Patients")

            ; });


    // Assign the data outside of the function for later use
    stats = qtrly;


    // Load the initial stats table
    makeMultiTable(stats);


    // Make a vector for all of the stats, so that plot attributes can be
    // kept consistent - probably a better way to do this.
    d3.selectAll("tbody tr")
        .each(function(d) { reportStats.push(d.key); });


    // Setup the line plot
    setupPlot(height, width, margin);


});


// This function builds a line plot on the g.#lineplot built by setupPlot.js
// It creates a line for each row selected in the associated MultiTable.

var drawLinePlot = function(stats, height, width, margin,
                            transDur, reportStats) {

    // Make a list of the selected statistics
    var statsToPlot = [];

    d3.selectAll("tr[chosen='true']")
        .each(function(d) { statsToPlot.push(d.key); });

    // If the function is run without any stats chosen, remove any
    // existing lines and their g elements
    if(statsToPlot.length < 1) {
        d3.selectAll("path.line")
            .transition().duration(transDur)
                .style("opacity", 1e-6)
                .remove();

        d3.selectAll("g.line").transition().duration(transDur).remove();

        return;
    };

    // Subset to the chosen data
    var plotdata = stats.filter(function(d) {
        return (statsToPlot.indexOf(d.stat_name) > -1)
    });


    // Nest each statistic's data in its own object
    var nested = d3.nest()
        .key(function(d) { return d.stat_name; })
        .entries(plotdata);



    // Set up the x-scale
    var xScale = d3.scale.linear()
        .domain([0,
                d3.nest()
                    .key(function(d) { return d.datestring; })
                    .entries(plotdata)
                    .length])
        .range([0, width - margin.left - margin.right])


    // Set up the y-scale
    var yScale = d3.scale.linear()
        .domain([0, d3.max(plotdata, function(d) { return d.qtr_result; })])
        .range([height - margin.top - margin.bottom, 0])


    // Set up the x-axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickPadding(8);

    // Set up the y-axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        .tickPadding(8);


    // Set up a scale function for coloring the paths
    var colorScale = d3.scale.category10();

    var colorStat = {};

    for(i = 0; i < reportStats.length; i++) {
        colorStat[reportStats[i]] = colorScale(i);
    }



    // Create a line generator
    var generateLine = d3.svg.line()
        .interpolate("step-after")
        .x(function(d, i) { return xScale(i); })
        .y(function(d) { return yScale(d.qtr_result); })

    // Create a second line generator for transitioning lines -
    // this gives them a starting and ending place on the axis
    var generateNullLine = d3.svg.line()
        .interpolate("step-after")
        .x(function(d, i) { return xScale(i); })
        .y(function() { return yScale(0); })


    // Find the g.#lineplot element - build the plot on this
    var lineplot = d3.select("#lineplot");

    // Set up a transition function to keep things DRY
    var transit = lineplot.transition().duration(transDur);

    // Each statistic should have a group for its plot elements
    // function(d)... lets d3 key the groups based on which statistic
    // they contain, so that the correct statistics and entered and exited
    // (as opposed to unkeyed joins, which only use the data's array index
    var lineGroups = lineplot.selectAll("g.line")
        .data(nested, function(d) { return d.key; });


    // Add the paths
    lineGroups.enter()
        .append("g")
            .attr("class", "line")
          .append("svg:path")
              .style("opacity", 1e-6)
              .attr("class", "line")
              .attr("d", function(d) { return generateNullLine(d.values); })
              .style("stroke", function(d) { return colorStat[d.key]; })
          .transition().duration(transDur)
              .style("opacity", 1)
              .attr("d", function(d) { return generateLine(d.values); })

//              .style("stroke", function(d) { return colorStat[d.key]; })


    // Transition deselected paths out
    lineGroups.exit().selectAll("path")
        .transition().duration(transDur)
            .attr("d", function(d) { return generateNullLine(d.values); })
        .remove();

    // Remove deselected g elements, too
    lineGroups.exit().transition().duration(transDur).remove();


    // Transition the remaining paths
    transit.selectAll("path.line")
        .attr("d", function(d) { return generateLine(d.values); });


    // Add or transition the x-axis
    if(!xAxisGroup) {
        xAxisGroup = lineplot.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + yScale.range()[0] + ")")
            .call(xAxis)
    }
    else {
        transit.select("g.x.axis").call(xAxis)
    }



    // Add or transition the y-axis
    if(!yAxisGroup) {
        yAxisGroup = lineplot.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + xScale.range()[1] + ", 0)")
            .call(yAxis)
    }
    else {
        transit.select("g.y.axis").call(yAxis)
    }



};

// This function creates a table with a row for each statistic in a flat data
// object and a column for each time period in the data object.

var makeMultiTable = function(stats) {

    // Set up the column names
    // One set for the year supercolumns
    var yrCols = d3.nest()
        .key(function(d) { return d.stat_year; })
        .rollup(function(d) { return d.length; })
        .entries(stats.filter(function(d) { return d.stat_name == "Visits"; }));


    // And one for the quarter columns
    var qtrCols = d3.keys(
        d3.nest()
            .key(function(d) { return d.datestring; })
            .map(stats)
    );

    // Add an empty column for the statistic name
    yrCols.unshift("");
    qtrCols.unshift("");




    // Nest data within each statistic
    var aggstats = d3.nest()
        .key(function(d) { return d.stat_name; })
        .entries(stats)

    // Create the table
    var table = d3.select("#table").append("table");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    // Append the year headers
    thead.append("tr")
        .selectAll("th")
        .data(yrCols)
      .enter()
        .append("th")
            .text(function(d) { return d.key; })
            .attr("colspan", function(d) { return d.values; })

    // Append the quarter headers
    thead.append("tr")
        .selectAll("th")
        .data(qtrCols)
      .enter()
        .append("th")
            .text(function(column) { return column.substr(4, 6); })


    // Bind each statistic to a line of the table
    var rows = tbody.selectAll("tr")
        .data(aggstats)
      .enter()
        .append("tr")
            .attr("rowstat", function(d) { return d.key; })
            .attr("chosen", false)
            .attr("onclick", function(d) {
                return "toggleStat('" + d.key + "')"; })


    // Add statistic names to each row
    var stat_cells = rows.append("td")
            .text(function(d) { return d.key; })
            .attr("class", "rowkey")


    // Fill in the cells.  The data -> d.values pulls the value arrays from
    // the data assigned above to each row.
    // The unshift crap bumps the data cells over one - otherwise, the first
    // result value falls under the statistic labels.
    var res_cells = rows.selectAll("td")
        .data(function(d) {
            var x = d.values;
            x.unshift({ qtr_result: ""} );
            return x; })
      .enter()
        .append("td")
          .text(function(d) { return d3.format(",d")(d.qtr_result); })




};

// This function does the one-time setup for the plot - which is basically
// just setting up this g.#lineplot

var setupPlot = function(height, width, margin) {

    // Create an svg element for the plot
   d3.select("#plot").append("svg:svg")
       .attr("width", width)
       .attr("height", height)
     .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", "lineplot");

    // Create global variables for the axes - no need to populate them just yet
    xAxisGroup = null;
    yAxisGroup = null;

};


var toggleStat = function(stat_name) {

    // Toggle the statistic's row
    // Get the current value
    var current = d3.select("tr[rowstat='" + stat_name + "']")
        .attr("chosen")

    // Invert it. When the current toggle status is "true", the comparison
    // below returns "false"; when the current status is "false", it returns
    // "true". A bit opaque, but I can't store proper booleans in HTML attr.
    d3.select("tr[rowstat='" + stat_name + "']")
        .attr("chosen", current == "false")



    // Toggle the statistic in the plot
    drawLinePlot(stats, height, width, margin, transDur, reportStats);


};
