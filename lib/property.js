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

// simple variable to indicate if we're checking dependencies
var checking = false
/*
 * Simple property ...
 */
function simple(defaultValue) {
	
	function prop(v) {
		if(arguments.length) {
			prop.value = v
			prop.emit('set', prop.value)
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
			prop.value = getset(v)
			prop.emit('set', prop.value)
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
