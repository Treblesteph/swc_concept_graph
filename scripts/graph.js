// Set the size of diagram.
var width = 2000,
    height = 1100
    color = d3.scale.category10();

// Read in data and convert to more simple object.
var g = graphlibDot.read(design),
    node_info = g._nodes,
    edge_info = g._edgeObjs;

var nodesArray = [],
    linksArray = [];

var indexval = 0;
// Loop through all nodes, adding their labels and groups.
Object.keys(node_info).forEach(function(a) {
  node_info[a].i = indexval;
  indexval ++;
  var thisnode = {};
  thisnode["name"] = a;
  thisnode["label"] = node_info[a].label;
  thisnode["group"] = a[0];
  nodesArray.push(thisnode);
})

// Loop through all nodes adding their source and target.
Object.keys(edge_info).forEach(function(a) {
  var thisedge = {},
      source = edge_info[a].v,
      target = edge_info[a].w;
  thisedge["source"] = node_info[source].i;
  thisedge["target"] = node_info[target].i;
  linksArray.push(thisedge);
})

// Extract only questions for nodes initially.
var questions = [];
Object.keys(nodesArray).forEach(function(a) {
  if (nodesArray[a].group == "q") {
    questions.push(nodesArray[a])
  }
})

// Create graph object.
var graph = {
  "nodes": nodesArray, "links": linksArray
}

// Make d3 force layout.
var force = d3.layout.force()
                     .nodes(graph.nodes)
                     .links(graph.links)
                     .gravity(0.1)
                     .charge(0)
                     .friction(0.1)
                     .size([width, height])
                     .on("tick", tick)
                     .start();

// Create the svg for the graph.
var svg = d3.select("#graph-container")
            .append("svg")
            .attr("class", "overlay")

// Collision avoidance function.
var padding = 10,
    clusterPadding = 6,
    radius = 10;

function collide(alpha) {
  var quadtree = d3.geom.quadtree(graph.nodes);
  return function(d) {
    var rb = (d.group == selectedgroup) ? radius + 125 : radius + 5,
        nx1 = d.x - rb,
        nx2 = d.x + rb,
        ny1 = d.y - rb,
        ny2 = d.y + rb;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y);
          if (l < rb) {
          l = (l - rb) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

function tick(e) {
  var k = 0.1 * e.alpha;
  d3.selectAll("circle").attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; })

  d3.selectAll("foreignObject").attr("x", function(d) { return d.x - 45; })
                               .attr("y", function(d) { return d.y - 40; })

  link.each(function(d) { d.source.y -= k, d.target.y += k; })
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.each(collide(0.5));
}

// Enlarging different groups of nodes.
var selectedgroup = "q";
document.getElementById("showquestions").onclick = function () { showAll("q"); }
document.getElementById("showanswers").onclick = function () { showAll("a"); }
document.getElementById("showtopics").onclick = function () { showAll("t"); }

function showAll(group) {
  selectedgroup = group;
  d3.selectAll("g")
    .classed("bignodes", false)
    .classed("bignodes", function (d, i) {
      return d.group == group;
    });
  force.start();
}

svg.attr("width", width)
   .attr("height", height);

var link = svg.selectAll(".link")
              .data(graph.links)
              .enter().append("line")
              .attr("class", "link");

var node = svg.selectAll(".node")
              .data(graph.nodes)
              .enter().append("g")
              .attr("class", "node")
              .classed("bignodes", function(d) { return d.group == "q"; })
              .call(force.drag);

node.append("circle")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", 5)
    .style("fill", function(d) { return color(d.group) });

node.append("foreignObject")
    .attr("dx", -45)
    .attr("dy", -60)
    .attr("width", 86)
    .append("xhtml:body")
    .text(function(d) { return d.label });


var optArray = [];
for (var i = 0; i < graph.nodes.length - 1; i++) {
    optArray.push(graph.nodes[i].name);
}
optArray = optArray.sort();
$(function () {
    $("#search").autocomplete({
        source: optArray
    });
});
function searchNode() {
    //find the node
    var selectedVal = document.getElementById('search').value;
    var node = svg.selectAll(".node");
    if (selectedVal == "none") {
        node.style("stroke", "white").style("stroke-width", "1");
    } else {
        var selected = node.filter(function (d, i) {
            return d.name != selectedVal;
        });
        selected.style("opacity", "0");
        var link = svg.selectAll(".link")
        link.style("opacity", "0");
        d3.selectAll(".node, .link").transition()
            .duration(5000)
            .style("opacity", 1);
    }
}
