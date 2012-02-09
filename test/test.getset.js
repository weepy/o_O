expect = global.expect || require('expect.js')
o_O = global.o_O || require('../o_O')


describe('property', function() {
	var firstName
	
	beforeEach(function() {
		firstName = o_O.property('John')
	})

	describe('default', function() {
		it('gets silently ok', function() {
			expect(firstName.val).to.be('John')
		})
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
	
	describe(':compound', function() {

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


		describe('setting', function() {

			it('sets ok', function() {
				fullName('Johnny Butcher')
				expect(firstName()).to.be('Johnny')
			})		
		})

	})
	
	
})

