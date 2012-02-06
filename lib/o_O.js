o_O = {};

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

o_O.template = function(el) {
	
}

o_O.bind = function(el, context) {
	var $el = $(el)
	context.el = $el[0]
	
	
	var els = $el.find("[bind]").add($el.filter("[bind]"))
	
	els.each(function(k, v) {
   	var $$ = $(this)
		$$.attr("bind").split(";").forEach(function (rule) {

			var bits = rule.split(":"),
	    		attr = $.trim(bits.shift()),
					param = $.trim(bits.join(":"))
	
			// special case for class
			if(attr == 'class') {
				attr = 'attr'
				param = '{class: ' + param + '}'
			}
			
			var deps = o_O.dependencies(param, context)
		
			function run() {
				var x = o_O.expression(param).call(context)					
				$$[attr](x)
			}
			run()
		
			deps.forEach(function(dep) {
				dep.on('set', run)
			})
	  })
		
		$$.attr("bind",null)
	})
	
	return $el
}

o_O.expression = function(expr) {
	return new Function('with(this) { return (' + expr + ')}')
}

// converts a DOM event from an element with a value into it's value
// useful for setting properties based on events
o_O.val = function(fn) {
  return function(e) { fn( $(e.srcElement).val(), e) }
}

o_O.observer = function(value, context) {
	if(typeof value == 'function') return o_O.computed(value, context)
	
  var o = function(v) {
		if(arguments.length) {
			o.value = v
			o_O.observer.emit('set', v, o)
			o.emit('set', v, o)
		} else {
			o_O.observer.emit('get', o)
			return o.value
		}
  }
	o_O.eventize(o)
  o.value = value
	o.observer = true
  return o
}

o_O.computed = function(getset, context) {
	var fn = function(value) {
		if(arguments.length) {
			fn.value = fn.getset.call(context, value)
		} else {
			fn.value = fn.getset.call(context)
			return fn.value
		}
	}
	fn.getset = getset
	
	fn.dependencies = o_O.dependencies(getset)
	fn()	
	return fn
}

o_O.dependencies = function(expr, context) {
	if(typeof expr == 'string') expr = o_O.expression(expr)

	var deps = []
	var collect = function(dep) {
		if(deps.indexOf(dep) < 0) deps.push(dep)
	}
	o_O.observer.on('get', collect)
	expr.call(context)
	o_O.observer.off('get', collect)
	return deps
}

o_O.eventize(o_O.observer)
