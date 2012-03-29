expect = global.expect || require('expect.js')
o_O = global.o_O || require('../o_O')

describe('a collection', function() {
  var col

	function atIndex(index){
		return col.objectsArray[index]
	}

  beforeEach(function() {
    col = o_O.collection()
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

		it('handles the removal of an item it doesn\'t have gracefully', function() {
			col.remove({foo: 'bar'})
			expect(col.count()).to.be(1)
			expect(col.objectsArray.length).to.be(1)
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

    it('sets id', function() {
      expect(obj.id).to.ok
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

		it('returns the removed item', function() {
			var removed = col.remove(obj)

			expect(removed).to.be(obj)
		})
  })

	describe('.objects and .objectsArray', function(){

		it('counts stay in synch when adding', function(){
			col.push({})
			col.push({})
			col.push({})

			expect(col.count()).to.be(3)
			expect(col.objectsArray.length).to.be(3)
		})

		it('counts stay in synch when deleting', function(){
			var one = {}
			var two = {}
			var three = {}
			col.push(one)
			col.push(two)
			col.push(three)
			col.remove(one)
			col.remove(two)
			col.remove(three)

			expect(col.count()).to.be(0)
			expect(col.objectsArray.length).to.be(0)
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

		it('removes an item from the front of the collection', function() {
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

		it('removes an item from the end of the collection', function() {
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

		it('adds an item to the end of the collection', function() {
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

		it('adds an item to the start of the collection', function() {
			expect(atIndex(0)).to.be(three)
			expect(atIndex(2)).to.be(one)
		})
	})

})
