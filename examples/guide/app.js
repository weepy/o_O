$(function(){
  
$('a.btn').addClass('btn-large').click(function() {

  $('.btn-primary').removeClass('btn-primary')
  $(this).addClass('btn-primary')
  
  var ex = $(this).next()
  
  var out = $("<div>")
  
  $("#current").html("")
  
  var js = $.trim($(ex).find("script").html())
  var code = $("<code>", {html: js + "<label>JS</label>"})
  out.prepend($("<pre class='js javascript'/>").append(code))
  
  var orightml = $(ex).find('.inner').html()
  
  var html = $.trim(orightml)
  
  //html = "<div id='" + this.id + "'>\n  " + html + "\n</div>"
  html = html.replace(/\</g, '&lt;')
  html += "<label>HTML</label>"
  out.prepend($("<pre class=html/>").append($("<code>", {html: html})))
    
  out.append("<div id=example>" + orightml + "</div>")
  
  //out.append("<script>" + js + "</scr" + "ipt>")
  out.appendTo('#current')
  
  eval(js)
  // console.log(js)
  
  hljs.highlightBlock($('#current .js')[0])
  hljs.highlightBlock($('#current .html')[0])
  
  
  out.find('#example').append("<label>OUTPUT</label>")
  // var h = Math.max(out.find(".js").height(),out.find(".html").height() )
  // out.find(".js code, .html code").css({height:  h})
  
})
})