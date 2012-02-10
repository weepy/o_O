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
		
		it('sets id', function() {
			expect(obj.id).to.be(1)
		})
		
		
		it('decreases count after remove', function() {
			col.remove(obj)
			expect(col.count()).to.be(0)
		})
		
		it('deletes id', function() {
			col.remove(obj)
			expect(obj.id).to.be(undefined)
		})
			
	})


})

