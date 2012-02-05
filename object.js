function object() {}

object.properties = {}
object.classes = {}

object.extend = function(type, properties) {
  properties = properties || this.properties

	for(var i in properties) {
    if(properties[i] && typeof properties[i] == 'object')
			throw(type +"::" + i + " default value must be scalar")
  }

  var child = function(o) {
    o = o || {}
    for(var i in properties) {
      var val = o[i]
      this[i] = val === undefined ? properties[i] : val
    }
    this.type = type
    this.id = o.id || object.genId()
    this.initialize.call(this, o)
  }

  
  inherits(child, this)
  object.classes[type] = child
  child.properties = properties
  child.type = type
  child.extend = this.extend
  return child
}

// saving the planet with short unique ids!
// 12 digits of 95 chars => 1e18
// could be shorter still if we were given a alphabetic client id and then used a1, a2, a3 etc.. 
// is space saving relevent ?
// object.generateId = function x() {
//   var s = new Array(12)
//   for(var i=0;i < s.length; i++) {
//     s[i] = String.fromCharCode((0|Math.random()*95)+31)
//   }  
//   return s.join('')
// }

object.namespace = ""
object.id = 0
object.genId = function() {
	return object.namespace + (++object.id)
}

object.prototype.initialize = function(o) {
  
}

object.prototype.update = function(o) {
  for(var i in o) {
    if(this.constructor.properties[i] != undefined)
      this.set(i, o[i])
  }
}

object.prototype.set = function(prop, val) {
  this[prop] = val
}


object.prototype.toJSON = function() {
  var properties = this.constructor.properties
  var json = {}
  for(var i in properties)
    if(this[i] !== properties[i]) json[i] = this[i]
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

module.exports = object