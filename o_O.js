;(function() {
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

 ***
 * Root element. Rainy day...
 */
function o_O() {};



/*********          _   _        
 *   _____ _____ _ _| |_(_)______ 
 *  / -_) V / -_) ' \  _| |_ / -_)
 *  \___|\_/\___|_||_\__|_/__\___|     
 */
(function(exports) {
  var methods  = {
    on  : function(event, fct){
      this._events = this._events || {};
      this._events[event] = this._events[event]  || [];
      this._events[event].push(fct);
    },
    off  : function(event, fct){
      this._events = this._events || {};
      if( event in this._events === false  )  return;
      this._events[event].splice(this._events[event].indexOf(fct), 1);
    },
    once: function(event, fct) {
      var fn = function() {
        fct.apply(this, arguments)
        this.off(event, fn)
      }
      this.on(event, fn)
    },
    emit  : function(event /* , args... */){
      this._events = this._events || {};
      if( event in this._events === false  )  return;
      for(var i = 0; i < this._events[event].length; i++){
        this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1))
      }
    }
  }

  o_O.eventize = function(o) {
    o.on = methods.on
    o.off = methods.off
    o.emit = methods.emit
    o.once = methods.once
  }
})()


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

o_O.property = function(value) {
  var getset = value
  var simple = false

  if(typeof value != 'function') {
		simple = true
    getset = function get_set(value) {
      if(arguments.length) getset.val = value
      return getset.val
    }
    getset(value)
  }
  
  function property(v) {
    if(arguments.length) {
      property.val = getset(v)
      property.emit('set', v) //, prop)
    } else {
			property.val = getset() // force the read for compound
      o_O.deps.emit('get', property)
    }
		return property.val
  }
  
  o_O.eventize(property)

  property.deps = simple ? [] : o_O.deps(getset)
  property.val = simple ? value : o_O.deps.lastResult

  property.incr = function(x) {
		return property(property() + (x||1))
	}
	
	property.change = function(fn) {
		fn 
			? property.on('set', fn)   // listen for a change
			: property(property())     // trigger a change
	}
  return property
}

// Calculat dependencies of an expression
o_O.deps = function(expr, context) {
  o_O.deps.current = [expr, context]
	
	if(typeof expr == 'string') expr = o_O.expression(expr)

  var deps = []
  var collector = function(dep) {
    if(deps.indexOf(dep) < 0 && expr != dep) deps.push(dep)
  }

  // capture deps
	
  o_O.deps.on('get', collector)
  o_O.deps.lastResult = expr.call(context)
  o_O.deps.off('get', collector)
  
  return deps
}

o_O.eventize(o_O.deps)



/* 
 _    _         _ _           
| |__(_)_ _  __| (_)_ _  __ _ 
| '_ \ | ' \/ _` | | ' \/ _` |
|_.__/_|_||_\__,_|_|_||_\__, |
                        |___/    */

/** 
 *  Override proxy methods to $
 *  this will be the context itself
 */
o_O.bindings = {
  /* set the class
   * usage: bind='class: myClass' 
   */
  'class': function(klass) {
    this.$.attr('class', klass)
  },
  /* Two-way binding to a form element
   * usage: bind='value: myProperty'
   * special cases for checkbox
   */
  value: function(property, $el) {
    var self = this
		
    property.on('set', function(val) {
			var checkbox = self.$.attr('type') == 'checkbox'
			
      checkbox
				? self.$.val(val)
				: self.$.attr('checked', val) 
    })
    
    this.$.change(function(e) {
			var checkbox = $(e.srcElement).attr('type') == 'checkbox'
      var val = checkbox ? $(e.srcElement).attr('checked') : $(e.srcElement).val()
			property(val, e)
    })

    property.change() // force a change
  }
}

function trim(s) {
  return s.replace(/^\s+|\s+$/g, '')
}

o_O.bind = function(context, el) {
  var $el = $(el)
  context.el = $el[0]
  context.$ = $el
  
  function bind(k, v) {
    var $$ = $(this)
		
    var rules = trim($$.attr("bind")).split(";")

    rules.forEach(function(rule) {
      rule = trim(rule)
      if(!rule) return // for trailing ;

      var bits = trim(rule).split(":").map(trim)
      var attr = trim(bits.shift())
      var param = trim(bits.join(":"))
      
      var deps = o_O.deps(param, context)
        
      function run() {
				// context.$ = $$
        var x = o_O.expression(param).call(context)   
				var binding 
       	if(binding = o_O.bindings[attr]) {
					binding.call(context, x, $$)
				}
				else if(binding = $$[attr]) {
					if(typeof x == 'function')
						x = bindContext(x, context, $$) // since it must be some kind of event type
					$$[attr].call($$, x)
				}
				else throw new Error("Could not find attr '" + attr + "' in $ or o_O.bindings")
      }
      
      run()
      
      deps.forEach(function(dep) {
        dep.on('set', run)
      })
    })
    
    $$.attr("bind",null)
  }
  
  //	lets do foreach first
	$el.filter("[bind^=foreach]").each(function(k, v) {
    bind.call(this, k, v)
  })

	$el.find("[bind^=foreach]").each(function(k, v) {
    bind.call(this, k, v)
  })

  $el.filter("[bind]").each(function(k, v) {
    bind.call(this, k, v)
  })
    
  $el.find("[bind]").each(function(k, v) {
    bind.call(this, k, v)
  })
  
  return $el
}

function bindContext(fn, self) {
	return function() {
		fn.apply(self, arguments)
	}
}

o_O.options = {
	bindAttr: 'bind',
	debug: true
}

o_O.expression = function(text) {
	o_O.expression.last = text      // useful for catching syntax errors if this breaks
  return new Function('with(this) { return (' + text + ')}')
}


// converts a DOM event from an element with a value into it's value
// useful for setting properties based on form events
o_O.val = function(fn) {
  return function(e) { fn( $(e.srcElement).val(), e) }
}




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
	
	this._id = 0
	
  o_O.eventize(this) 
  if(array) {
    for(var i=0; i< array.length;i++) {
      this.add(array[i])
    }
  }
}

var fn = Collection.prototype

fn.genId = function() {
  return ++this._id
}

fn.add = function(o) {
  o._id = o._id || this.genId()
  this.objects[o._id] = o
	o.parent = this
  this.emit('add', o)
  
  var collection = this
  
  // emit change events for children
  for(var i in o) {
    var prop = o[i]
    if(prop.emit && prop.change) {
      (function(prop, i) {
        prop.change(function() {
          collection.emit('change:'+i, o, o[i])
        })
      })(prop, i)
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
		delete this.objects[o._id]
		this.count.incr(-1)
		delete o.parent
		delete o._id
	  this.emit('remove', o)
	}

}

fn.render = function($el) {
  this.$ = $el
  var template = $el.html()
  $el.html("")
  
	// it would more efficient nice? if we could just bind this once and have an update binding method ?
	// need to test if that's necessary
  function render(o) {
    var html = $(template).appendTo($el)
	  o_O.bind(o, html)
  }
  for(var i in this.objects)
    render(this.find(i))
  
  // add new ones
  this.on('add', render)
  this.on('remove', function(o) {
    o.$.remove()
  })
}


o_O.collection = function(items) {
  var col = new Collection(items)
	return col
}


typeof module != 'undefined' ? module.exports = o_O : window.o_O = o_O;

})();