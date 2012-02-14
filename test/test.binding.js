expect = global.expect || require('expect.js')
o_O = global.o_O || require('../lib/o_O')
if(typeof module != 'undefined') {
	require('../lib/eventize')
	require('../lib/property')
	require('../lib/binding')
}

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


	it('trigger when dependency is called for simple', function() {
		
		o_O.bindFunction(function() { return firstName() }, function(value) { count ++; last= value })
		expect(count).to.be(1)
		expect(last).to.be('John')
		firstName('Woah')
		expect(count).to.be(2)
		expect(last).to.be('Woah')
	})
	
	it('trigger when dependency is called for computed', function() {
		o_O.bindFunction(fullName, function(value) { count ++; last = value });
		
		expect(count).to.be(1)
		expect(last).to.be('John Smith')
		firstName('Woah')
		expect(count).to.be(2)
		expect(last).to.be('Woah Smith')
		
		secondName('Woah')
		expect(count).to.be(3)
		expect(last).to.be('Woah Woah')
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