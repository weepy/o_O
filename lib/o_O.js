;(function() {
	
function o_O() {};

(function(exports) {
	var methods	= {
		on	: function(event, fct){
			this._events = this._events || {};
			this._events[event] = this._events[event]	|| [];
			this._events[event].push(fct);
		},
		off	: function(event, fct){
			this._events = this._events || {};
			if( event in this._events === false  )	return;
			this._events[event].splice(this._events[event].indexOf(fct), 1);
		},
		once: function(event, fct) {
		  var fn = function() {
		    fct.apply(this, arguments)
		    this.off(event, fn)
		  }
		  this.on(event, fn)
		},
		emit	: function(event /* , args... */){
			this._events = this._events || {};
			if( event in this._events === false  )	return;
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

// Function.prototype.observe = function(observer) {
// 	observer.on('set', this)
// 	return this
// }


/** 
 *  o_O.bind will proxy to any method on a $ object
 *  but sometimes you want something more
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
	return s.replace(/^s+|s+$/, "") 
}

o_O.bind = function(el, context) {
  var $el = $(el)
	context.el = $el[0]
	context.$ = $el
	
	
	var els = $el.find("[bind]").add($el.filter("[bind]"))
	
	els.each(function(k, v) {
   	var $$ = $(this)
		var rules = trim($$.attr("bind")).split(";")
		for(var i=0; i< rules.length; i++) {
      var rule = rules[i]
			if(!rule) continue // for trailing ;

			var  bits = trim(rule).split(":"),
	    		attr = trim(bits.shift()),
					param = trim(bits.join(":"))
			
			var deps = o_O.deps(param, context)
		
			function run() {
				var x = o_O.expression(param).call(context)   
				var fn = $$[attr] || o_O.exten$ions[attr]
        if(!fn) throw new Error("Could not find attr '" + attr + "' in $ or o_O.exten$ions")
				fn.call($$, x)
			}
			run()
		
			deps.forEach(function(dep) {
				dep.on('set', run)
			})
	  }
		
		$$.attr("bind",null)
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

/**
 *  Our workhorse
 *  property returns an observable
 *  which can be set like prop(val) and got like prop()
 *  it trigger's set events
 *  it also automatically figures out it's deps on other o_O.properties
 *  a function can also be passed in for computed properties
 */
o_O.property = function(value) {
	if(typeof value == 'function') return o_O.computed(value)
	
	function prop(v) {    
		if(arguments.length) {
			prop.val = v
	    prop.emit('set', v, prop)
		} else {
		  o_O.deps.emit('get', prop)
			return prop.val
		}
  }

	o_O.eventize(prop)
  prop.val = value
	prop.deps = []
	prop.rewrite = function() { prop(prop()) }
  return prop
}

o_O.computed = function(getset) {
	function prop(value) {
		if(arguments.length) {
			prop.val = getset(value)
		} else {
			prop.val = getset()
			return prop.val
		}
	}
	
	o_O.eventize(prop)
	prop.deps = o_O.deps(getset)
	prop.val = o_O.deps.lastResult
	prop.rewrite = function() { prop(prop())}
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


typeof module != 'undefined' ? module.exports = o_O : window.o_O = o_O;

})();