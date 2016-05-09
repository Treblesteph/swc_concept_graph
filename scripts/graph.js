// Set the size of diagram.
var width = 1800
var height = 1100
var color = d3.scale.category10()
var selectedIndices = []

// Read in data and convert to more simple object.
var g = graphlibDot.read(design)
var node_info = g._nodes
var edge_info = g._edgeObjs

var nodesArray = []
var linksArray = []

var indexval = 0

// Loop through all nodes, adding their labels and groups.
Object.keys(node_info).forEach(function (a) {
  node_info[a].i = indexval
  indexval++
  var thisnode = {}
  thisnode['name'] = a
  thisnode['label'] = node_info[a].label
  thisnode['group'] = a[0]
  nodesArray.push(thisnode)
})

// Loop through all nodes adding their source and target.
Object.keys(edge_info).forEach(function (a) {
  var thisedge = {}
  var source = edge_info[a].v
  var target = edge_info[a].w
  thisedge['source'] = node_info[source].i
  thisedge['target'] = node_info[target].i
  linksArray.push(thisedge)
})

// Create graph object.
var graph = {
  'nodes': nodesArray, 'links': linksArray
}

// Make d3 force layout.
var force = d3.layout.force()
                     .nodes(graph.nodes)
                     .links(graph.links)
                     .gravity(0.1)
                     .charge(0)
                     .friction(0.1)
                     .size([width, height])
                     .on('tick', tick)
                     .start()

// Create the svg for the graph.
var svg = d3.select('#graph-container')
            .append('svg')
            .attr('class', 'overlay')

// Collision avoidance function.
var radius = 10

function collide (alpha) {
  var quadtree = d3.geom.quadtree(graph.nodes)
  return function (d) {
    var rb = ($.inArray(d.index, selectedIndices) > -1) ? radius + 200 : radius + 5
    var nx1 = d.x - rb
    var nx2 = d.x + rb
    var ny1 = d.y - rb / 2
    var ny2 = d.y + rb / 2
    quadtree.visit(function (quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x
        var y = d.y - quad.point.y
        var l = Math.sqrt(x * x + y * y)
        if (l < rb) {
          l = (l - rb) / l * alpha
          d.x -= x *= l
          d.y -= y *= l / 2
          quad.point.x += x
          quad.point.y += y
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1
    })
  }
}

// Toggle stores whether the highlighting is on.
var toggle = false
// Create an array logging what is connected to what
var linkedByIndex = {}
for (i = 0; i < graph.nodes.length; i++) {
  linkedByIndex[i + ',' + i] = true
}
graph.links.forEach(function (d) {
    linkedByIndex[d.source.index + "," + d.target.index] = true;
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
            return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
        });
        link.style("opacity", function (o) {
            return d.index == o.source.index | d.index == o.target.index ? 1 : 0.1;
        });
        //Reduce the op
        toggle = true;
    } else {
        //Put them back to opacity=1
        node.style("opacity", 1);
        link.style("opacity", 1);
        toggle = false;
    }
}

function tick (e) {
  var k = 0.1 * e.alpha
  d3.selectAll('circle').attr('cx', function (d) { return d.x })
                        .attr('cy', function (d) { return d.y })

  d3.selectAll('foreignObject').attr('x', function (d) { return d.x - 100 })
                               .attr('y', function (d) { return d.y - 10 })

  link.each(function (d) { d.source.y -= k; d.target.y += k })
      .attr('x1', function (d) { return d.source.x })
      .attr('y1', function (d) { return d.source.y })
      .attr('x2', function (d) { return d.target.x })
      .attr('y2', function (d) { return d.target.y })

  node.each(collide(0.5))
}

setTimeout(function () {
  selectedIndices = showGroup('q')
  showAll(selectedIndices)
}, 2000)

function showGroup (group) {
  selectedIndices = []
  graph.nodes.forEach(function (d) {
    if (d.group === group) {
      selectedIndices.push(d.index)
    }
  })
  return selectedIndices
}

// Enlarging different groups of nodes by group with buttons.
document.getElementById('showquestions').onclick = function () {
  showGroup('q')
  showAll(selectedIndices)
}
document.getElementById('showanswers').onclick = function () {
  showGroup('a')
  showAll(selectedIndices)
}
document.getElementById('showtopics').onclick = function () {
  showGroup('t')
  showAll(selectedIndices)
}

function showAll (indexArray) {
  d3.selectAll('g')
    .classed('bignodes', false)
    .classed('bignodes', function (d, i) {
      return $.inArray(d.index, indexArray) > -1
    })
  force.start()
}

svg.attr('width', width)
   .attr('height', height)

var link = svg.selectAll('.link')
              .data(graph.links)
              .enter().append('line')
              .attr('class', 'link')

var node = svg.selectAll('.node')
              .data(graph.nodes)
              .enter().append('g')
              .attr('class', 'node')
              .call(force.drag)
              .on('dblclick', connectedNodes)

node.append('circle')
    .attr('cx', function (d) { return d.x })
    .attr('cy', function (d) { return d.y })
    .attr('r', 5)
    .style('fill', function (d) { return color(d.group) })

node.append('foreignObject')
    .attr('dx', -200)
    .attr('dy', -10)
    .attr('width', 200)
    .append('xhtml:body')
    .classed('textbox', true)
    .style('background-color', function (d) { return color(d.group) })
    .style('border-radius', '5px')
    .text(function (d) { return d.label })
    .call(force.drag)

node.append('title')
    .text(function (d) { return d.label })

var optArray = []
for (var i = 0; i < graph.nodes.length - 1; i++) {
  optArray.push(graph.nodes[i].name)
}
optArray = optArray.sort()
$(function () {
  $('#search').autocomplete({
    source: optArray
  })
})

function searchNode () {
  // find the node
  var selectedVal = document.getElementById('search').value
  var node = svg.selectAll('.node')
  if (selectedVal === 'none') {
    node.style('stroke', 'white').style('stroke-width', '1')
  } else {
    var selected = node.filter(function (d, i) {
      return d.name !== selectedVal
    })
    selected.style('opacity', '0')
    var link = svg.selectAll('.link')
    link.style('opacity', '0')
    d3.selectAll('.node, .link').transition()
      .duration(5000)
      .style('opacity', 1)
  }
}
