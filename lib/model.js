
!function() {

 /*                                         	
          ___                       _      _ 
  ___    / _ \  _ __ ___   ___   __| | ___| |
 / _ \  | | | || '_ ` _ \ / _ \ / _` |/ _ \ |
| (_) | | |_| || | | | | | (_) | (_| |  __/ |
 \___/___\___(_)_| |_| |_|\___/ \__,_|\___|_|
    |_____|                                  

																							
(c) 2012 by Jonah Fox (weepy), MIT Licensed
																							
Model with observable properties, subclasses, evented
*/

function model(type, properties) {
  return model.extend(type, properties)
}

model.extend = function(type, properties) {  
  // allow typeless classes
  if(properties == null) {
    properties = type
    type = undefined
  }
  
  properties = properties || {} // this.properties

  var child = function child(o) {
    if(!(this instanceof child)) return new child(o)
    o = o || {}
    o_O.eventize(this)
    for(var name in properties) {
      var defaultValue = (name in o) ? o[name] : properties[name]
      this[name] = o_O.property(defaultValue)
      
      
      this.observeProperty(name)
    }
    this.type = type
    this.id = o.id || o_O.uniqueId()
    this.initialize.call(this, o)
    child.emit('create', this)
  }
  
  o_O.eventize(child)
  o_O.inherits(child, this)
  
  if(type) {
    model.models[type] = child
    child.type = type
  }
  
  child.properties = properties
  child.extend = model.extend
  return child
}

model.properties = {}
model.models = {}

model.create = function(o) {
  var klss = model.models[o.type]
  if(!klss) console.error('no such model' + o.type)
  return new klss(o)
}
o_O.eventize(model)


var proto = model.prototype

o_O.eventize(proto)
proto.observeProperty = function(name) {
  var self = this
  this[name].change(function(val, old) {
    self.emit('change', name, val, old, this)
  })
}

proto.toString = function() {
  return '#<'+this.type+':'+this.id+'>'
}

proto.initialize = function(o) {
  
}

// update a json model of named values
proto.update = function(o) {
  for(var key in o) {
    if(key in this.constructor.properties)
      this[key](o[key])
  }
}

proto.delete = function() {
  this.emit('delete', this)
}

proto.toJSON = function() {
  var properties = this.constructor.properties
  var json = {}
  for(var i in properties) {
    var value = this[i]()
    if(value !== properties[i]) json[i] = value
  }
    

  if(this.type) json.type = this.type
  if('id' in this) json.id = this.id
  return json
}


o_O.inherits = function(child, parent) { 
  
  // dont copy over class variables/functions
  // for (var key in parent) { 
  //   if (Object.prototype.hasOwnProperty.call(parent, key)) 
  //     child[key] = parent[key]; 
  // } 
  function ctor() { 
    this.constructor = child; 
  } 
  ctor.prototype = parent.prototype; 
  child.prototype = new ctor; 
  child.__super__ = parent.prototype; 
  return child; 
};


o_O.model = model



}();