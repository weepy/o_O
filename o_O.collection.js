/* * * * 
 * o_O.collection
 * Simple example code to extend o_O.array into a hash like object
 * objects can be added/removed (though not pushed/popped)
 * maintains a fast lookup by id
 */

!function() {

  o_O.collection = o_O.array.extend({
    type: 'o_O.collection',
    initialize: function() {
      var byId = this.byId = {}
      this.each(function(o) {
        byId[o.id()] = o
      })
      this.on('remove', function(o) {
        delete byId[o.id()]
      })
    },
    push: null,
    shift: null,
    unshift: null,
    pop: null,
    add: function(o) {
      this.insert(o, this.length)
      this.byId[o.id()] = o
    },
    findById: function(id) {
      return this.byId[id]
    }
  })

}();