/*        ___   _ _     _
  ___    / _ \ | (_)___| |_
 / _ \  | | | || | / __| __|
| (_) | | |_| || | \__ \ |_
 \___/___\___(_)_|_|___/\__|
    |_____|  */

!function() {

function list(models) {
  if(this.constructor != list) return new list(models)

  this.objects = {}
  this.count = o_O(0)

  o_O.extend(this, o_O.Events) 
  if(models) {
    for(var i=0; i< models.length;i++) {
      this.add(models[i])
    }
  }
}

var proto = list.prototype

proto.genId = function() {
  return ++this.genId.id
}
proto.genId.id = 0

proto.add = function(o) {
  o.id = o.id || this.genId()
  this.objects[o.id] = o

  o.list = this

  if(o.on) {
    o.on('*', this._onevent, this)
    o.emit('add', o, this)
  } 
  else
    this.emit('add', o)

  this.count.incr()
}

proto._onevent = function(ev, o, list) {
  if ((ev == 'add' || ev == 'remove') && list != this) return
  if (ev == 'destroy') {
    this.remove(o)
  }
  this.emit.apply(this, arguments)
}

proto.filter = function(fn) {
  var ret = [];
  this.each(function(o) {
    if(fn(o)) ret.push(o)
  })
  return ret
}

proto.find = function(i) {
  return this.objects[i]
}

proto.each = proto.forEach = function(fn) {
  this.count(); // force the dependency
  for(var i in this.objects)
    fn.call(this, this.find(i), i)
}

proto.remove = function(o) {
  if(undefined === this.objects[o.id])
    return
  delete this.objects[o.id]
  this.count.incr(-1)

  if(this == o.list) delete o.list
  if(o.off) {
    o.emit('remove', o, this)
    o.off('all', this._onevent, this)
  }else{
    this.emit('remove', o)
  }
}

proto.renderOne = function(item, $el) {
  $(getTemplate($el)).each(function(i, elem) {
    var $$ = $(elem)
    $$.appendTo($el)
    o_O.bind(item, $$)
  })
}

proto.bind = function($el) {
  var self = this

  this.on('add', function(item) {
    self.renderOne(item, $el)
  })

  this.on('remove', this.removeElement, this)
}

proto.removeElement = function(item) {
  $(item.el).remove()
}

proto.toString = function() {
  return '#<list>'
}

proto.extend = function() {
  return inherits(this)
}

o_O.list = list

}()