expect = global.expect || require('expect.js')
o_O = global.o_O || require('../o_O')


global.forEach = function(array, action) {
  if(array.forEach) return array.forEach(action)  
  for (var i= 0, n= array.length; i<n; i++)
    if (i in array)
      action.call(null, array[i], i, array);
}

var fullName, firstName, secondName, count
var last = null

describe('bindFunction for non-function returns', function() {
  beforeEach(function() {
    firstName = o_O.property('John')
    secondName = o_O.property('Smith')
    fullName = o_O.property(function() {
      return firstName() + " " + secondName() 
    })
    count = 0
    last = null
    delete o_O.__deps_hook._events
  })


  it('trigger when dependency is called for simple', function(done) {
    
    o_O.bindFunction(function() { return firstName() }, function(value) { count ++; last= value })
    expect(count).to.be(1)
    
    expect(last).to.be('John')
    firstName('Woah')
    
    setTimeout(function() {
      expect(count).to.be(2)
      expect(last).to.be('Woah')
      done()
    }, 0)

  })
  
  it('trigger when dependency is called for computed', function(done) {
    o_O.bindFunction(fullName, function(value) { count ++; last = value });
    
    expect(count).to.be(1)
    expect(last).to.be('John Smith')
    firstName('Woah')
    
    
    
    setTimeout(function() {
      expect(count).to.be(2)
      
      secondName('Woah')
      expect(last).to.be('Woah Smith')
      
      setTimeout(function() {
        expect(count).to.be(3)
        expect(last).to.be('Woah Woah')
        done()
      }, 0)
      
    }, 0)
    

    

  })
  
  
})

var nameBindingFunction
describe('bindFunction for function returns', function() {
  beforeEach(function() {
    nameBindingFunction = function() {
      firstName = o_O.property('John')
      return function() {}
    }
    count = 0
    last = null
    delete o_O.__deps_hook._events
  })


  it('dont trigger when dependency is called for simple', function() {
    o_O.bindFunction(nameBindingFunction, function(value) { count ++; last= value })
    
    expect(count).to.be(1)
    expect(last).to.be.a(Function)    
    firstName('Woah')
    expect(count).to.be(1)
    expect(last).to.be.a(Function)
  })
  
})