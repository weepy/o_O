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