r = o_O.router()

r.add('files/*path', function(arg) {
  $('#main').html(arg)
})

r.add(null, function(arg) {
  $('#main').html(404)
})


r.start()

