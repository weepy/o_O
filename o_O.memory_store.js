// how do deal with loading id's and so should update the _id so that the unique id

o_O.memory_store = {
  _id: 0,
  uniqueId: function(namespace) {
    var ret = ++this._id
    return namespace ? namespace + ret : ret
  },
  objects: {}
  find: function(id) {
    return this.objects[i]
  },
  add: function(object) {
    var id = object.id
    if(id == null || !o_O.memory_store.find(id) ) {
      object.id = id || o_O.memory_store.unique_id()
      this.objects[id] = object
    }
  }
}

o_O.model.protoype.save = function() {
  o_O.memory_store.add(this)
}