/*       _     _           _   
    ___ | |__ (_) ___  ___| |_ 
   / _ \| '_ \| |/ _ \/ __| __|
  | (_) | |_) | |  __/ (__| |_ 
   \___/|_.__// |\___|\___|\__|
            |__/                  
            
Currently not used            

*/

var o_O = require('./o_O')

o_O.object = function(name, props) {
  if(arguments.length == 1) props = name
  return object.extend(name, props)
}

function object() {}

object.properties = {}
object.classes = {}

object.extend = function(type, properties) {
  properties = properties || this.properties
  
  var child = function(o) {
    o = o || {}
    for(var i in properties) {
      var x = (i in o) ? o[i] : properties[i]
      this[i] = o_O.property(x)
    }
    
    o_O.eventize(this)
    
    this.type = type
    this.id = o.id || object.genId()
    this.initialize.call(this, o)
    
  }

  
  inherits(child, this)
  
  if(type) {
    object.classes[type] = child
    child.type = type
  }
  
  child.properties = properties
  
  child.extend = this.extend
  return child
}

object.namespace = ""
object.id = 0
object.genId = function() {
	return object.namespace + (object.id++)
}

object.prototype.initialize = function(o) {
  
}

object.prototype.update = function(o) {
  for(var i in o) {
    if(this.constructor.properties[i] != undefined)
      this[i](o[i])
  }
}

object.prototype.toJSON = function() {
  var properties = this.constructor.properties
  var json = {}
  for(var i in properties)
    json[i] = this[i]()

  json.type = this.type
  if(this.id != undefined) json.id = this.id
  return json
}

object.create = function(o) {
  var klass = object.classes[o.type]
  return new klass(o)
}

function inherits(child, parent) { 
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