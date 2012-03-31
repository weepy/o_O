expect = global.expect || require('expect.js')
o_O = global.o_O || require('../o_O')

var m

describe('model', function() {
  beforeEach(function() {
    var M = o_O.model({
			age: 0,
			isActive: false
	  })
		m = new M({
			age: 10,
			isActive: false
		})
  })

  it('should have a default value', function() {
    expect(m.age()).to.be(10)
  })

  it('should serialize non-falsy values', function() {
		m.isActive(true)
		var json = m.toJSON()
    expect(m.isActive()).to.be(true)
    expect(json.isActive).to.be(true)
  })

  it('should NOT serialize falsy values', function() {
		var json = m.toJSON()
    expect(m.isActive()).to.be(false)
    expect(json.isActive).to.be(undefined)
  })
})
