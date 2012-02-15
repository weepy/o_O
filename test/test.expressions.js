expect = global.expect || require('expect.js')
o_O = global.o_O || require('../lib/o_O')
if(typeof module != 'undefined') {
  require('../lib/binding')
  // require('../lib/property')
}


global.one = function() { return 1 } 

describe('expressions', function() {
  
  it('should work with various strings', function() {
    var red = o_O.expression('"red"')
    expect(red()).to.be("red")
    
    var x = o_O.expression('one()')
    expect( x()).to.be(1)  
  })
  
  it('work with context', function() {
    
    var red = o_O.expression('red')
    
    expect(red.call({red: 'green'})).to.be('green')
    
  })
  
})