expect = global.expect || require('expect.js')
o_O = global.o_O || require('../lib/o_O')
if(typeof module != 'undefined') {
	require('../lib/eventize')
	require('../lib/property')
}

var age, count = 0



function incr() { count ++ }
describe('simple property', function() {
	beforeEach(function() {
		age = o_O.property(10)
		count = 0
	})
	
	it('should have a default value', function() {
		expect(age()).to.be(10)
	})
	
	it('should be settable', function() {
		expect(age(20)).to.be(20)
		expect(age()).to.be(20)
	})

  it('should should have 0 dependencies', function() {
	
  	expect(age.dependencies).to.have.length(0)

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
		firstName = o_O.property('John')
		secondName = o_O.property('Smith')
		fullName = o_O.property(function() {
			return firstName() + " " + secondName() 
		})
		count = 0
		delete o_O.__deps_hook._events
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
			expect(fullName.dependencies).to.have.length(2)
			expect(fullName.dependencies[0]).to.be(firstName)
			expect(fullName.dependencies[1]).to.be(secondName)

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

			expect(deps).to.have.length(3)
			expect(deps[0]).to.be(firstName)
			expect(deps[1]).to.be(secondName)
		})
	})
	
	
})

describe('change', function() {
	
	it('is called when property is set', function(done) {
		var x = o_O.property()
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
	
	it('is called only once when property is set twice', function(done) {
		var x = o_O.property()
		var count = 0
		x.change(function() {
			count++
		})
		x(1)
		x(2)
		
		setTimeout(function() {
		  expect(count).to.be(1)
		  expect(x()).to.be(2)
		  done()
		}, 0)
		
	})
	
})