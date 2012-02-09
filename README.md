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

FunnyFace.js     
============

HTML binding for Lulz 

Tiny, elegant & flexible html binding

Provides an easy to bind an object to a section of HTML

Proxies through $ (jQuery or ...)

Built in automatic dependency resolution makes hooking up code a dream

(c) 2012 by weepy, MIT Licensed



Simple Example
--------------

```
<div id=person bind='text: this'></div>

var name = o_O.property('John')

o_O.bind(name, '#person')

// HTML text is now 'John'

name('Bob')

// HTML text is now 'Bob'

```

Further Examples
----------------

See folder examples

Features
--------

o_O.property
o_O.bind
o_O.collection


Running Tests
-------------

either just run

mocha

or open test/mocha.html

Todo
----

* Website
* Change dependency mechanism. Investigate
* Update bindings after a setTimeout to throttle multiple calls?
* Rebinding a template to a different context ? Necessary?