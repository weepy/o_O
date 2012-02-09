var expect = require('expect.js')
var o_O = require('../lib/o_O')

require('../lib/object')

describe('create', function() {
	var Person = o_O.object('Person', {
	  name: "John"
	})
	var person
	beforeEach(function() {
		person = new Person
	})
	
  it('gets ok', function() {
  	expect(person).to.be.a(Person)
  	expect(person.name()).to.be.eql("John")
  })

	
})

