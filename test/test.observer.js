var expect = require('expect.js')
var observer = require('../lib/o_O').observer


describe('simple observer', function() {
	var firstName
	
	beforeEach(function() {
		firstName = observer('John')
	})
	
	describe('getting', function() {
		it('gets ok', function() {
			expect(firstName()).to.be('John')
		})
		
		it('emits a get on the observer', function(done) {
			var x = observer('x')
			observer.once('get', function(o) {
				expect(o).to.be(x)
				done()	
			})
			x()
		})
		
	})

	describe('setting', function() {
		it('sets ok', function() {
			var firstName = observer('John')
			firstName('Bob')
			expect(firstName()).to.be('Bob')
		})
		
		it('emits a set on the observer', function(done) {
			var xx = observer('x')
			observer.once('set', function(o, val) {
				expect(o).to.be(xx)
				expect(val).to.be('y')
				done()	
			})
			xx('y')
		})
	})
})





describe('computed observer', function() {
	
	var fullName, firstName, secondName
	
	beforeEach(function() {
		firstName = observer('John')
		secondName = observer('Smith')

		fullName = observer(function(name) {
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
	
	describe('observer.dependencies', function() {
		
		it('are calculable', function() {	
			var deps = observer.dependencies(fullName)
			expect(deps).to.have.length(2)
		})
		
		it('are calculable with more complex functions', function() {
			var deps = observer.dependencies(function() {
				return (secondName() + firstName()).toUpperCase().length
			})
			expect(deps).to.have.length(2)
		})
		
		// it('are calculable from strings', function() {			
		// 	function fn() {
		// 		var f = new Function('obj', ' with(obj) {({top: secondName()}) }')
		// 		f({
		// 			secondName: secondName
		// 		})
		// 	}
		// 	
		// 	expect(observer.dependencies(fn)).to.have.length(1)
		// 
		// })
		
		it('are calculable for strings', function() {			
			var o = {
				secondName: observer("John")
			}
			var deps = observer.dependencies('{top: secondName()}', o)
			expect(deps).to.have.length(1)
		})
		
		it('are calculated at the start', function() {
			expect(fullName.dependencies).to.have.length(2)
		})
		
	})
	
	// describe('dirty', function() {
	// 	it('is false at the start', function() {
	// 		expect(fullName.dirty).to.eql(false)
	// 	})
	// 	
	// 	it('is true after a dependency is set', function() {
	// 		firstName('Sally')
	// 		expect(fullName.dirty).to.eql(true)
	// 	})
	// 	
	// 	it('is false after a get', function() {
	// 		firstName('Sally')
	// 		fullName()
	// 		expect(fullName.dirty).to.eql(false)
	// 	})
	// 	
	// 	it('only calls the get function once', function () {
	// 		
	// 		var called = 0
	// 		firstName('Sally')
	// 		firstName.on('get', fn)
	// 		function fn() {
	// 			called++
	// 		}
	// 		fullName()
	// 		firstName.off('get', fn)
	// 		expect(called).to.be(1)
	// 	})
	// 	
	// 	
	// })


})
