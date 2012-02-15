o_O.uniqueId = function() {
  var id = ++o_O.uniqueId.id;
  var prefix = o_O.uniqueId.prefix 
  return prefix ? prefix + id : id;
}
o_O.uniqueId.id = 0

/*
 __   .__                        
|  | _|  | _____    ______ ______
|  |/ /  | \__  \  /  ___//  ___/
|    <|  |__/ __ \_\___ \ \___ \ 
|__|_ \____(____  /____  >____  >
     \/         \/     \/     \/                    

Simple evented klass system with observable properties
*/

function klass(type, properties, parent) {
  return klass.extend(type, properties, parent)
}

klass.extend = function(type, properties, parent) {
  parent = parent || this
  
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
  o_O.inherits(child, parent)
  
  if(type) {
    klass.classes[type] = child
    child.type = type
  }
  
  child.properties = properties
  child.extend = klass.extend
  return child
}

klass.properties = {}
klass.classes = {}
klass.genId = function() {
  return klass.namespace + (++klass.id)
}
klass.create = function(o) {
  var klss = klass.classes[o.type]
  if(!klss) console.error('no such klass' + o.type)
  return new klss(o)
}
o_O.eventize(klass)


var proto = klass.prototype

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

// update a json object of named values
proto.update = function(o) {
  for(var i in o) {
    if(this.constructor.properties[i] != undefined)
      this[i](o[i])
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

o_O.klass = klass