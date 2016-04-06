// Set the size of the diagram.
var width = $(document).width(),
    height = $(document).height();

// Read in graph data.
var g = graphlibDot.read(design),
    node_info = g._nodes;
    edge_info = g._edgeObjs;

var nodesArray = [],
    linksArray = [];

var indexval = 0;
// Loop through all nodes adding their labels and groups.
Object.keys(node_info).forEach(function(a) {
  node_info[a].i = indexval;
  indexval ++;
  var thisnode = {};
  thisnode["name"] = a;
  thisnode["label"] = node_info[a].label;
  thisnode["group"] = a[0];
  nodesArray.push(thisnode);
})

// Loop through all paths adding their source and target.
Object.keys(edge_info).forEach(function(a) {
  var thisedge = {},
      source = edge_info[a].v,
      target = edge_info[a].w;
  thisedge["source"] = node_info[source].i;
  thisedge["target"] = node_info[target].i;
  linksArray.push(thisedge);
})

// Create graph object.
var graph = {
  "nodes": nodesArray, "links": linksArray
}

var color = d3.scale.category10();

// Making the zoom functionality.
function zoom() {
  svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale +")");
}

var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

function tick(e){
  var k = 6 * e.alpha;

  link
      .each(function(d) { d.source.y -= k, d.target.y += k; })
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });

}

// Making d3 force layout.
var force = d3.layout.force()
              .charge(-150)
              .linkDistance(10)
              .size([width, height]);

// Toggle stores whether the highlighting is on.
var toggle = 0;
//Create an array logging what is connected to what.
var linkedByIndex = {};
for (i = 0; i < graph.nodes.length; i++) {
     linkedByIndex[i + "," + i] = 1;
};
graph.links.forEach(function (d) {
  linkedByIndex[d.source.index + "," + d.target.index] = 1;
});

//This function looks up whether a pair are neighbours
function neighboring(a, b) {
  return linkedByIndex[a.index + "," + b.index];
}
function connectedNodes() {
  if (toggle == 0) {
    //Reduce the opacity of all but the neighbouring nodes
    d = d3.select(this).node().__data__;
    node.style("opacity", function (o) {
      return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
    });
    link.style("opacity", function (o) {
      return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
    });
    //Reduce the op
    toggle = 1;
  } else {
  //Put them back to opacity=1
  node.style("opacity", 1);
  link.style("opacity", 1);
  toggle = 0;
  }
}

force
    .nodes(graph.nodes)
    .links(graph.links)
    .on("tick", tick)
    .start();


var svg = d3.select("#graph-container").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "overlay")
            .call(zoomListener);

// Set up an SVG group so that we can translate the final graph.
var svgGroup = svg.append("g");

// Add arrows to paths.
svg.append("defs").selectAll("marker")
   .data(["suit", "licensing", "resolved"])
   .enter().append("marker")
   .attr("id", function(d) { return d; })
   .attr("viewBox", "0 -5 10 10")
   .attr("refX", 25)
   .attr("refY", 0)
   .attr("markerWidth", 6)
   .attr("markerHeight", 6)
   .attr("orient", "auto")
   .append("path")
   .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
   .style("stroke", "#4679BD")
   .style("opacity", "0.6");

var link = svg.selectAll(".link")
              .data(graph.links)
              .enter().append("line")
              .attr("class", "link")
              .style("marker-end",  "url(#suit)");

var node = svg.selectAll(".node")
              .data(graph.nodes)
              .enter().append("rect")
              .attr("class", "node")
              .attr("width", 45)
              .attr("height", 15)
              .style("fill", function(d) {
                return color(d.group);
              })
              .call(force.drag)
              .on('dblclick', connectedNodes);

node.append("title")
    .text(function(d) { return d.label; });
