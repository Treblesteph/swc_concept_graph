
var g = graphlibDot.read(design);

// Create the renderer
var render = new dagreD3.render();

var svg = d3.select("#graph-container").append("svg");

// Set up an SVG group so that we can translate the final graph.
var svgGroup = svg.append("g");

// Run the renderer. This is what draws the final graph.
var thingtorender = d3.select("svg g")

render(thingtorender, g);
