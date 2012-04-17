r = o_O.router()

r.add('files/*path', function(arg) {
  $('#main').html(arg)
})

r.add(404, function(arg) {
  $('#main').html(404)
})


r.start()

