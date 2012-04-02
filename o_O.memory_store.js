// how do deal with loading id's and so should update the _id so that the unique id

o_O.memory_store = function() {
  this._id = 0
  this.objects = {}
  this.types = {}
}

var proto = o_O.memory_store.prototype

proto.uniqueId = function(namespace) {
  var ret = ++this._id
  return namespace ? namespace + ret : ret
}

proto.find = function(id) {
  return this.objects[i]
}
  
proto.add = function(object) {
  var id = object.id
  if(id == null || !o_O.memory_store.find(id) ) {
    object.id = id || o_O.memory_store.unique_id()
    this.objects[id] = object
  }
}

// merge in
o_O.model.protoype.store = new o_O.memory_store()
o_O.model.protoype.save = function() {
  this.store.add(this)
}

// needs to be a factory also
// o_O.store.create({id:10, type: 'Person', name: 'John' })
// => creates a Person() with name() 'John'
// this means we need to be able to register classes with the store