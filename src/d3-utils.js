
var refreshChart = function(el, s) {
    var svg = d3.select(el).select("path");
    svg.attr("d", getLine(s.data));
    svg.append("text")
        .attr("x", "500")
        .attr("y", "20")
        .text("$" + s.data[s.data.length - 1][1] + " per KTC");
};

var renderChart = function(el, s) {
  var SVG = d3.select(el)
    .append("svg")
    // .attr("width", "700px")
    // .attr("height", "300px")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 800 300");
    // .style("padding-left", "30px");

  var g = SVG.append("g")
    .attr("transform", "translate(10, 10)");

  // g.append("g")
    //   .call(myAxes(s.data).axisY);

  // var h = window.innerHeight - 40;

  // g.append("g")
    //   .attr("transform", "translate(0, 283)")
    //   .call(myAxes(s.data).axisX);

  g.append('path')
    .datum(s.data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("transform", "translate(2, 0)")
    .attr("d", getLine(s.data));

  g.append("text")
    .attr("x", "500")
    .attr("y", "20")
    .text("$" + s.data[s.data.length - 1][1] + " per BTC");
};

export { renderChart, refreshChart };
