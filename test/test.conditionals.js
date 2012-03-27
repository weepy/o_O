if(typeof module != 'undefined') return

var el

describe('conditionals', function() {
  beforeEach(function() {
    if(el) $(el).remove()
    el = $("<div>", {id: 'el'}).appendTo("body")[0]    
  })
  
  describe('if', function() {
    var o = {
      prop: o_O()
    }
    
    beforeEach(function() {
      $(el)
        .attr('bind', 'if: prop()')
        .html('hello')
      
      o_O.bind(o, el)
    })
    
    it('empty if falsy', function() {
      expect($(el).html()).to.be('')
    })
    
    it('truthy: hello', function(done) {
      o.prop(true)
      setTimeout(function() {
        expect($(el).html()).to.be('hello')
        done()
      }, 0)
    })
    
  })
  
  
  describe('foreach', function() {
    var o = [
      {type: 'a', text: 'aa'},
      {type: 'a', text: '11'},
      {type: 'b', text: 'bb'},
      {type: 'b', text: '22'}
    ]
    
    beforeEach(function() {
      $(el)
        .attr('bind', 'foreach: this')
        .html('<div bind="text: text"></div>')
      
      o_O.bind(o, el)
    })
    
    it('creates a div per item', function() {
      expect($(el).children().length).to.be(4)
    })
    
    it('creates correct text', function() {
      expect($(el).html()).to.be('<div>aa</div><div>11</div><div>bb</div><div>22</div>')
    })
    
  })
  
  describe('foreach with ifs', function() {
    var o = [
      {type: 'a', text: 'aa'},
      {type: 'a', text: '11'},
      {type: 'b', text: 'bb'},
      {type: 'b', text: '22'}
    ]
    
    beforeEach(function() {
      $(el)
        .attr('bind', 'foreach: this')
        .html('<div bind="if: type==\'a\'"><i bind="text: text"></i></div>')
      
      o_O.bind(o, el)
    })
    
    it('creates a div per item ... ', function() {
      expect($(el).children().length).to.be(4)
    })
    
    it('creates correct text ... ', function() {
      expect($(el).html()).to.be('<div><i>aa</i></div><div><i>11</i></div><div></div><div></div>')
      
      // '<div><o>aa</o></div><div><o>11</o></div><div></div><div></div>' to equal '<div><i>aa</i></div><div><i>11</i></div><div></div><div></div>'
      
    })
  
  })
  
  describe('foreach with switch', function() {
    var o = [
      {type: 2}
    ]
    
    beforeEach(function() {
      $(el)
        .attr('bind', 'foreach: this')
        .html('<i bind="if: type==1">A</i><i bind="if: type==2">B</i>')
      
      o_O.bind(o, el)
    })
    
    it('creates correct text ... ', function() {
      expect($(el).html()).to.be('<i></i><i>B</i>')
    })
  
  })
  
  describe('foreach with if first ', function() {
    var o = [
      {type: 1},
      {type: 2}
      
    ]
    
    beforeEach(function() {
      $(el)
        .attr('bind', 'foreach: this')
        .html('<o bind="text: type"></o><i bind="if: type==1">A</i><i bind="if: type==2">B</i>')
      
      o_O.bind(o, el)
    })
    
    it('creates correct text ... ', function() {
      expect($(el).html()).to.be('<o>1</o><i>A</i><i></i><o>2</o><i></i><i>B</i>')
    })
  
  })  
  
})