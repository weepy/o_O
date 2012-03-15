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