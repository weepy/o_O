expect = global.expect || require('expect.js')
o_O = global.o_O || require('../o_O')

describe('an array', function() {
  var col

	function atIndex(index){
		return col.objects[index]
	}

  beforeEach(function() {
    col = o_O.array()
  })

  it('has a count of 0', function() {
    expect(col.count()).to.be(0)
  })

  describe('adding/removing', function() {
    var obj
    beforeEach(function() {
      obj = {}
      col.push(obj)
    })

		it('has a count of 1', function() {
			expect(col.count()).to.be(1)
		})

		it('handles the removal of an item it doesn\'t have gracefully', function() {
			col.remove({foo: 'bar'})
			expect(col.count()).to.be(1)
		})

    it('increases count after add', function() {
      expect(col.count()).to.be(1)
    })

		it('triggers the *add* event after add', function() {
			var eventTriggered = false
			col.on('add', function(){
				eventTriggered = true
			})

			var obj2 = {}
			col.push(obj2)

			expect(eventTriggered).to.be(true)

			// cleanup
			col.remove(obj2)
		})

    it('decreases count after remove', function() {
      col.remove(obj)
      expect(col.count()).to.be(0)
    })

		it('triggers the *remove* event after remove', function() {
			var eventTriggered = false
			col.on('remove', function(){
				eventTriggered = true
			})

			col.remove(obj)

			expect(eventTriggered).to.be(true)
		})

		it('triggers the *remove* event after remove (on model)', function() {
			var M = o_O.model({age: 1})
			var m = new M({age:2})
			var eventTriggered = false
			col.on('remove', function(){
				eventTriggered = true
			})

			col.push(m)
			col.remove(m)

			expect(eventTriggered).to.be(true)
		})

		it('can add the same model more than once', function() {
			var M = o_O.model({age: 1})
			var m = new M({age: 2})

			col.pop()
			col.push(m)
			col.push(m)
			col.push(m)
			col.push(m)
			col.push(m)

			expect(col.count()).to.be(5)
		})

		it('returns the removed item', function() {
			var removed = col.remove(obj)

			expect(removed).to.be(obj)
		})
  })

	describe('shift', function(){
		var one = {one: 1}
		var two = {two: 2}
		var three = {three: 3}

		beforeEach(function() {
			col.push(one)
			col.push(two)
			col.push(three)
		})

		it('decrements the count', function() {
			col.shift()
			expect(col.count()).to.be(2)
		})

		it('removes an item from the front of the array', function() {
			var removed = col.shift()
			expect(removed).to.be(one)
		})
	})

	describe('pop', function(){
		var one = {one: 1}
		var two = {two: 2}
		var three = {three: 3}

		beforeEach(function() {
			col.push(one)
			col.push(two)
			col.push(three)
		})

		it('decrements the count', function() {
			col.pop()

			expect(col.count()).to.be(2)
		})

		it('removes an item from the end of the array', function() {
			var removed = col.pop()

			expect(removed).to.be(three)
		})
	})

	describe('push', function(){
		var one = {one: 1}
		var two = {two: 2}
		var three = {three: 3}

		beforeEach(function() {
			col.push(one)
			col.push(two)
			col.push(three)
		})

		it('increments the count', function() {
			expect(col.count()).to.be(3)
		})

		it('adds an item to the end of the array', function() {
			expect(atIndex(0)).to.be(one)
			expect(atIndex(2)).to.be(three)
		})
	})

	describe('unshift', function(){
		var one = {one: 1}
		var two = {two: 2}
		var three = {three: 3}

		beforeEach(function() {
			col.unshift(one)
			col.unshift(two)
			col.unshift(three)
		})

		it('increments the count', function() {
			expect(col.count()).to.be(3)
		})

		it('adds an item to the start of the array', function() {
			expect(atIndex(0)).to.be(three)
			expect(atIndex(2)).to.be(one)
		})
	})
})
