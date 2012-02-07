var expect = require('expect.js')
var o_O = require('../lib/o_O')


describe('simple property', function() {
	var firstName
	
	beforeEach(function() {
		firstName = o_O.property('John')
	})
	
	describe('getting', function() {
		it('gets ok', function() {
			expect(firstName()).to.be('John')
		})
				
	})

	describe('setting', function() {
		it('sets ok', function() {
			var firstName = o_O.property('John')
			firstName('Bob')
			expect(firstName()).to.be('Bob')
		})
		

	})
})


describe('computed property', function() {
	
	var fullName, firstName, secondName
	
	beforeEach(function() {
		firstName = o_O.property('John')
		secondName = o_O.property('Smith')

		fullName = o_O.property(function(name) {
			if(!name) return firstName() + " " + secondName()
			
			var bits = name.split(" ")
			firstName(bits[0])
			secondName(bits[1])
		})
		
	})
	
	describe('getting', function() {
		
		it('gets ok', function() {
			expect(fullName()).to.be('John Smith')
		})
		
	})
	
	describe('recalulating', function() {
		
		it('works ok', function() {
			firstName("Bob")
			expect(fullName()).to.be('Bob Smith')
		})
		
	})
	
	
	
	describe('setting', function() {
		
		it('sets ok', function() {
			fullName('Johnny Butcher')
			expect(firstName()).to.be('Johnny')
		})		
	})
	
	describe('property.deps', function() {
		
		it('are calculable', function() {	
			var deps = o_O.deps(fullName)
			expect(deps).to.have.length(2)
		})
		
		it('are calculable with more complex functions', function() {
			var deps = o_O.deps(function() {
				return (secondName() + firstName()).toUpperCase().length
			})
			expect(deps).to.have.length(2)
		})
		
		it('are calculable for strings', function() {			
			var o = {
				secondName: o_O.property("John")
			}
			var deps = o_O.deps('{top: secondName()}', o)
			expect(deps).to.have.length(1)
		})
		
		it('are calculated at the start', function() {
			expect(fullName.deps).to.have.length(2)
		})
		
	})
	


})
