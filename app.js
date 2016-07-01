new Vue({
  el: '#root',
  data: {
    rows: []
  },
  created: function () {
    io().on('data', function (data) {
      var prev = this.rows;
      this.rows = data.map(function (row, i) {
        var diff = prev.length && (row.bidBig + row.bidPips) - (prev[i].bidBig + prev[i].bidPips);
        var direction;
        if (diff)
          direction = diff < 0 ? "down" : "up";
        else if (prev.length)
          direction = prev[i].direction;

        return Object.assign(row, { changed: !!diff, direction: direction });
      })
    }.bind(this));
  }
})
