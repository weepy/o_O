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

Features
========

* Simple & flexible html binding

* Binds an object to a section of HTML using 'bind' attributes

* Proxies through $ (jQuery or ...)

* Automatic dependency resolution

* Plays well with others

(c) 2012 by Jonah Fox, MIT Licensed


Simple Example
--------------

```html
<div id=person bind='text: this'></div>
```
```javascript
var name = o_O.property('John')

o_O.bind(name, '#person')

// HTML text is now 'John'

name('Bob')

// HTML text is now 'Bob'
```

Further Examples
----------------

examples/index.html is a simple guide

examples/todos/index.html is the obligatory Todos example converted to o_O

Features
--------

* o_O.property      : evented properties with automatic dependency resolution
* o_O.bind          : bind an object to a section of HTML with 'bind' attributes
* o_O.collection    : a simple collection of objects
* o_O.klass         : a simple klass with o_O.property


Running Tests
-------------

either just run

mocha

or open test/mocha.html

Compatability
-------------

Tested in IE 7,8,9, Chrome 16, Firefox 4 and Safari 5

Todo
----

* Website

