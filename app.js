(function (document, virtualDom, io) {
  var h = virtualDom.h;
  var directions = [];

  function render(data, prev) {
    return h('table', data.map(function (row, i) {
      var diff = prev && (row.bidBig + row.bidPips - (prev[i].bidBig + prev[i].bidPips));
      if (diff) directions[i] = diff < 0 ? "down" : "up";

      return h('tr', [
        h('td', row.currencyPair),
        h('td', {className: "changed-"+!!diff}, [
          h('span', row.bidBig),
          h('sup', row.bidPips)
        ]),
        h('td', { className: directions[i] })
      ])
    }));
  }

  var tree = render([]);
  var rootNode = virtualDom.create(tree);
  document.getElementById('root').appendChild(rootNode);

  var prevData;
  io().on('data', function (data) {
    var newTree = render(data, prevData);
    var patches = virtualDom.diff(tree, newTree);
    rootNode = virtualDom.patch(rootNode, patches);
    tree = newTree;
    prevData = data;
  });
})(document, virtualDom, io);