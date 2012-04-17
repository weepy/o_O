window.zoom = o_O(1)

var View = o_O.model({
    pos: 500
  }, {
    initialize: function(o) {
      this.rects = o_O.array()
    },
    scrollLeft: function() {
      var left = this.pos() * zoom()
      return left
    },
    onbind: function() {
      var self = this
      $(this.el)
        .drag('start', function(e, dd) {
          dd.startPos = self.pos()
          dd.zoom = zoom()
          dd.w = (dd.startX - $('#container').offset().left) 
          dd.s = dd.pos * dd.zoom
        })
    		.drag(function(e, dd) {
          var ratio = 1+dd.deltaY/100
          var z = dd.zoom * ratio
          zoom(z)
          var pos = -dd.deltaX/z + dd.w*(ratio - 1)/z + dd.startPos
          self.pos(pos)
    		})

    }
  }).bind('#container')


var Rect = o_O.model.extend({
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  title: 'Rect'
}, {
  css: function() {
    return {
      top: this.y(),
      left: this.x() * zoom(),
      width: this.width()  * zoom(),
      height: this.height()
    }
  },
  onbind: function() {
    var self = this
    $(this.el)
      .drag('start', function(e, dd) {
        dd.x = self.x()
        dd.y = self.y()
      })
  		.drag(function(e, dd) {
        self.x(dd.x + dd.deltaX/zoom())
        self.y(dd.y + dd.deltaY)
  		})
  }
})


for(var i =0; i< 30; i++) {
  View.rects.push( Rect({x: i*60, y: i%3 * 150 + 100, title: i}) )
}