// Set the size of the diagram.
var width = $(document).width(),
    height = $(document).height(),
    color = d3.scale.category10();


// Read in graph data and convert to more simple object.
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

// Making d3 force layout.
var force = d3.layout.force()
              .charge(-950)
              .linkDistance(45)
              .linkStrength(1)
              .friction(0.1)
              .alpha(0.99)
              .size([0.9 * width, 0.9 * height])
              .gravity(0.3);


// Create svg for the graph.
var svg = d3.select("#graph-container")
            .append("svg")
            .attr("class", "overlay")

// Making the zoom functionality.
var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]);

// Set up an SVG group so that we can translate the final graph.
var svgGroup = svg.append("g");

function zoom() {
  svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale +")");
}

// var padding = 10, // separation between circles
//     radius = 45;
//
// function collide(alpha) {
//   var quadtree = d3.geom.quadtree(graph.nodes);
//   return function(d) {
//     var rb = 2 * radius + padding,
//         nx1 = d.x - rb,
//         nx2 = d.x + rb,
//         ny1 = d.y - rb,
//         ny2 = d.y + rb;
//     quadtree.visit(function(quad, x1, y1, x2, y2) {
//       if (quad.point && (quad.point !== d)) {
//         var x = d.x - quad.point.x,
//             y = d.y - quad.point.y,
//             l = Math.sqrt(x * x + y * y);
//           if (l < rb) {
//           l = (l - rb) / l * alpha;
//           d.x -= x *= l;
//           d.y -= y *= l;
//           quad.point.x += x;
//           quad.point.y += y;
//         }
//       }
//       return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
//     });
//   };
// }

function tick(e){
  var k = 0.1 * e.alpha;
  graph.nodes.forEach(function(o) {
    if (o.group == "q") {
      o.x -= 3;
    } else if (o.group == "a") {
      o.x += 0;
    } else if (o.group == "t") {
      o.x += 1;
    } else {
      console.log("wrong group names")
    }
  });

  link.each(function(d) { d.source.y -= k, d.target.y += k; })
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

  // node.each(collide(0.05));
}

// Toggle stores whether the highlighting is on.
var toggle = false;
//Create an array logging what is connected to what.
var linkedByIndex = {};
for (i = 0; i < graph.nodes.length; i++) {
     linkedByIndex[i + "," + i] = true;
};
graph.links.forEach(function (d) {
  linkedByIndex[d.source + "," + d.target] = true;
});

//This function looks up whether a pair are neighbours
function neighboring(a, b) {
  return linkedByIndex[a.index + "," + b.index];
}
function connectedNodes() {
  if (!toggle) {
    //Reduce the opacity of all but the neighbouring nodes
    d = d3.select(this).node().__data__;
    node.style("opacity", function (o) {
      return neighboring(d, o) || neighboring(o, d) ? 1 : 0.1;
    });
    link.style("opacity", function (o) {
      return (d.index == o.source.index || d.index == o.target.index) ? 1 : 0.1;
    });
    // Reduce the opacity.
    toggle = true;
  } else {
  // Put them back to opacity = 1.
  node.style("opacity", 1);
  link.style("opacity", 1);
  toggle = false;
  }
}

force.nodes(graph.nodes)
     .links(graph.links)
     .on("tick", tick)
     .start();

zoomListener.on("zoom", zoom);

svg.attr("width", width)
   .attr("height", height);

svgGroup.call(zoomListener);

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
              .enter().append("circle")
              .attr("r", 15)
              .attr("class", "node")
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; })
              // .append("rect")
              // .attr("width", 45)
              // .attr("height", 15)
              .style("fill", function(d) { return color(d.group) })
              .call(force.drag)
              .on('dblclick', connectedNodes);

node.append("title")
    .text(function(d) { return d.label; });
