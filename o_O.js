!function() {

 /*                                         	HTML binding for Lulz 
                        ,ad8888ba,            
                       d8"'    `"8b           Power of KnockoutJS, with the agility of Backbone
                      d8'        `8b     
 ,adPPYba,            88          88          Elegantly binds objects to HTML
a8"     "8a           88          88     
8b       d8           Y8,        ,8P          Proxies through jQuery (or whatever $ is)
"8a,   ,a8"            Y8a.    .a8P           
 `"YbbdP"'              `"Y8888Y"'            Automatic dependency resolution
                                         
           888888888888                       Plays well with others
							
																							(c) 2012 by Jonah Fox (weepy), MIT Licensed */



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


o_O.uniqueId = function() {
  var id = ++o_O.uniqueId.id;
  var prefix = o_O.uniqueId.prefix 
  return prefix ? prefix + id : id;
}
o_O.uniqueId.id = 0


/* * * * * * * * *   _   _        
 *   _____ _____ _ _| |_(_)______ 
 *  / -_) V / -_) ' \  _| |_ / -_)
 *  \___|\_/\___|_||_\__|_/__\___|     
 *
 * adapted from backbone */

!function() {

var slice = Array.prototype.slice

var methods = {	
 /*
	* Create an immutable callback list, allowing traversal during modification. The tail is an empty object that will always be used as the next node.
	* */
	on: function(events, callback, context) {
	  var ev;
	  events = events.split(/\s+/);
	  var calls = this._callbacks || (this._callbacks = {});
	  while (ev = events.shift()) {

	    var list  = calls[ev] || (calls[ev] = {});
	    var tail = list.tail || (list.tail = list.next = {});
	    tail.callback = callback;
	    tail.context = context;
	    list.tail = tail.next = {};
	  }
	  return this;
	},

 /* 
 	* Remove one or many callbacks. If context is null, removes all callbacks with that function. 
  * If callback is null, removes all callbacks for the event. 
	* If ev is null, removes all bound callbacks for all events.
	* */
	off: function(events, callback, context) {
	  var ev, calls, node;
	  if (!events) {
	    delete this._callbacks;
	  } else if (calls = this._callbacks) {
	    events = events.split(/\s+/);
	    while (ev = events.shift()) {
	      node = calls[ev];
	      delete calls[ev];
	      if (!callback || !node) continue;

	    	// Create a new list, omitting the indicated event/context pairs.

	      while ((node = node.next) && node.next) {
	        if (node.callback === callback &&
	          (!context || node.context === context)) continue;
	        this.on(ev, node.callback, node.context);
	      }
	    }
	  }
	  return this;
	},
 /*
  * Trigger an event, firing all bound callbacks. Callbacks are passed the same arguments as emit is, apart from the event name. 
  * Listening for "*" passes the true event name as the first argument.
  * */
  emit: function(events) {
    var event, node, calls, tail, args, all, rest;
    if (!(calls = this._callbacks)) return this;
    all = calls['*'];
    (events = events.split(/\s+/)).push(null);

    // Save references to the current heads & tails.
    while (event = events.shift()) {
      if (all) events.push({next: all.next, tail: all.tail, event: event});
      if (!(node = calls[event])) continue;
      events.push({next: node.next, tail: node.tail});
    }

    //Traverse each list, stopping when the saved tail is reached.

    rest = slice.call(arguments, 1);
    while (node = events.pop()) {
      tail = node.tail;
      args = node.event ? [node.event].concat(rest) : rest;
      while ((node = node.next) !== tail) {
        node.callback.apply(node.context || this, args);
      }
    }
    return this;
  }
}

o_O.eventize = function(obj) {
  for (var prop in methods)
    obj[prop] = methods[prop]
  return obj
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
  o_O.expression.last = text      // useful for catching syntax errors 
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
          ? function() { return x.apply(context, arguments)}
          : x

    if($.fn[attr]) {
      if(y instanceof String) y = y.toString() // strange problem
      return $(el)[attr].call($(el), y)
    } 
    
    return o_O.bindings[attr].call(context, y, $(el))
  })
}

function map(array, fn) {
  var ret = []
  for(var i=0; i<array.length;i++) ret.push(fn(array[i], i))
  return ret
}

function extractRules(str) {
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
    for(var i=0; i <rules.length; i++)
      o_O.bindElementToRule($$, rules[i][0], rules[i][1], context)
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
  
  context.onbind && context.onbind()
}


// converts a DOM event from an element with a value into it's value
// useful for setting properties based on form events
o_O.helpers = {}

o_O.helpers.value = function(fn) {
  return function(e) { 
    return fn.call(this, $(e.currentTarget).val(), e) 
  }
}

// helper functions
o_O.helpers.mousepos = function(fn) {
	return function(e) {
	  var el = e.currentTarget
		var o = $(el).offset()
    fn.call(this, e.pageX - o.left, e.pageY - o.top, e)
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
  property.on('set', function(val) {
    $el.attr('type') == 'checkbox'
      ? $el.attr('checked', val) 
      : $el.val(val)
  })
  
  $el.change(function(e) {
    var checkbox = $(this).attr('type') == 'checkbox'
    var val = checkbox ? (!!$(this).attr('checked')) : $(this).val()
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

o_O.bindings['if']= function(val, $el) {
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


/* Allows binding of a list of elements - expected to respond to forEach */

o_O.bindings.foreach = function(list, $el) {
  var template = $el.html()
  $el.html('')
  $el.data('o_O:template', template)

  var render = list.render || function(item) {
    var html = $(template).appendTo($el)
    o_O.bind(item, html)
  }

  list.forEach(function(item, index) {
    render(item, $el)
  })
  
  if(list.bind) {
    list.bind($el)
  }  
}




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

o_O.collection = Collection


}();