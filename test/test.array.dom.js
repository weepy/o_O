var el , array

if(typeof module != 'undefined') {
  return
}

describe('foreach array', function() {

  beforeEach(function() {
    if(el) $(el).remove()
    el = $("<ul>", {id: 'array', html: "<li data-bind='text: this'></li>", 'data-bind': 'foreach: this'}).appendTo("body")[0]
    array = o_O.array()
    o_O.bind(array, el)
  })

  it('should be empty', function() {
    expect($(el).html()).to.eql('')
  })
  
  it('should insert elements correctly', function() {
    array.push('one')
    expect($(el).find('li')).to.have.length(1)
    expect($(el).find('li').html()).to.eql('one')
    
    array.push('two')
    expect($(el).find('li')[0].innerHTML).to.eql('one')
    expect($(el).find('li')[1].innerHTML).to.eql('two')
    
    array.unshift('zero')
    expect($(el).find('li')[0].innerHTML).to.eql('zero')
  })
  
  it('should insert into the middle', function() {
    array.unshift('zero')
    array.push('two')
    array.insert('one', 1)
    expect($(el).html()).to.be('<li>zero</li><li>one</li><li>two</li>')
  })
  
  it('should remove ok', function() {
    array.unshift('zero')
    array.push('two')
    array.insert('one', 1)
    array.shift()
    array.pop()
    expect($(el).html()).to.be('<li>one</li>')
  })
  
})