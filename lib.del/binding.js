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
  var deps = o_O.deps(fn)
  var result = o_O.deps.lastResult
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
