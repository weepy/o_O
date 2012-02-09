expect = global.expect || require('expect.js')
o_O = global.o_O || require('../o_O')


describe('property dependencies', function() {
	
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


	describe('for simple properties', function() {
		it('should be empty', function() {
			expect(firstName.deps).to.be.empty()
		})
		
		it('should emit when got', function(done) {
			var count = 0
			o_O.deps.on('get', function() {
				count++
			})
			firstName()
			expect(count).to.be(1)
			done()
		})
		
		
	})
	
	describe('for compound properties', function() {
		it('are calculable', function() {	
			var deps = o_O.deps(fullName)
			expect(deps).to.have.length(2)
		})
	})
	
	describe('for functions that call o_O.property', function() {
		it('are calculable', function() {	
			var deps = o_O.deps(function() {
				return firstName() + " " + secondName()
			})
			expect(deps).to.have.length(2)
		})
	})
	
	
	
	describe('recalulating', function() {
		
		it('works ok', function() {
			firstName("Bob")
			expect(fullName()).to.be('Bob Smith')
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
