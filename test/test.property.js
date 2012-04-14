expect = global.expect || require('expect.js')
o_O = global.o_O || require('../o_O')


var age, count = 0



function incr() { count ++ }
describe('simple property', function() {
  beforeEach(function() {
    age = o_O(10)
    count = 0
  })
  
  it('should have a default value', function() {
    expect(age()).to.be(10)
  })
  
  it('should be settable', function() {
    expect(age(20)).to.be(20)
    expect(age()).to.be(20)
  })

  it('should should have no dependencies', function() {
    expect(age.dependencies).to.be(undefined)
  })
  
  it('should emit set events', function(done) {
    age.on('set', incr)
    age(10)
    
    setTimeout(function() {
      expect(count).to.be(1)
      done()
    }, 0)
  })
  


})

var fullName, firstName, secondName, fullNameFn

describe('complex property', function() {
  beforeEach(function() {
    firstName = o_O('John')
    secondName = o_O('Smith')
    fullName = o_O(function() {
      return firstName() + " " + secondName() 
    })
    count = 0
    delete o_O.dependencies._events
  })
  
  it('should get ok', function() {
    expect(fullName()).to.be("John Smith")
  })
  
  it('should get ok after change of simple', function() {
    firstName('Bob')
    expect(fullName()).to.be("Bob Smith")
  })
  
  describe('dependencies', function() {
    
    it('should should have 2 dependencies', function() {
      var dependencies = o_O.dependencies(fullName)
      expect(dependencies).to.have.length(2)
      expect(dependencies[0]).to.be(firstName)
      expect(dependencies[1]).to.be(secondName)

    })    
  })
  
  
  describe('function dependencies', function() {
    beforeEach(function() {
      fullNameFn = function() {
        return fullName()
      }
    })
    it('should should have 3 dependencies', function() {
      var deps = o_O.dependencies(fullNameFn)
// console.log(deps[2])
      expect(deps).to.have.length(3)
      // expect(deps[0]).to.be(firstName)
      // expect(deps[1]).to.be(secondName)
      
    })
  })
  
  
})

describe('toggle', function() {  
  it('changes a value from truthy to false and falsey to true', function() {
    var x = o_O("hello")
    x.toggle()
    expect(x()).to.eql(false)
    x.toggle()
    expect(x()).to.eql(true)
  })
})

describe('incr', function() {  
  it('increases a property by 1', function() {
    var x = o_O(0)
    x.incr()
    expect(x()).to.eql(1)
  })
})

describe('scale', function() {  
  it('scales a property', function() {
    var x = o_O(2)
    x.scale(10)
    expect(x()).to.eql(20)
  })
})


describe('change', function() {
  
  it('is called when property is set', function(done) {
    var x = o_O()
    var count = 0
    x.change(function() {
      count++
    })
    x(1)
    
    setTimeout(function() {
      expect(count).to.be(1)
      done()
    }, 0)
    
  })
  
  it('is called ever time a  property is set', function(done) {
    var x = o_O()
    var count = 0
    x.change(function() {
      count++
    })
    x(1)
    x(2)
    
    setTimeout(function() {
      expect(count).to.be(2)
      expect(x()).to.be(2)
      done()
    }, 0)  
  })

  // describe('change emitter', function() {
  //   it('emits multiple changes on one go', function(done) {
  //     var x = o_O()
  //     var y = o_O()
  //     var count = 0
  //     
  //     function incr() {
  //       count++
  //     }
  // 
  //     x.change(incr)
  //     y.change(incr)
  //     x("a")
  //     y("b")
  //     
  //     expect(x._emitting).to.be.ok()
  //     expect(y._emitting).to.be.ok()
  //     expect(x()).to.be("a")
  //     expect(y()).to.be("b")
  //     
  //     setTimeout(function() {
  //       expect(count).to.be(2)
  //       
  //       expect(y._emitting).to.not.be.ok()
  //       expect(x._emitting).to.not.be.ok()
  //       done()
  //     }, 0)
  // 
  //   })
  // })
  // 
  
  
})