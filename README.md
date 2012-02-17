```
                         ,ad8888ba,            
                        d8"'    `"8b           
                       d8'        `8b     
  ,adPPYba,            88          88          
 a8"     "8a           88          88     
 8b       d8           Y8,        ,8P          
 "8a,   ,a8"            Y8a.    .a8P           
  `"YbbdP"'              `"Y8888Y"'            

            888888888888                       
```           
           
HTML binding for Lulz 
========

* Power of KnockoutJS, with the agility of Backbone

* Elegantly binds objects to HTML

* Proxies through jQuery (or whatever $ is)

* Automatic dependency resolution

* Plays well with others



Examples
--------

* Basic overview: http://weepy.github.com/o_O/examples/guide/index.html

* obligatory todos: http://weepy.github.com/o_O/examples/todos/index.html

Features
--------

```o_O.property(default)```
  
Evented properties with automatic dependency resolution

```o_O.bind(object, '#dom')```
  
Bind's an object to a section of HTML with 'bind' attributes

```o_O.collection()```
  
A simple collection of objects

```o_O.klass```
  
An OO class with o_O.property's for elements


Running Tests
-------------

mocha

for dom tests: open test/mocha.html

Compatability
-------------

Tested in IE 7,8,9, Chrome 16, Firefox 4 and Safari 5


License
-------

(c) 2012 by Jonah Fox (weepy), MIT Licensed