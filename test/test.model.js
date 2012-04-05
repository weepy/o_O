expect = global.expect || require('expect.js')
o_O = global.o_O || require('../o_O')

var m

describe('model', function() {
  var Person = o_O.model()
    
  it('should create a person when called with new', function() {
    expect(new Person).to.be.a(Person)
  })
  
  it('create properties for each passed property', function() {
    var person = new Person({id: 10, name: 'John', age: 50})
    expect(o_O.is(person.name)).to.be(true)
    expect(o_O.is(person.id)).to.be(true)
    expect(o_O.is(person.age)).to.be(true)
    
    expect(person.name()).to.be('John')
  })
  
  
  
  // beforeEach(function() {
  //     var M = o_O.model({
  //      age: 0,
  //      isActive: false
  //    })
  //    m = new M({
  //      age: 10,
  //      isActive: false
  //    })
  //   })
  // 
  //   it('should have a default value', function() {
  //     expect(m.age()).to.be(10)
  //   })
  // 
  //   it('should serialize non-falsy values', function() {
  //    m.isActive(true)
  //    var json = m.toJSON()
  //     expect(m.isActive()).to.be(true)
  //     expect(json.isActive).to.be(true)
  //   })
  // 
  //   it('should NOT serialize falsy values', function() {
  //    var json = m.toJSON()
  //     expect(m.isActive()).to.be(false)
  //     expect(json.isActive).to.be(undefined)
  //   })
  
})
