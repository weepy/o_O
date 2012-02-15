/*           ____        __  _         
   _______  / / /__ ____/ /_(_)__  ___ 
  / __/ _ \/ / / -_) __/ __/ / _ \/ _ \
  \__/\___/_/_/\__/\__/\__/_/\___/_//_/     */


var Collection = function(array) {
  this.objects = {}
  this.count = o_O.property(0)
  
  this.id = 0
  
  o_O.eventize(this) 
  if(array) {
    for(var i=0; i< array.length;i++) {
      this.add(array[i])
    }
  }
}

var fn = Collection.prototype

fn.genId = function() {
  return ++this.id
}

fn.add = function(o) {
  o.id = o.id || this.genId()
  this.objects[o.id] = o
  o.parent = this
  this.emit('add', o)
  
  var collection = this
  
  // emit change events for children
  for(var i in o) {
    var prop = o[i]
    if(prop.emit && prop.change) {
      !function(prop, i) {
        prop.change(function(val, old) {
          collection.emit('change', o, i, val, old)
        })
      }(prop, i)
    }
  }
  
  this.count.incr()
}

fn.filter = function(fn) {
  var ret = [];  
  this.forEach(function(o) {
    if(fn(o)) ret.push(o)
  })
  return ret
}

fn.find = function(i) {
  return this.objects[i]
}

fn.forEach = function(fn) {
  this.count(); // force the dependency
  for(var i in this.objects)
    fn.call(this, this.find(i))
}

fn.remove = function(o) {
  if(typeof o == 'function') {
    this.forEach(function(x) {
      if(o(x)) this.remove(x)
    })
  }
  else {
    delete this.objects[o.id]
    this.count.incr(-1)
    delete o.parent
    delete o.id
    this.emit('remove', o)
  }

}

fn.render = function(item) {
  var html = $(template).appendTo($el)
  o_O.bind(item, html)
}

fn.bind = function() {
  var self
  this.on('add', function(item) {
    this.render(item)
  })
  this.on('remove', function(item) {
    $(item.el).remove()
  })
}


o_O.collection = function(items) {
  var col = new Collection(items)
  return col
}