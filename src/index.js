export var data = {};

export var state = {
  example_state_property: 25
};

export function update() {

}

export function draw() {
  // Group items for visualising
  ['host', 'path', 'type'].forEach(function(prop) {
    var groupedItems = data.logItems.reduce(function(grouped, item) {
      var key = item[prop];
      grouped[key] = grouped[key] || [];
      grouped[key].push(item);
      return grouped;
    }, {});

    data[prop] = groupedItems;
  });
}
