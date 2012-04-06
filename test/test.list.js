expect = global.expect || require('expect.js')
o_O = global.o_O || require('../o_O')

if(typeof(require) != 'undefined') require('../ideas/o_O.list')

describe('a list', function() {
  var col

  beforeEach(function() {
    col = o_O.list()
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
			col.add(obj2)

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
			var m = o_O.model({age:2})
			var eventTriggered = false
			col.on('remove', function(){
				eventTriggered = true
			})

			col.add(m)
			col.remove(m)

			expect(eventTriggered).to.be(true)
		})
  })
})
