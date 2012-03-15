/*              _                    _     _           _ _                 
  ___ _   _ ___| |_ ___  _ __ ___   | |__ (_)_ __   __| (_)_ __   __ _ ___ 
 / __| | | / __| __/ _ \| '_ ` _ \  | '_ \| | '_ \ / _` | | '_ \ / _` / __|
| (__| |_| \__ \ || (_) | | | | | | | |_) | | | | | (_| | | | | | (_| \__ \
 \___|\__,_|___/\__\___/|_| |_| |_| |_.__/|_|_| |_|\__,_|_|_| |_|\__, |___/
                                                                 |___/       */

/** 
 *  Override proxy methods to $
 *  this will be the context itself
 */

o_O.bindings = {}

/* class
 * usage: bind='class: myClass' 
 */

o_O.bindings['class'] = function(klass, $el) {
   $el.attr('class', klass)
}

/* class
 * usage: bind='href: myUrl()' 
 */

o_O.bindings['attr'] = function(attr, $el) {
   $el.attr(attr.key, attr.value)
}

/* Two-way binding to a form element
 * usage: bind='value: myProperty'
 * special cases for checkbox
 */
o_O.bindings.value = function(property, $el) {
  property.on('set', function(val) {
    $el.attr('type') == 'checkbox'
      ? $el.attr('checked', val) 
      : $el.val(val)
  })
  
  $el.change(function(e) {
    var checkbox = $(this).attr('type') == 'checkbox'
    var val = checkbox ? (!!$(this).attr('checked')) : $(this).val()
    property(val, e)
  })
  
  property.change() // force a change
}

/*
 * set visibility depenent on val
 */

o_O.bindings.visible = function(val, $el) {
  val ? $el.show() : $el.hide()
}

o_O.bindings['if']= function(val, $el) {
  if(!val) $el.remove()
}

o_O.bindings['nif']= function(val, $el) {
  if(val) $el.remove()
}

o_O.bindings.options = function(options, $el) {
  var isArray = options instanceof Array
  
  $.each(options, function(key, value) { 
    var text = isArray ? value : key
    $el.append($("<option>").attr("value", value).html(text))
  })
  
}


/* Allows binding of a list of elements - expected to respond to forEach */

o_O.bindings.foreach = function(list, $el) {
  var template = $el.html()
  $el.html('')
  $el.data('o_O:template', template)

  var render = list.render || function(item) {
    var html = $(template).appendTo($el)
    o_O.bind(item, html)
  }

  list.forEach(function(item, index) {
    render(item, $el)
  })
  
  if(list.bind) {
    list.bind($el)
  }  
}

