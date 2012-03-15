/*           ____        __  _         
   _______  / / /__ ____/ /_(_)__  ___ 
  / __/ _ \/ / / -_) __/ __/ / _ \/ _ \
  \__/\___/_/_/\__/\__/\__/_/\___/_//_/     */

function Collection(models) {
  if(this.constructor != Collection) return new Collection(models)
  
  this.objects = {}
  this.count = o_O.property(0)
  
  this.id = 0
  
  o_O.eventize(this) 
  if(models) {
    for(var i=0; i< models.length;i++) {
      this.add(models[i])
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
  
  o.collection = this
  
  o.on && o.on('*', this._onevent, this)
  o.emit && o.emit('add', o)
  
  // // emit change events for children
  // for(var i in o) {
  //   var prop = o[i]
  //   if(prop.emit && prop.change) {
  //     !function(prop, i) {
  //       prop.change(function(val, old) {
  //         collection.emit('change', o, i, val, old)
  //       })
  //     }(prop, i)
  //   }
  // }
  
  this.count.incr()
}

fn._onevent = function(ev, o, collection) {
  if ((ev == 'add' || ev == 'remove') && collection != this) return
  if (ev == 'destroy') {
    this.remove(model)
  }
  this.emit.apply(this, arguments)
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
  delete this.objects[o.id]
  this.count.incr(-1)
  // delete o.id
  this.emit('remove', o)
  if(this == o.collection) delete o.collection
  o.off && o.off('all', this._onevent, this)
}

fn.renderOne = function(item, $el) {
  var template = $el.data('o_O:template')
  var html = $(template).appendTo($el)
  o_O.bind(item, html)
}

fn.bind = function($el) {
  var self = this
    
  this.on('add', function(item) {
    self.renderOne(item, $el)
  })
  this.on('remove', function(item) {
    $(item.el).remove()
  })
}

o_O.Collection = Collection
