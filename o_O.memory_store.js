o_O.memoryStore = function() {
  this._id = 0
  this.objects = {}
  this.types = {}
}

var proto = o_O.memoryStore.prototype

proto.uniqueId = function() {
  return ++this._id
}

proto.find = function(id) {
  return this.objects[i]
}
  
proto.add = function(object) {
  var id = object.id
  if(id == null || !this.find(id) ) {
    object.id = id || this.uniqueId()
    this.objects[id] = object
  }
}

proto.remove = function(o) {
  delete this.objects[o.id]
}

// merge in some methods to o_O.model
o_O.model.protoype.store = new o_O.memoryStore()
o_O.model.protoype.save = function() {
  this.store.add(this)
}

// o_O.model already acts as a factory
// doesn't makes sense to move this to o_O.store
o_O.model.types = {...}
o_O.model.create = function(){ ... } // perhaps better to call something like `instantiate` - although a bit long

// how do deal with loading id's and so should update the _id so that the unique id
// whenever adding an object - check to see if object.id >= this._id ?