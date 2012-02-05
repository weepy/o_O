oO = {};

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

	oO.eventize = function(o) {
		o.on = methods.on
		o.off = methods.off
		o.emit = methods.emit
		o.once = methods.once
	}
})()

oO.template = function(el) {
	
}

oO.bind = function(el, context) {
	
	$(el).find("[bind]").each(function(k, v) {
   	var $$ = $(this)
		$$.attr("bind").split(";").forEach(function (rule) {

			var bits = rule.split(":"),
	    		attr = $.trim(bits.shift()),
					param = $.trim(bits.join(":"))
	
			var deps = oO.dependencies(param, context)
		
			function run() {
				var x = oO.expression(param).call(context)
				$$[attr](x)
			}
			run()
		
			deps.forEach(function(dep) {
				dep.on('set', run)
			})
	  }) 
	})

}

oO.expression = function(expr) {
	return new Function('with(this) { return (' + expr + ')}')
}

oO.form = function(fn) {
  return function(e) { fn( $(e.srcElement).val()) }
}

oO.observer = function(value, context) {
	
  var o = function(v) {
		if(arguments.length) {
			o.value = v
			oO.observer.emit('set', o, v)
			o.emit('set', o, v)
		} else {
			oO.observer.emit('get', o)
			return o.value
		}
  }
	oO.eventize(o)
  o.value = value

  return o
}

oO.computed = function(getset, context) {
	var fn = function(value) {
		if(arguments.length) {
			fn.value = fn.getset.call(context, value)
		} else {
			fn.value = fn.getset.call(context)
			return fn.value
		}
	}
	fn.getset = getset
	
	fn.dependencies = oO.dependencies(getset)
	fn()	
	return fn
}

oO.dependencies = function(expr, context) {
	if(typeof expr == 'string') expr = oO.expression(expr)

	var deps = []
	var collect = function(dep) {
		if(deps.indexOf(dep) < 0) deps.push(dep)
	}
	oO.observer.on('get', collect)
	expr.call(context)
	oO.observer.off('get', collect)
	return deps
}

oO.eventize(oO.observer)
