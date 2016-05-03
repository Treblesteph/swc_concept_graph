// Set the size of diagram.
var width = 1500,
    height = 900
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

// Create graph object.
var graph = {
  "nodes": nodesArray, "links": linksArray
}

// Make d3 force layout.
var force = d3.layout.force()
                     .nodes(graph.nodes)
                     .links([])
                     .gravity(0.01)
                     .charge(0)
                     .size([width, height])
                     .on("tick", tick)
                     .start();

// Create the svg for the graph.
var svg = d3.select("#graph-container")
            .append("svg")
            .attr("class", "overlay")

// Collision avoidance function.
var padding = 5, // separation between circles
    radius = 25;

function collide(alpha) {
  var quadtree = d3.geom.quadtree(graph.nodes);
  return function(d) {
    var rb = 2 * radius + padding,
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
  d3.selectAll("rect").attr("x", function(d) { return d.x; })
                      .attr("y", function(d) { return d.y; })

  d3.selectAll("text").attr("x", function(d) { return d.x; })
                      .attr("y", function(d) { return d.y; })

  node.each(collide(0.05));
}

svg.attr("width", width)
   .attr("height", height);

var node = svg.selectAll(".node")
              .data(graph.nodes)
              .enter().append("g")
              .attr("class", "node")
              .call(force.drag);

node.append("rect")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("width", function(d) { return 26 + 4 * d.label.length})
    .attr("height", 15)
    .style("fill", function(d) { return color(d.group) })

node.append("text")
    .attr("dx", 3)
    .attr("dy", "1.1em")
    .text(function(d) { return d.label });
