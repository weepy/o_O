expect = global.expect || require('expect.js')
o_O = global.o_O || require('../o_O')

describe('a collection', function() {
  var col

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
      col.add(obj)
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
			col.add(obj2)

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
  })

})
