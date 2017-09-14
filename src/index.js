import { select, event } from 'd3-selection'
import 'd3-transition'
import 'd3-selection-multi'

export let data = {};

export let state = {
  scale: 1,
  logScale: 1,
  color: '#FF0033',
  shape: 'circular',
  useLog: true
};

let w, h, svg;


function setAttributes(element, attrs) {
  Object.keys(attrs).forEach(function(key) {
    element.attr(key, attrs[key]);
  })
}

function pointOnCircle(cx, cy, angle, radius) {
  return {
    x: cx + (Math.cos(angle) * radius),
    y: cy + (Math.sin(angle) * radius),
  }
}

function scalePct(value, max, scaleFactor) {
  if (value <= 1)
    return 0;

  return max * Math.log(value) / 100 * scaleFactor;
}


export function update() {

  //
  // HOSTS
  let hosts = svg.selectAll('circle.host')
    .data(data.host);

  let maxHosts = data.host.length;

  let hostAttrs = {
    cx: (d, i) => {
      if(state.shape === 'circular') {
        return pointOnCircle(w / 2, h / 2, i / data.host.length * (2 * Math.PI), 100).x;
      }
      else {
        return w / data.host.length * i;
      }
    },
    cy: (d, i) => {
      if(state.shape === 'circular') {
        return pointOnCircle(w / 2, h / 2, i / data.host.length * (2 * Math.PI), 100).y;
      }
      else {
        return 50;
      }
    },
    r: (d) => {
      if(state.useLog === true) {
        return scalePct(d.length / maxHosts * 100, 300, state.logScale) * state.scale;
      }
      else {
        return d.length / maxHosts * 10;
      }
    },
    'fill': state.color
  };

  hosts.enter()
    .append('circle')
    .attr('class', 'host')
    .call(setAttributes, hostAttrs);

  hosts
    .transition()
    .duration(1000)
    .call(setAttributes, hostAttrs);

  hosts
    .exit()
    .remove();


  //
  // PATHS
  let paths = svg.selectAll('circle.path')
    .data(data.path);

  let maxPaths = data.path.length;

  let pathAttrs = {
    cx: (d, i) => {
      if(state.shape === 'circular') {
        return pointOnCircle(w / 2, h / 2, i / data.path.length * (2 * Math.PI), 200).x;
      }
      else {
        return w / data.host.length * i;
      }
    },
    cy: (d, i) => {
      if(state.shape === 'circular') {
        return pointOnCircle(w / 2, h / 2, i / data.path.length * (2 * Math.PI), 200).y;
      }
      else {
        return h - 50;
      }
    },
    r: (d) => {
      if(state.useLog === true) {
        return scalePct(d.length / maxPaths * 100, 300, state.logScale) * state.scale;
      }
      else {
        return d.length / maxPaths * 200;
      }
    },
    'fill': '#00FF33'
  };

  paths.enter()
    .append('circle')
    .attr('class', 'path')
    .call(setAttributes, pathAttrs);

  paths
    .transition()
    .duration(1000)
    .call(setAttributes, pathAttrs);

  paths
    .exit()
    .remove();

  // Draw Connections
  console.log('update');
}

export function draw() {
  w = window.innerWidth;
  h = window.innerHeight;

  svg = select(document.body)
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  // Group items for visualising
  ['host', 'path', 'type'].forEach(prop => {
    let groupedItems = data.logItems.reduce((grouped, item) => {
      let key = item[prop];
      grouped[key] = grouped[key] || [];
      grouped[key].push(item);
      return grouped;
    }, {});

    // Convert to array and lose key
    let values = [];
    Object.keys(groupedItems).forEach(key => {
      values.push(groupedItems[key]);
    });

    data[prop] = values;
  });

  update();
}
