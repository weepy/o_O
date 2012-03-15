expect = global.expect || require('expect.js')
o_O = global.o_O || require('../o_O')


var x, count

describe('eventize', function() {
  beforeEach(function() {
    count = 0 
    x = o_O.eventize({})
    x.on('up', function(v) {
      count += v
    })

  })
  
  it('x to trigger on up', function() {
    x.emit('up', 10)
    x.emit('up', 21)
    expect(count).to.be(31)
  })
  
  it('x to not trigger on down', function() {
    x.emit('down', 21)
    expect(count).to.be(0)
  })
  
  
  it('* should trigger on any events', function() {
    x.on('*', function() {
      count++
    })
    x.emit('xx')
    x.emit('yy')
    expect(count).to.be(2)
  })
  
})