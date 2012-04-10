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

var slice = Array.prototype.slice

var Events = {	
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
     all = calls['all'];
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


 /*
  * Public function to return an observable property
  * sync: whether to emit changes immediately, or in the next event loop
  */


var propertyMethods = {
  incr: function (val) { return this(this.value + (val || 1)) },
  scale: function (val) { return this(this.value * (val || 1)) },
  toggle: function (val) { 
    return this(!this.value) 
  },
  change: function(fn) {
    fn
      ? this.on('set', fn)          // setup observer
      : this.emit('set', this(), this.old_val)
    return this
  },
  mirror: function(other, both) {
    other.change(function(val) {
      if(val != this.value) this(val)
    })
    other.change()
    both && other.mirror(this)
    return this
  },
  toString: function() { 
    return '<' + (this.type ? this.type + ':' : '') + this.value + '>'
  },
  timeout: 0,
  'constructor': o_O  // fake this - useful for checking
}

// Flag to indicate if we're checking dependencies
var checking_deps = false

function o_O(arg, type) { 
  var simple = typeof arg != 'function'
  
  function prop(v) {
    if(arguments.length) {
      prop.old_value = prop.value
      prop.value = simple ? v : arg(v)
      prop.emit('setsync', prop.value, prop.old_value)
      emitProperty(prop)
    } else {
      if(simple)
        checking_deps && o_O.deps.hook.emit('get', prop)   // emit to dependency checker
      else
        prop.value = arg()
    }
    return prop.value
  }
  
  if(simple) {
    prop.value = arg
    prop.dependencies = []
  }
  else {
    prop.dependencies = o_O.deps(prop) 
    each(prop.dependencies, function(dep) {
      dep.change(function() {
        emitProperty(prop)
      })
    })
  }
  
  extend(prop, Events, propertyMethods)
  arguments.length > 1 && (prop.type = type)
  return prop
}

/*
 * Simple registry which emits all property change from one event loop in the next
 */

var emitProperty = (function() {

  var list = []
  var timer = null
  function run() {
    for(var i=0; i < list.length; i++) {
      var prop = list[i]
      prop.emit('set', prop.value, prop.old_value)
    }
    for(var i=0; i < list.length; i++)
      delete list[i]._emitting

    timer = null
    list = []
  }
    
  return function (prop) {
    if(prop._emitting) return
    if(prop.timeout == null) {
      prop._emitting = true
      prop.emit('set', prop.value, prop.old_value)
      delete prop._emitting
      return
    }

    list.push(prop)
    prop._emitting = true
    timer = timer || setTimeout(run, prop.timeout)
  }
})();


/*
 *  Hook to listen to all get events
 */
o_O.deps = function(func) {
  var deps = []
  
  function add(dep) {
    if(indexOf(deps, dep) < 0 && dep != func) deps.push(dep)
  }
  
  checking_deps = true
  o_O.deps.hook.on('get', add)
  o_O.deps.lastResult = func() // run the function
  o_O.deps.hook.off('get', add)
  checking_deps = false
  
  return deps
}

o_O.deps.hook = extend({}, Events)

o_O.expression = function(text) {
  o_O.expression.last = text      // useful for catching syntax errors 
  return new Function('o_O', 'with(this) { return (' + text + '); } ')
}


/*
 * calculates the dependencies
 * calls the callback with the result
 * if running fn returns a function - nothing more happens
 * otherwise the callback is called with the function result everytime a dependency changes
 */

o_O.bindFunction = function(fn, callback) {
  var deps = o_O.deps(fn)
  var result = o_O.deps.lastResult
  var isEvent = typeof result == 'function'
  callback(result)
  
  // if this is an event watch for changes and reapply
  if(!isEvent) {
    each(deps, function(dep) {
      dep.on('set', function(value) {
        callback(fn())
      })
    })
  }
}

o_O.bindElementToRule = function(el, attr, expr, context) {
  if(attr == '"class"') attr = "class"
  
  var expression = o_O.expression(expr)
  
  var trigger = function() {
    return expression.call(context, o_O.helpers) 
  }

  o_O.bindFunction(trigger, function(x) {
    var $el = $(el),
        y = typeof x == 'function' && x.constructor == o_O
              ? function() { return x.apply(context, arguments) }
              : x

    if($.prototype[attr]) {
      if(y instanceof String) y = y.toString() // strange problem
      return $el[attr].call($el, y)
    } 
    
    var binding = o_O.bindings[attr]
    binding
      ? binding.call(context, y, $el)
      : $el.attr(attr, y)
  })
}

function extractRules(str) {
  if(!str) return []
  
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

o_O.bind = function(context, dom, recursing) {
  var $el = $(dom)
  if(!recursing) context.el = $el[0]
  
  var recurse = true
  var rules = extractRules($el.attr(o_O.bindingAttribute))
  
  for(var i=0; i <rules.length; i++) {
    var method = rules[i][0]
    var param = rules[i][1]
    if(method == 'with' || method == 'foreach') recurse = false
    o_O.bindElementToRule($el, method, param, context)
  }
  $el.attr(o_O.bindingAttribute,null)
  
  if(recurse) {
    $el.children().each(function(i, el) {
      o_O.bind(context, el, true)
    })
  }
  // if(!recursing) context.onbind && context.onbind()
}


function getTemplate($el) {
  var template = $el.data('o_O:template')
  if(template == null) {
    template = $el.html()
    $el.html('')
    $el.attr(o_O.bindingAttribute, null) // should be here?
    $el.data('o_O:template', template)
  }
  return template
}


// converts a DOM event from an element with a value into it's value
// useful for setting properties based on form events
o_O.helpers = {
  value: function(fn) {
    return function(e) { 
      return fn.call(this, $(e.currentTarget).val(), e) 
    }
  },
  position: function(fn) {
  	return function(e) {
  	  var el = e.currentTarget
  		var o = $(el).offset()
      fn.call(this, e.pageX - o.left, e.pageY - o.top, e)
  	}
  }
}


/*                                     
 _    __|_ _ ._ _  |_ o._  _|o._  _  _ 
(_|_|_> |_(_)| | | |_)|| |(_||| |(_|_> 
                                  _|    */

/** 
 *  Override proxy methods to $
 *  this will be the context itself
 */

o_O.bindings = {
  /* Two-way binding to a form element
   * usage: bind='value: myProperty'
   * special cases for checkbox
   */
  value: function(property, $el) {
    $el.change(function(e) {
      var checkbox = $(this).attr('type') == 'checkbox'
      var val = checkbox ? (!!$(this).attr('checked')) : $(this).val()
      property(val, e)
    })

    if(property.on) {
      property.on('set', function(val) {
        $el.attr('type') == 'checkbox'
          ? $el.attr('checked', val) 
          : $el.val(val)
      })
      property.change() // force a change    
    }
  },
  /*
   * set visibility depenent on val
   */
  visible: function(val, $el) {
    val ? $el.show() : $el.hide()
  },
  'if': function(context, $el) {
    var template = getTemplate($el)
    $el.html(context ? template : '')
  },
  unless: function(val, $el) {
    return o_O.bindings['if'](!val, $el)
  },
  'with': function(context, $el) {
    var template = getTemplate($el)
    $el.html(context ? template : '')
    if(context) o_O.bind(context, $el)    
  },
  options: function(options, $el) {
    var isArray = options instanceof Array
    $.each(options, function(key, value) { 
      var text = isArray ? value : key
      $el.append($("<option>").attr("value", value).html(text))
    }) 
  },
  /* 
   * Allows binding of a list of elements - expected to respond to forEach 
   */
  foreach: function(list, $el) {
    var template = getTemplate($el)
    var renderItem = list.renderItem || function(item) {
      $(template).each(function(i, elem) {
        var $$ = $(elem)
        $$.appendTo($el)
        o_O.bind(item, $$)
      })
    }

    $el.html('')
    list.forEach(function(item, index) {
      renderItem.call(list, item, $el, index)
    })

    list.bind && list.bind($el)
  },
  log: function(context, $el) {
    console.log('o_O', context, $el, this)
  },
  call: function(func, $el) {
    typeof func == 'function' && func($el)
  }
}

/*         ___   __  __           _      _ 
   ___    / _ \ |  \/  | ___   __| | ___| |
  / _ \  | | | || |\/| |/ _ \ / _` |/ _ \ |
 | (_) | | |_| || |  | | (_) | (_| |  __/ |
  \___/___\___(_)_|  |_|\___/ \__,_|\___|_|
     |_____|                               
  																							
  Model with observable properties, subclasses, evented
*/

function model(o, proto) {  
  if(!(this instanceof model)) return new model(o, proto)
    
  o = o || {}
  this.properties = []
  for(var name in o) {
    model.addProperty(this, name, o[name])
    model.observeProperty(this, name)
  }
  
  var defaults = this.constructor.defaults
  
  for(var name in defaults) {
     if(name in o) continue
     var val = defaults[name]
     model.addProperty(this, name, val)
     model.observeProperty(this, name)
   }
  
  proto && extend(this, proto)
  this.initialize.apply(this, arguments)
}

extend(model, {
  observeProperty: function(model, name) {
    model[name].on('set', function(val, old) {
      model.emit('set:' + name, model, val, old)
    })
  
    model[name].on('setsync', function(val, old) {
      if(val === old) return
      var x = {}, y = {}    
      x[name] = val
      y[name] = old
      model.emit('update', model, x, y)
    })
  },
  addProperty: function(model, name, val) {
    model[name] = o_O(val)
    model.properties.push(name)
  },
  defaults: {},
  types: {},
  extend: function(defaults, protoProps, classProps) {
    defaults = defaults || {}
    var child = inherits(this, protoProps, classProps);
    child.defaults = defaults
    child.extend = this.extend;
    if(defaults.type) model.types[defaults.type] = child
    return child;
  },
  create: function(o) {
    var type = model.types[o.type]
    if(!type) throw new Error('no such Model with type: ' + o.type)
    return new type(o)
  }
})

extend(model.prototype, Events, {
  toString: function() {
    return '#<'+(this.type ? this.type() : 'model')+'>'
  },
  initialize: function(o) {},
  valid: function() {
    return true
  },
  // update a json model of named values
  // if resultant model is invalid - it is set back to previous values
  // THIS SHOULD BE SIMPLIFIED
  update: function(o) {
    var old = {}, props = this.constructor.defaults
    for(var key in o) {
      if(key in props) {
        old[key] = this[key].value
        this[key].value = o[key]
      }
    }  
    if(this.valid()) {
      for(var key in old) {
        this[key].value = old[key]
        this[key](o[key])
      }
      this.emit('update', this, o, old)
      return old
    } 
    else {
      for(var key in old) this[key](old[key])
      return false
    }  
  },
  destroy: function() {
    // console.log('destroy', this)
    this.emit('destroy', this)
  },
  toJSON: function() {
    var json = {}
    for(var i=0; i< this.properties.length;i++) {
      var prop = this.properties[i]
      json[prop] = this[prop]()
    }
    return json
  },
  clone: function() {
    return model.create(this.toJSON())
  }
})

o_O.model = model


// model.extend = 


/*        ___
  ___    / _ \  __ _ _ __ _ __ __ _ _   _
 / _ \  | | | |/ _` | '__| '__/ _` | | | |
| (_) | | |_| | (_| | |  | | | (_| | |_| |
 \___/___\___(_)__,_|_|  |_|  \__,_|\__, |
    |_____|                         |___/   */

function array(items) {
  if(!(this instanceof array)) return new array(items)
  
  var self = this
  this.items = []
  this.count = o_O(0)
  this.length = 0
  this.count.on('setsync', function(count) {
    self.length = count 
  })
  if(items) {
    for(var i=0; i< items.length; i++)
      this.push(items[i])
  }
}

extend(array, {
  add: function (arr, o, index) {
    if(o.on && o.emit) {
      o.on('all', arr._onevent, arr)
      o.emit('add', o, arr, index)
    }else{
      arr.emit('add', o, arr, index)
    }
    arr.count.incr()
    return arr.items.length
  },
  remove: function(arr, o, index) {
    if(o.off && o.emit) {
      o.emit('remove', o, arr, index)
      o.off('all', arr._onevent, arr)
    } else {
      arr.emit('remove', o, index)
    }
    arr.count.incr(-1) //force re-binding
    return o
  },
  extend: function() {
    return inherits.apply(this, arguments)
  }
})

extend(array.prototype, Events, {
  _onevent : function(ev, o, array) {
    if ((ev == 'add' || ev == 'remove') && array != this) return
    if (ev == 'destroy') {
      this.remove(o)
    }
    this.emit.apply(this, arguments)
  },
  indexOf: function(o){
    return this.items.indexOf(o)
  },
  filter: function(fn){
    return this.items.filter(fn)
  },
  find: function(fn){
    for(var i in this.items) {
      var it = this.items[i]
      if(fn(it, i)) return it
    }
  },
  map: function(fn) {
    this.count(); // force the dependency
    var ret = []
    for(var i = 0; i < this.length; i++) {
      var result = fn.call(this, this.items[i], i)
      ret.push(result)
    }
    return ret
  },
  push: function(o) {
    return this.insert(o, this.length)
  },
  unshift: function(o) {
    return this.insert(o, 0)
  },
  pop: function(){
    return this.removeAt(this.length-1) //remove(this, this.items.pop())
  },
  shift: function(){
    return this.removeAt(0) //remove(this, this.items.shift())
  },
  at: function(index) {
    return this.items[index]
  },
  insert: function(o, index) {
    if(index < 0 || index > this.count()) return false
    this.items.splice(index, 0, o)
    array.add(this, o, index)
    return o
  },
  removeAt: function(index) {
    if(index < 0 || index > this.count()) return false
    var o = this.items[index]
    this.items.splice(index, 1)
    array.remove(this, o, index)
    return o
  },
  remove: function(o) {
    var func = 'function' === typeof o,   // what about if o is a function itself? - perhaps this should be another method ?
        items = func ? this.items.filter(o) : [o],
        index

    for(var i = 0; i < items.length; i++){
      index = this.indexOf(items[i])
      if(index !== -1) this.removeAt(index)
    }
    return func ? items : items[0]
  },
  renderItem: function(item, $el, index) {
    var $$ = $(getTemplate($el))
    if(index == this.items.length - 1)
      $el.append($$)
    else {
      var nextElem = this.at(index).el || $el.children()[index]
      $$.insertBefore(nextElem)
    }
    o_O.bind(item, $$)
  },
  bind: function($el) {
    var self = this
    this.on('add', function(item, arr, index) {
      self.renderItem(item, $el, index)
    })
    this.on('remove', this.removeElement, this)
    this.el = $el[0]
  },
  removeElement: function(item, index) {
    $(item.el || $(this.el).children()[index]).remove()
  },
  toString: function() {
    return '#<o_O.array:' + this.length + '>'
  }
})

array.prototype.each = array.prototype.forEach = array.prototype.map

o_O.array = array

// Extend a given object with all the properties in passed-in object(s).
function map(array, fn) {
  var ret = []
  for(var i=0; i<array.length;i++) ret.push(fn(array[i], i))
  return ret
}

function extend(obj) {
  var args = slice.call(arguments, 1)
  for(var i=0; i<args.length;i++) {
    var source = args[i]
    for (var prop in source)
      obj[prop] = source[prop]
  }    
  return obj
}

function each(array, action) {
  if(array.forEach) return array.forEach(action)  
  for (var i= 0, n= array.length; i<n; i++)
    if (i in array)
      action.call(null, array[i], i, array);
}

function trim(s) {
  return s.replace(/^\s+|\s+$/g, '')
}

function indexOf(array, obj, start) {
  if(array.indexOf) return array.indexOf(obj, start)  
  for (var i = (start || 0), j = array.length; i < j; i++) {
     if (array[i] === obj) { return i; }
  }
  return -1;
}

function ctor(){};

function inherits(parent, protoProps, staticProps) {
  
  function construct(a, b) {
    if(this instanceof construct)
      parent.apply(this, arguments)
    else
      return new construct(a, b)
  };
    
  var child = protoProps && protoProps.hasOwnProperty('constructor')
                ? protoProps.constructor
                : construct

  extend(child, parent)
  ctor.prototype = parent.prototype
  child.prototype = new ctor()
  if (protoProps) extend(child.prototype, protoProps);
  if (staticProps) extend(child, staticProps);
  child.prototype.constructor = child;
  child.__super__ = parent.prototype;
  return child;
};

o_O.uuid = function(len) {
  return Math.random().toString(36).slice(2)
};

// export
o_O.bindingAttribute = 'data-bind';
o_O.inherits = inherits
o_O.extend = extend
o_O.Events = Events

typeof module != 'undefined' ? module.exports = o_O : window.o_O = o_O

}();