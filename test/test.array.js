expect = global.expect || require('expect.js')
o_O = global.o_O || require('../o_O')

describe('an array', function() {
  var arr

  beforeEach(function() {
    arr = o_O.array()
  })

  it('has a count of 0', function() {
    expect(arr.count()).to.be(0)
  })

  describe('length', function() {
    
    it('has a length of 0', function() {
      expect(arr.length).to.be(0)
    })
    
    it('increments after adding items', function() {
      expect(arr.length).to.be(0)
      arr.push({})
      expect(arr.count()).to.be(1)
      expect(arr.length).to.be(1)
      arr.unshift("xqqweq")
      expect(arr.length).to.be(2)
      arr.insert(function() {}, 1)
      expect(arr.length).to.be(3)
    })
    
    it('decrements after adding items', function() {
      arr.push({})
      arr.push({})
      arr.push({})
      
      expect(arr.length).to.be(3)
      arr.pop()
      expect(arr.length).to.be(2)
      arr.shift()
      expect(arr.length).to.be(1)
      arr.removeAt(0)
      expect(arr.length).to.be(0)
    })
    
  })
  
  describe('adding/removing', function() {
    var obj
    beforeEach(function() {
      obj = {}
      arr.push(obj)
    })

		it('has a count of 1', function() {
			expect(arr.count()).to.be(1)
		})

		it('handles the removal of an item it doesn\'t have gracefully', function() {
			arr.remove({foo: 'bar'})
			expect(arr.count()).to.be(1)
		})

    it('increases count after add', function() {
      expect(arr.count()).to.be(1)
    })

		it('triggers the *add* event after add', function() {
			var eventTriggered = false
			arr.on('add', function(){
				eventTriggered = true
			})

			var obj2 = {}
			arr.push(obj2)

			expect(eventTriggered).to.be(true)

			// cleanup
			arr.remove(obj2)
		})

    it('decreases count after remove', function() {
      arr.remove(obj)
      expect(arr.count()).to.be(0)
    })

		it('triggers the *remove* event after remove', function() {
			var eventTriggered = false
			arr.on('remove', function(){
				eventTriggered = true
			})

			arr.remove(obj)

			expect(eventTriggered).to.be(true)
		})

		it('triggers the *remove* event after remove (on model)', function() {
      // var M = ({age: 1})
			var m = o_O.model({age:2})
			var eventTriggered = false
			arr.on('remove', function(){
				eventTriggered = true
			})

			arr.push(m)
			arr.remove(m)

			expect(eventTriggered).to.be(true)
		})

		it('can add the same model more than once', function() {
			var m = o_O.model({age: 2})

			arr.pop()
			arr.push(m)
			arr.push(m)
			arr.push(m)
			arr.push(m)
			arr.push(m)

			expect(arr.count()).to.be(5)
		})

		it('returns the removed item', function() {
			var removed = arr.remove(obj)

			expect(removed).to.be(obj)
		})
  })

	describe('shift', function(){
		var one = {one: 1}
		var two = {two: 2}
		var three = {three: 3}

		beforeEach(function() {
			arr.push(one)
			arr.push(two)
			arr.push(three)
		})

		it('decrements the count', function() {
			arr.shift()
			expect(arr.count()).to.be(2)
		})

		it('removes an item from the front of the array', function() {
			var removed = arr.shift()
			expect(removed).to.be(one)
		})
	})

	describe('pop', function(){
		var one = {one: 1}
		var two = {two: 2}
		var three = {three: 3}

		beforeEach(function() {
			arr.push(one)
			arr.push(two)
			arr.push(three)
		})

		it('decrements the count', function() {
			arr.pop()

			expect(arr.count()).to.be(2)
		})

		it('removes an item from the end of the array', function() {
			var removed = arr.pop()

			expect(removed).to.be(three)
		})
	})

	describe('push', function(){
		var one = {one: 1}
		var two = {two: 2}
		var three = {three: 3}

		beforeEach(function() {
			arr.push(one)
			arr.push(two)
			arr.push(three)
		})

		it('increments the count', function() {
			expect(arr.count()).to.be(3)
		})

		it('adds an item to the end of the array', function() {
			expect(arr.at(0)).to.be(one)
			expect(arr.at(2)).to.be(three)
		})
	})

	describe('unshift', function(){
		var one = {one: 1}
		var two = {two: 2}
		var three = {three: 3}

		beforeEach(function() {
			arr.unshift(one)
			arr.unshift(two)
			arr.unshift(three)
		})

		it('increments the count', function() {
			expect(arr.count()).to.be(3)
		})

		it('adds an item to the start of the array', function() {
			expect(arr.at(0)).to.be(three)
			expect(arr.at(2)).to.be(one)
		})
	})
	
	describe('insertAt', function(){
		var one = {one: 1}
		var two = {two: 2}
		var three = {three: 3}

		beforeEach(function() {
			arr.insert(one, 0)
			arr.insert(two, 1)
		})

		it('increments the count', function() {
			expect(arr.count()).to.be(2)
		})

		it('adds an item to the start of the array', function() {
			expect(arr.at(0)).to.be(one)
			expect(arr.at(1)).to.be(two)
		})
		
		it('adds an item to the end of the array', function() {
			arr.insert(three, 2)
			expect(arr.at(2)).to.be(three)
		})
		
		
		it('fails if inserting to invalid place', function() {
			expect(arr.insert({}, -1)).to.be(false)
			expect(arr.insert({}, 4)).to.be(false)
			expect(arr.count()).to.be(2)
		})
		
		
	})
	
	describe('removeAt', function(){
		var one = {one: 1}
		var two = {two: 2}
		var three = {three: 3}

		beforeEach(function() {
			arr.insert(one, 0)
			arr.insert(two, 1)
			arr.insert(three, 2)
		})

		it('decrements the count', function() {
		  arr.removeAt(0)
			expect(arr.count()).to.be(2)
		})

		it('removes the item to the start of the array', function() {
		  arr.removeAt(0)
			expect(arr.at(0)).to.be(two)
		})
		
		it('removes the item to the start of the array', function() {
		  arr.removeAt(1)
			expect(arr.at(1)).to.be(three)
		})
		
		it('fails if removing from invalid place', function() {
			expect(arr.removeAt(-1)).to.be(false)
		})
		
	})
	
	describe('toJSON', function(){
		var one = {one: 1}
		var two = {two: 2}
		var three = o_O.model({three: 3})

		beforeEach(function() {
			arr.insert(one, 0)
			arr.insert(two, 1)
			arr.insert(three, 2)
		})

		it('is as expected', function() {
      expect(arr.toJSON()).to.eql([
        {one:1},
        {two: 2},
        {three: 3}
      ])
		})


	})
	
	
	
})
