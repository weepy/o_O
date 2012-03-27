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


  it('should change color with bindElementToRule', function(done) {

    var o = {
      color: o_O("rgb(3, 3, 3)")
    }

    o_O.bindElementToRule(el, "css", "{color: color()}", o)

    expect($("#el").css("color")).to.be('rgb(3, 3, 3)')

    o.color("rgb(3, 3, 4)")
    
    setTimeout(function() {
      expect($("#el").css("color")).to.be("rgb(3, 3, 4)")
      done()
    }, 0)

  })


  it('should call callback click with bindElementToRule', function() {
    var count = 0
    var o = {
      add: function() {
        color() // add in a dependency shouldn't make a difference
        count ++ 
      }
    }

    o_O.bindElementToRule(el, "click", "add", o)
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

      o_O.bindElementToRule($("#inp"), "click", "o_O.value(check)", o)
      expect(last).to.be('')
      $("#inp").click()
      expect(last).to.be('hello')
    })
  })
  

  
  describe('custom bindings', function() {    
    it('work for setting', function() {
      
      o_O.bindings.color = function(val, $el) {
        $el.css("color", val)

      }
      
      o_O.bindElementToRule(el, "color", "'red'")
      
      expect($(el).css("color")).to.be("rgb(255, 0, 0)")
    })
    
    it('works with properties', function() {
      
      o_O.bindings.color = function(val, $el) {
        $el.css("color", val)
      }
      
      var o = { red: o_O('red') }
      o_O.bindElementToRule(el, "color", "red()", o)
      expect($(el).css("color")).to.be("rgb(255, 0, 0)")
    })
    
    
    it('works for evented custom bindings', function() {
      var o = { check: function(e) { 
        last = e 
      } }
            
      o_O.bindings.wham = function(callback, $el) {
        callback('woah')
        expect(this).to.be(o)
        expect($el[0]).to.be(el)
      }
      

      o_O.bindElementToRule(el, "wham", "check", o)
      
      expect(last).to.be('woah')
      
    })
    
    
  })    
      
})

