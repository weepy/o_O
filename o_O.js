!function() {

/*  
                                         
                        ,ad8888ba,            FunnyFace.js     
                       d8"'    `"8b           ============
                      d8'        `8b     
 ,adPPYba,            88          88          HTML binding for Lulz 
a8"     "8a           88          88     
8b       d8           Y8,        ,8P          Elegant, flexible method to bind to HTML
"8a,   ,a8"            Y8a.    .a8P           
 `"YbbdP"'              `"Y8888Y"'            Proxies through jQuery (or whatever $ is)
                                         
           888888888888                       automatic dependency
                                          
                                              inspired by KO but is only about 2% of the size
                                              
                                              Kept small and simple and fast - so you can hack what you need ontop
                                                
                                              (c) 2012 by weepy, MIT Licensed
*/

function o_O() {};

// shims for IE compatability


function forEach(array, action) {
  if(array.forEach) return array.forEach(action)  
  for (var i= 0, n= array.length; i<n; i++)
    if (i in array)
      action.call(null, array[i], i, array);
}

function trim(s) {
  return s.replace(/^\s+|\s+$/g, '')
}
typeof module != 'undefined' ? module.exports = o_O : window.o_O = o_O

/*********          _   _        
 *   _____ _____ _ _| |_(_)______ 
 *  / -_) V / -_) ' \  _| |_ / -_)
 *  \___|\_/\___|_||_\__|_/__\___|     
 */
!function() {
  var methods  = {
    on  : function(event, fct){
      this._events = this._events || {};
      this._events[event] = this._events[event]  || [];
      this._events[event].push(fct);
      return this
    },
    off  : function(event, fct){
      this._events = this._events || {};
      if( event in this._events === false  )  return;
      this._events[event].splice(this._events[event].indexOf(fct), 1);
      return this
    },
    emit  : function(event /* , args... */){
      this._events = this._events || {};
      var args = Array.prototype.slice.call(arguments, 1)
      var events
      if(events = this._events[event]) {
        for(var i = 0; i < events.length; i++)
          events[i].apply(this, args)
      }
      args.unshift(event)
      if(events = this._events['*']) {
        for(var i = 0; i < events.length; i++)
          events[i].apply(this, args)
      }
      return this
    }
  }

  o_O.eventize = function(o) {
    o.on = methods.on
    o.off = methods.off
    o.emit = methods.emit
    return o
  }
}();


/*                               _         
 _ __  _ __ ___  _ __   ___ _ __| |_ _   _ 
| '_ \| '__/ _ \| '_ \ / _ \ '__| __| | | |
| |_) | | | (_) | |_) |  __/ |  | |_| |_| |
| .__/|_|  \___/| .__/ \___|_|   \__|\__, |
|_|             |_|                  |___/ 


 *  Our workhorse
 *  property returns an observable
 *  that can be set like prop(val) and got like prop()
 *  it trigger's set events
 *  it also automatically figures out it's deps on other o_O.properties
 *  a function can also be passed in for computed properties
 */


/*
 * Public function to return an observable property
 * sync: whether to emit changes immediately, or in the next event loop
 */
o_O.property = function(x) {
  var func = (typeof x == 'function')
  var prop = func ? computed(x) : simple(x)
  
  o_O.eventize(prop)
  
  prop.change = function(fn) {
    fn
      ? prop.on('set', fn)  // setup observer
      : prop(prop())        // getset
  }
  
  prop.toString = function() { return '#<Property:'  + prop.value + '>'}
  prop.__o_O = true
  return prop
}

o_O.property.is = function(o) { return o.__o_O == true }

/*
 * Simple registry which emits all property change from one event loop in the next
 */
var asyncEmit = (function() {
  var list = []
  var timer = null
  function run() {
    for(var i=0; i< list.length;i++) {
      var prop = list[i]
      prop.emit('set', prop.value, prop.old_value)
      delete prop._emitting
    }
    timer = null
    list = []
  }
  return function(prop) {
    if(prop._emitting) return
    list.push(prop)
    prop._emitting = true
    timer = timer || setTimeout(function() { run() }, 0)
  }
})();

// simple variable to indicate if we're checking dependencies
var checking = false
/*
 * Simple property ...
 */
function simple(defaultValue) {
  
  function prop(v) {
    if(arguments.length) {
      prop.value = v
      asyncEmit(prop)
    } else {
      if(checking) o_O.__deps_hook.emit('get', prop)   // emit to dependency checker
    }
    return prop.value
  }
  
  prop.value = defaultValue
  prop.dependencies = []     // should depend on self?
  
  prop.incr = function(val) {
    prop(prop.value + (val || 1))
  }
  return prop
}

/*
 * Computed property ...
 */
function computed(getset) {
  
  function prop(v) {
    if(arguments.length) {
      prop.old_value = prop.value
      prop.value = getset(v)
      asyncEmit(prop)
    } else {
      prop.value = getset()
      if(checking) o_O.__deps_hook.emit('get', prop)   // emit to dependency checker
    }
    return prop.value
  }
  prop.dependencies = o_O.dependencies(prop)
  
  return prop
}



/*
 *  Hook to listen to all get events
 */
o_O.__deps_hook = o_O.eventize({})

o_O.dependencies = function(func) {
  var deps = []
  
  function add(dep) {
    if(indexOf(deps, dep) < 0 && dep != func) deps.push(dep)
  }
  
  checking = true
  o_O.__deps_hook.on('get', add)
  o_O.dependencies.lastResult = func() // run the function
  o_O.__deps_hook.off('get', add)
  checking = false
  
  return deps
}

function indexOf(array, obj, start) {
  if(array.indexOf) return array.indexOf(obj, start)  
  for (var i = (start || 0), j = array.length; i < j; i++) {
     if (array[i] === obj) { return i; }
  }
  return -1;
}


o_O.expression = function(text) {
  o_O.expression.last = text      // useful for catching syntax errors if this breaks
  return new Function('o_O', 'with(this) { { return (' + text + ')} } ')
}


/*
 * calculates the dependencies
 * calls the callback with the result
 * if running fn returns a function - nothing more happens
 * otherwise the callback is called with the function result everytime a dependency changes
 */

o_O.bindFunction = function(fn, callback) {
  var deps = o_O.dependencies(fn)
  var result = o_O.dependencies.lastResult
  var isEvent = typeof result == 'function'
  callback(result)
  
  // if this is an event watch for changes and reapply
  if(!isEvent) {
    forEach(deps, function(dep) {
      dep.on('set', function(value) {
        callback(fn())
      })
    })
  }
}


o_O.bindElementToRule = function(el, attr, expr, context) {
  var expression = o_O.expression(expr)
  
  var trigger = function() {
    return expression.call(context, o_O.helpers)
  }

  o_O.bindFunction(trigger, function(x) {
    var y = typeof x == 'function' && !o_O.property.is(x)
          ? function(e) { return x.call(context, e) }
          : x      


    if($.fn[attr]) {
      return $(el)[attr](y)
    } 
    
    return o_O.bindings[attr].call(context, y, $(el))
  })
  
}


function map(array, fn) {
  var ret = []
  for(var i=0; i<array.length;i++) ret.push(fn(array[i], i))
  return ret
}

function extractRules  (str) {
  var rules = trim(str).split(";")
  var ret = []
  for(var i=0; i <rules.length; i++) {
    var rule = rules[i]
    rule = trim(rule)
    if(!rule) continue // for trailing ;
    var bits = map(trim(rule).split(":"), trim)
    var attr = trim(bits.shift())
    var param = trim(bits.join(":"))
    
    ret.push([attr, param])
  }
  return ret
}

o_O.bind = function(context, dom) {
  var $el = $(dom)
  context.el = $el[0]
  
  function bind(el, k, v) {
    var $$ = $(el)
    
    var rules = extractRules($$.attr("bind"))

    for(var i=0; i <rules.length; i++) {
      var rule = rules[i]
      o_O.bindElementToRule($$, rule[0], rule[1], context)
    }
    $$.attr("bind",null)
  }
  
  //  lets do foreach first
  $(dom).filter("[bind^=foreach]").each(function(k, v) {
    bind(this, k, v)
  })

  $(dom).find("[bind^=foreach]").each(function(k, v) {
    bind(this, k, v)
  })

  $(dom).filter("[bind]").each(function(k, v) {
    bind(this, k, v)
  })
    
  $(dom).find("[bind]").each(function(k, v) {
    bind(this, k, v)
  })
  
}


// converts a DOM event from an element with a value into it's value
// useful for setting properties based on form events
o_O.helpers = {}

o_O.helpers.value = function(fn) {
  return function(e) { 
    return fn( $(e.currentTarget).val(), e) 
  }
}



/*              _                    _     _           _ _                 
  ___ _   _ ___| |_ ___  _ __ ___   | |__ (_)_ __   __| (_)_ __   __ _ ___ 
 / __| | | / __| __/ _ \| '_ ` _ \  | '_ \| | '_ \ / _` | | '_ \ / _` / __|
| (__| |_| \__ \ || (_) | | | | | | | |_) | | | | | (_| | | | | | (_| \__ \
 \___|\__,_|___/\__\___/|_| |_| |_| |_.__/|_|_| |_|\__,_|_|_| |_|\__, |___/
                                                                 |___/       */

/** 
 *  Override proxy methods to $
 *  this will be the context itself
 */

o_O.bindings = {}

/* class
 * usage: bind='class: myClass' 
 */

o_O.bindings['class'] = function(klass, $el) {
   $el.attr('class', klass)
}

/* Two-way binding to a form element
 * usage: bind='value: myProperty'
 * special cases for checkbox
 */
o_O.bindings.value = function(property, $el) {
  var self = this

  property.on('set', function(val) {
    $el.attr('type') == 'checkbox'
      ? $el.attr('checked', val) 
      : $el.val(val)
  })
  
  $el.change(function(e) {
    var checkbox = $(e.srcElement).attr('type') == 'checkbox'
    var val = checkbox ? (!!$(e.srcElement).attr('checked')) : $(e.srcElement).val()
    property(val, e)
  })
  
  property.change() // force a change
}

/*
 * set visibility depenent on val
 */

o_O.bindings.visible = function(val, $el) {
  val ? $el.show() : $el.hide()
}


o_O.bindings['if' ]= function(val, $el) {
  if(!val) $el.remove()
}

o_O.bindings['nif']= function(val, $el) {
  if(val) $el.remove()
}

o_O.bindings.options = function(options, $el) {
  var isArray = options instanceof Array
  
  $.each(options, function(key, value) { 
    var text = isArray ? value : key
    $el.append($("<option>").attr("value", value).html(text))
  })
  
}


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

/*           ____        __  _         
   _______  / / /__ ____/ /_(_)__  ___ 
  / __/ _ \/ / / -_) __/ __/ / _ \/ _ \
  \__/\___/_/_/\__/\__/\__/_/\___/_//_/     */

// TODO CHANGE THIS TO AN ARRAY? OR WHAT?!

o_O.bindings.foreach = function(collection, $root) {
  collection.render($root)
}

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
  this.each(function(o) {
    if(fn(o)) ret.push(o)
  })
  return ret
}

fn.find = function(i) {
  return this.objects[i]
}

fn.each = function(fn) {
  this.count(); // force the dependency
  for(var i in this.objects)
    fn.call(this, this.find(i))
}

fn.remove = function(o) {
  if(typeof o == 'function') {
    this.each(function(x) {
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

fn.render = function($el) {
  var template = $el.html()
  $el.html('')
  
  function render(o) {
    var html = $(template).appendTo($el)
    o_O.bind(o, html)
  }
  for(var i in this.objects)
    render(this.find(i))
  
  // add new ones
  this.on('add', render)
  this.on('remove', function(o) {
    $(o.el).remove()
  })
}


o_O.collection = function(items) {
  var col = new Collection(items)
  return col
}

}();