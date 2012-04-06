expect = global.expect || require('expect.js')
o_O = global.o_O || require('../o_O')

var m

describe('model', function() {
  var Person = o_O.model
    
  it('should create a person when called with new', function() {
    expect(new Person).to.be.a(Person)
  })
  
  it('should create a person when called without new', function() {
    expect(Person()).to.be.a(Person)
  })
  
  it('create properties for each passed property', function() {
    var person = new Person({id: 10, name: 'John', age: 50})
    expect(o_O.instance(person.name)).to.be(true)
    expect(o_O.instance(person.id)).to.be(true)
    expect(o_O.instance(person.age)).to.be(true)
    
    expect(person.name()).to.be('John')
  })
  
  it('serializes to json', function() {
    var attr = {id: 10, name: 'John', age: 50}
    expect( Person(attr).toJSON() ).to.eql(attr)
  })

})

describe('extended model', function() {
  var Person = o_O.model.extend({
    type:'Person', 
    age: 10}, { 
      adult: function() {
        return this.age >= 18
      }
    })
    
  it('should create a person when called with new', function() {
    expect(new Person).to.be.a(Person)
  })
  
  it('should create a person when called without new', function() {
    expect(Person()).to.be.a(Person)
  })
  
  it('should add stuff to proto', function() {
    expect(Person.prototype.adult).to.be.ok()
    expect(Person().adult()).to.be(false)
  })
  
  it('should register the class', function() {
    expect(o_O.model.types.Person).to.eql(Person)
  })
  
  it('should be able to create', function() {
    expect(o_O.model.create({type: 'Person'})).to.be.a(Person)
  })
  
  it('create properties for each passed property', function() {
    var person = new Person({id: 10, name: 'John'})
    expect(o_O.instance(person.name)).to.be(true)
    expect(o_O.instance(person.id)).to.be(true)
    expect(o_O.instance(person.age)).to.be(true)
    
    expect(person.name()).to.be('John')
  })
  
  it('creates defaults', function() {
    var person = new Person()
    expect(person.age()).to.be(10)
  })
  
})


