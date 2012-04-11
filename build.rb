
require 'rubygems'
require 'redcarpet'
require 'json'

markdown    = Redcarpet::Markdown.new(Redcarpet::Render::HTML, :autolink => true, :space_after_headers => true, :fenced_code_blocks => true)


layout = File.read('layout.html')
md = File.read('code.md')

partial = markdown.render(md)

html = layout.gsub '{{body}}', partial

File.open './index.html', 'wb' do |file| 
  file.write html
end
