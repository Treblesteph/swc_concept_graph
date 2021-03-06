// Set the size of diagram.
var width = 1800
var color = d3.scale.category10()
var boxwidth = 200
var maxboxheight = 65
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

// Setting parameters for even y-placement of boxes
// Determine the maximum number of items per column

var nquestions = 0
var nanswers = 0
var ntopics = 0

graph.nodes.forEach(function (k) {
  if (k.group === "q") {
    nquestions += 1
  } else if (k.group === "a") {
    nanswers += 1
  } else if (k.group === "t") {
    ntopics += 1
  }
})

var maxboxespercol = Math.max(nquestions, nanswers, ntopics)
var height = maxboxespercol * maxboxheight

// Find L: distance between box centres for each column

var Lquestions = (height - maxboxheight * nquestions) / (1 + nquestions)
var Lanswers = (height - maxboxheight * nanswers) / (1 + nanswers)
var Ltopics = (height - maxboxheight * ntopics) / (1 + ntopics)

// Set y positions for boxes in question, answer, and topic columns

var q_ypositions = []
var a_ypositions = []
var t_ypositions = []

for (i = 0; i < nquestions; i++) {
  q_ypositions[i] = Lquestions * (i + 1) + maxboxheight * (i + 0.5)
}

for (i = 0; i < nanswers; i++) {
  a_ypositions[i] = Lanswers * (i + 1) + maxboxheight * (i + 0.5)
}

for (i = 0; i < ntopics; i++) {
  t_ypositions[i] = Ltopics * (i + 1) + maxboxheight * (i + 0.5)
}

// Make d3 force layout.
var force = d3.layout.force()
                     .nodes(graph.nodes)
                     .links(graph.links)
                     .size([width, height])
                     .on('tick', tick)
                     .start()

// Create the svg for the graph.
var svg = d3.select('#graph-container')
            .append('svg')
            .attr('class', 'overlay')

// Collision avoidance function.
var radius = 10

// Toggle stores whether the highlighting is on.
var toggle = false
// Create an array logging what is connected to what
var linkedByIndex = {}
for (i = 0; i < graph.nodes.length; i++) {
  linkedByIndex[i + ',' + i] = true
}
graph.links.forEach(function (d) {
  linkedByIndex[d.source.index + ',' + d.target.index] = true
})
// This function looks up whether a pair are neighbours
function neighboring (a, b) {
  return linkedByIndex[a.index + ',' + b.index]
}

// This function finds the direct decendents of a node.
function findChildren (i) {
  var children = []
  graph.links.forEach(function (l) {
    if (l.source.index === i) { children.push(l.target.index) }
  })
  return children
}

function downstream (i) {
  var nodes = []
  var children = findChildren(i)
  nodes.push.apply(nodes, children)
  children.forEach(function (j) {
    nodes.push.apply(nodes, downstream(j))
  })
  return nodes
}

function getDownstream (k) {
  return [k].concat(downstream(k))
}

function connectedNodes () {
  if (!toggle) {
  // Reduce the opacity of all but the neighbouring nodes
    var d = d3.select(this).node().__data__
    // If selected node is a question, select all downstream, otherwise select direct neighbours
    if (d.group !== 'q') {
      node.classed('faded', false)
          .classed('faded', function (o) {
            return !(neighboring(d, o) || neighboring(o, d))
          })
      link.classed('faded', false)
          .classed('faded', function (o) {
            return !(d.index === o.source.index || d.index === o.target.index)
          })
    } else if (d.group === 'q') {
      selectedIndices = getDownstream(d.index)
      showAll(selectedIndices)
    }
    toggle = true
  } else {
  // Put them back to opacity=1
    node.classed('faded', false)
    link.classed('faded', false)
    toggle = false
  }
}

function tick (e) {
  var k = 0.1 * e.alpha
  d3.selectAll('circle')
    .attr('cx', function (d) {
      if (d.group === 'q') {
        return d.x = boxwidth / 2
      } else if (d.group === 'a') {
        return d.x = width / 2
      } else if (d.group === 't') {
        return d.x = 5 * width / 6
      }
    })
    .attr('cy', function (d) {
      if (d.group === 'q') {
        return d.y = q_ypositions[d.index]
      } else if (d.group === 'a') {
        return d.y = a_ypositions[d.index - nquestions]
      } else if (d.group === 't') {
        return d.y = t_ypositions[d.index - (nquestions + nanswers)]
      }
    })

  d3.selectAll('foreignObject')
    .attr('x', function (d) {
      if (d.group === 'q') {
        return d.x - boxwidth / 2
      } else if (d.group === 'a') {
        return d.x - boxwidth / 2
      } else if (d.group === 't') {
        return d.x - boxwidth / 2
      }
    })
    .attr('y', function (d) {
      if (d.group === 'q') {
        return d.y - 10
      } else if (d.group === 'a') {
        return d.y - 10
      } else if (d.group === 't') {
        return d.y - 10
      }
    })

  link.each(function (d) { d.source.y -= k; d.target.y += k })
      .attr('x1', function (d) { return d.source.x })
      .attr('y1', function (d) { return d.source.y })
      .attr('x2', function (d) { return d.target.x })
      .attr('y2', function (d) { return d.target.y })
}

setTimeout(function () {
  selectedIndices = showGroup('q')
  showAll(selectedIndices)
}, 100)

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
              .style('marker-end', 'url(#suit)')

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
    .attr('dx', -boxwidth)
    .attr('dy', -10)
    .attr('width', boxwidth)
    .attr('height', maxboxheight)
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

svg.append('defs').selectAll('marker')
   .data(['suit', 'licensing', 'resolved'])
   .enter().append('marker')
   .attr('id', function (d) { return d })
   .attr('viewBox', '0 -5 10 10')
   .attr('refX', 25)
   .attr('refY', 0)
   .attr('markerWidth', 6)
   .attr('markerHeight', 6)
   .attr('orient', 'auto')
   .append('path')
   .attr('d', 'M0,-5L10,0L0,5 L10,0 L0, -5')
   .style('stroke', '#4679BD')
   .style('opacity', '0.6')

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
