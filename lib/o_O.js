;(function() {
/*  
                                         
                        ,ad8888ba,            FunnyFace.js     
                       d8"'    `"8b           ============
                      d8'        `8b     
 ,adPPYba,            88          88          HTML binding for Lulz 
a8"     "8a           88          88     
8b       d8           Y8,        ,8P          Elegant, flexible html binding
"8a,   ,a8"            Y8a.    .a8P           
 `"YbbdP"'              `"Y8888Y"'            Provides an easy to bind an object to a section of HTML
                                         
           888888888888                       Proxies through jQuery (or whatever $ is)
                                          
                                              Built in automatic dependency resolution makes hooking up code a dream
                                                
                                              (c) 2012 by weepy, MIT Licensed
           
 
 

 ***
 * Root element. Does nothing - maybe one day
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



/* 
 _    _         _ _           
| |__(_)_ _  __| (_)_ _  __ _ 
| '_ \ | ' \/ _` | | ' \/ _` |
|_.__/_|_||_\__,_|_|_||_\__, |
                        |___/    */

/** 
 *  Overrides for $ proxies
 */
o_O.exten$ions = {
  /* set the class
   * usage: bind='class: myClass' 
   */
  'class': function(klass) {
    $(this).attr('class', klass)
  },
  /* Two-way binding to a form element
   * usage: bind='value: myProperty'
   */
  value: function(property) {
    var self = this;
    
    property.on('set', function(val) {
      $(self).val(val)
    })
    
    $(this).change(function(e) {    
      property( $(e.srcElement).val(), e)
    })

    property.rewrite()
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

        var x = o_O.expression(param).call(context)   
        var fn = o_O.exten$ions[attr] || $$[attr]
        if(!fn) throw new Error("Could not find attr '" + attr + "' in $ or o_O.exten$ions")
        fn.call($$, x)
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


// probably don't need/want this cache
o_O.expression = function(expr) {
  return new Function('with(this) { return (' + expr + ')}')
}



// converts a DOM event from an element with a value into it's value
// useful for setting properties based on form events
o_O.val = function(fn) {
  return function(e) { fn( $(e.srcElement).val(), e) }
}


/*
                                 _         
 _ __  _ __ ___  _ __   ___ _ __| |_ _   _ 
| '_ \| '__/ _ \| '_ \ / _ \ '__| __| | | |
| |_) | | | (_) | |_) |  __/ |  | |_| |_| |
| .__/|_|  \___/| .__/ \___|_|   \__|\__, |
|_|             |_|                  |___/ 

 ******
 *  Our workhorse
 *  property returns an observable
 *  that can be set like prop(val) and got like prop()
 *  it trigger's set events
 *  it also automatically figures out it's deps on other o_O.properties
 *  a function can also be passed in for computed properties
 */

o_O.property = function(value) {
  var getset = value
  
  if(typeof value != 'function') {
    getset = function(value) {
      if(arguments.length) getset.val = value
      return getset.val
    }
    getset(value)
  }
  
  
  function prop(v) {
    if(arguments.length) {
      prop.val = getset(v)
      prop.emit('set', v, prop)
    } else {
      o_O.deps.emit('get', prop)
      return prop.val = getset()
    }
  }
  
  o_O.eventize(prop)
  prop.deps = o_O.deps(getset)
  prop.val = o_O.deps.lastResult
  prop.rewrite = function() { prop(prop())}
  prop.bindTo = function(el) {
    o_O.bind(prop, el)
    return prop
  }
  
  return prop
}


o_O.deps = function(expr, context) {
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


/*           ____        __  _         
   _______  / / /__ ____/ /_(_)__  ___ 
  / __/ _ \/ / / -_) __/ __/ / _ \/ _ \
  \__/\___/_/_/\__/\__/\__/_/\___/_//_/     */


o_O.exten$ions.foreach = function(collection) {
  collection.render(this)
}

var Collection = function(array) {
  this.objects = {}
  o_O.eventize(this) 
  if(array) {
    for(var i=0; i< array.length;i++) {
      this.add(array[i])
    }
  }
}

Collection._id = 0
Collection.genId = function() {
  ++Collection._id
  return Collection._id
}

var fn = Collection.prototype

fn.add = function(o) {
  o._id = o._id || Collection.genId()
  this.objects[o._id] = o
  this.emit('add', o)
}

fn.size = function() {
  var count = 0;
  for(var i in this.objects) count ++
  return count
}

fn.find = function(i) {
  return this.objects[i]
}
fn.each = function(fn) {
  for(var i in this.objects)
    fn.call(this, this.find(i))
}

fn.remove = function(o) {
  delete this.objects[o._id]
  this.emit('remove', o)
}

fn.render = function($el) {
  this.$ = $el
  this.template = $el.html()
  $el.html("")
  
  var self = this
  function render(o) {
    self.renderOne(o)
  }
  
  this.each(render)
  
  // add new ones
  this.on('add', render)
  this.on('remove', function(o) {
    o.$.remove()
  })
}

fn.renderOne = function(o) {
  var el = $(this.template).appendTo(this.$)
  o_O.bind(o, el)
}

fn.bindTo = function(el) {
  o_O.bind(this, el)
  return this
}

o_O.collection = function(items) {
  return new Collection(items)
}


typeof module != 'undefined' ? module.exports = o_O : window.o_O = o_O;

})();