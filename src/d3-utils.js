import * as d3 from 'd3';

var myAxes = function(data) {
  var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) {
      return d[0];
    }))
    .range([0, window.innerWidth - 100]);

  var y = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {
      return d[1];
    }))
    .range([window.innerHeight - 50, 0]);

  var axisX = d3.axisBottom(x);
  var axisY = d3.axisLeft(y);

  return {
    axisX: axisX,
    axisY: axisY,
    x: x,
    y: y
  };

};

var getLine = function(data) {

  var x = myAxes(data).x;
  var y = myAxes(data).y;

  var line = d3.line()
    .x((d) => {
      return x(d[0]);
    })
    .y((d) => {
      return y(d[1]);
    });

  return line;
};

var renderChart = function(el, s) {
  var SVG = d3.selectAll("svg").remove();
  var SVG = d3.select('.Chart')
    .append("svg")
    .attr("width", s.width)
    .attr("height", s.height)
    .style("padding-left", "21px");

  var g = SVG.append("g")
    .attr("transform", "translate(10, 10)");

  g.append("g")
    .call(myAxes(s.data).axisY);

  var h = window.innerHeight - 40;
  g.append("g")
    .attr("transform", "translate(0, " + h + ")")
    .call(myAxes(s.data).axisX);

  g.append('path')
    .datum(s.data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("transform", "translate(2, 0)")
    .attr("d", getLine(s.data));
};

export { renderChart };
