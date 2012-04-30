var el , color

if(typeof module != 'undefined') {
  console.log("\nTo run DOM tests\n  open test/mocha.html")
  return
}

describe('binding to dom element manually', function() {

  beforeEach(function() {
    if(el) $(el).remove()
    el = $("<div>", {id: 'el', html: "el"}).appendTo("body")[0]
    color = o_O("rgb(1, 1, 1)")
  })


  it('should change color with bindRuleToElement', function(done) {

    var o = {
      color: o_O("rgb(3, 3, 3)")
    }

    o_O.bindRuleToElement("css", "{color: color()}", o, el)

    o_O.nextFrame(function() {
      expect($("#el").css("color")).to.be('rgb(3, 3, 3)')

      o.color("rgb(3, 3, 4)")

       o_O.nextFrame(function() {
        expect($("#el").css("color")).to.be("rgb(3, 3, 4)")
        done()
      })
    })


  })


  it('should call callback click with bindRuleToElement', function() {
    var count = 0
    var o = {
      add: function() {
        color() // add in a dependency shouldn't make a difference
        count ++ 
      }
    }

    o_O.bindRuleToElement("click", "add", o, el)
    expect(count).to.be(0)
  
    $("#el").click()
    expect(count).to.be(1)
    $("#el").click()
    expect(count).to.be(2)
  })
  
  
  
  describe('with helpers', function() {    
    it('should read the helpers', function() {
      $("<input>", {id:'inp'}).val('hello').appendTo("body")

      expect($("#inp").val()).to.be('hello')
      
      var last = ""
      var o = {
        check: function(value) {
          last = value
        }
      }

      o_O.bindRuleToElement("click", "o_O.value(check)", o, $("#inp"))
      expect(last).to.be('')
      $("#inp").click()
      expect(last).to.be('hello')
    })
  })
  

  
  describe('custom bindings', function() {    
    it('work for setting', function(done) {
      
      o_O.bindings.color = function(val, $el) {
        $el.css("color", val)
      }
      
      o_O.bindRuleToElement("color", "'red'", null, el)
      
      o_O.nextFrame(function() {
        expect($(el).css("color")).to.be("rgb(255, 0, 0)")
        done()
      })
      
    })
    
    it('works with properties', function(done) {
      
      o_O.bindings.color = function(val, $el) {
        $el.css("color", val)
      }
      
      var o = { red: o_O('red') }
      o_O.bindRuleToElement("color", "red()", o, el)
      o_O.nextFrame(function() {
        expect($(el).css("color")).to.be("rgb(255, 0, 0)")
        done()
      })
    })
    
    
    // it('works for evented custom bindings', function(done) {
    //   var last 
    //   var o = { 
    //     check: function(e) { 
    //       last = e 
    //     } 
    //   }
    //         
    //   o_O.bindings.wham = function(callback, $el) {
    //     callback('woah')
    //     expect(this).to.be(o)
    //     expect($el[0]).to.be(el)
    //   }
    //   
    //   
    //   o_O.bindRuleToElement(el, "wham", "check", o)
    //   
    //   o_O.nextFrame(function() {
    //     expect(last).to.be('woah')
    //     done()
    //   })
    //   
    //   
    // })
    // 
    
  })    
      
})


describe('call binding', function() {

  window.__count = 0
  
  var __dependency = o_O(1)
  window.__incr = function() {
    __dependency() // force dependency
    __count++
  }
  
  beforeEach(function() {
    if(el) $(el).remove()
    el = $("<div>", {id: 'el', html: "el"}).appendTo("body")[0]
    __count = 0
  })
  
  it('gets called once when set as a function call', function() {
    $(el).attr('data-bind', 'onbind: __incr')
    expect(__count).to.eql(0)
    o_O.bind({}, el)
    // o_O.nextFrame(function() {
      expect(__count).to.eql(1)
      __dependency.incr()
      // o_O.nextFrame(function() {
        expect(__count).to.eql(1)
        // done()
    //   })
    // })
  })

  it('gets called twice when set as a called function ', function() {
    $(el).attr('data-bind', 'onbind: __incr')
    expect(__count).to.eql(0)
    o_O.bind({}, el)
    // o_O.nextFrame(function() {
      expect(__count).to.eql(1)
      __dependency.incr()
      // done()
      // o_O.nextFrame(function() {
      //   expect(__count).to.eql(2)
      //   done()
      // })
    
  })
  
})
  