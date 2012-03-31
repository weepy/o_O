expect = global.expect || require('expect.js')
o_O = global.o_O || require('../o_O')

var age, count = 0
function incr() { count ++ }

describe('property emitting timeouts', function() {
  beforeEach(function() {
    age = o_O(10)
    count = 0
  })
  
  it('should emit once upon multiple sets', function(done) {
    age.on('set', incr)    
    age(10)
    age(20)
    setTimeout(function() {
      expect(count).to.be(1)
      done()
    }, 0)    
  })
  
  it('should emit syncronously when timeout is null', function(done) {
    delete age.timeout
    age.on('set', incr)    
    age(10)
    age(20)
    expect(count).to.be(2)
    done()
  })
  
  it('should in > 100ms when timeout is 100', function(done) {
    age.on('set', incr)
    age.timeout = 100
        
    age(10)
    age(20)
    
    expect(count).to.be(0)
    
    setTimeout(function() {
      expect(count).to.be(0)
      age(30)
    }, 5)
    
    setTimeout(function() {
      expect(count).to.be(1)
      done()
    }, 200)
    
    
  })
  
  

  


})
