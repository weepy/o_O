FunnyFace.js     
============

```
                         ,ad8888ba,            
                        d8"'    `"8b           
                       d8'        `8b     
  ,adPPYba,            88          88          HTML binding for Lulz 
 a8"     "8a           88          88     
 8b       d8           Y8,        ,8P          Tiny, Elegant & flexible html binding
 "8a,   ,a8"            Y8a.    .a8P           
  `"YbbdP"'              `"Y8888Y"'            Provides an easy to bind an object to a section of HTML

            888888888888                       Proxies through jQuery (or whatever $ is)

                                               Built in automatic dependency resolution makes hooking up code a dream

                                               (c) 2012 by weepy, MIT Licensed
```


Simple Example
--------------

```
<div id=person bind='text: this'></div>

var name = o_O.property('John')

name.bindTo('#person')

// HTML text is now 'John'

name('Bob')

// HTML text is now 'Bob'

```

Todo
----

* Better example
* Website
