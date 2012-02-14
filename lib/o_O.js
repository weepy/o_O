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