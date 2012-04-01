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
           
# Funnyface.js
## HTML binding for teh lulz

* Elegantly binds objects to HTML
* Proxies through jQuery, Ender, or whatever $ is
* Automatic dependency resolution
* Plays well with others


## Examples

* [Basic Overview](http://weepy.github.com/o_O/examples/guide/index.html)
* [TodoMVC Example](http://weepy.github.com/o_O/examples/todos/index.html)

## The Basics

Use `o_O.property(...)` (or the shortcut: `o_O(...)`) to create an evented o_O `property`:

```javascript
var viewmodel = {
  name: o_O.property('Homer Simpson'),
  age: o_O(40) //o_O(...) proxies to o_O.property(...) and is the preferred usage
};

//change a value:
viewmodel.name('Bart Simpson');
viewmodel.age(10);

//get a value:
alert(viewmodel.name());
```

Bind an object to a section of HTML with the `o_O.bind(...)` method, and bind parts of that HTML section to o_O `properties` with the `data-bind` attribute:

```javascript
o_O.bind(viewmodel, '#character');
```
```html
<div id="#character">
  <div data-bind="text: name()"></div>
  <div data-bind="text: age()"></div>
</div>
```

## Digging Deeper

Besides creating basic javascript hashes to contain o_O `properties`, you can also create an o_O `model` (using `o_O.model(...)`) that creates o_O `properties` for you out of the box as well as giving you access to event aggregation:

```javascript
var Character = o_O.model({
  name: '',
  age: 0
});

var homer = new Character({
  name: 'Homer Simpson',
  age: 40
});

homer.on('set:name', function(character, name_new, name_old){
  console.log("Homer's name changed.");
});
```

You can also create an o_O `array` that lets you create an array of o_O `models` and aggregates events across all of them:

```javascript
var cast = o_O.array();

cast.push(new Character({name: 'Homer', age: 40}));
cast.push(new Character({name: 'Marge', age: 36}));
cast.push(new Character({name: 'Bart', age: 10}));
cast.push(new Character({name: 'Lisa', age: 8}));
cast.push(new Character({name: 'Maggie', age: 2}));

cast.on('set:age', function(character, age_new, age_old){
  console.log(character.name + "'s age changed from " + age_old + " to " + age_new + ".");
});

// this will trigger the above 'set:' event for each character:
cast.forEach(function(character){
  character.age(character.age() + 1);
});

cast.on('add', function(new_character){
  console.log(new_character);
});

// this will trigger the above 'add' event:
cast.push(new Character({name: 'Mr. Burns', age: 99}));
```

## Running Tests

Make sure you have installed o_O's development dependencies via npm:

```bash
npm install
```

A subset of tests can be run via the console:

```bash
npm test
```

Or, if you have mocha install (`npm install -g mocha`) you can just run:

```bash
mocha
```

Other tests (that rely on the browser's DOM) must be run in the browser:

```bash
open test/mocha.html
```

## Browser Compatability

Tested in:

* Chrome 16-18
* Firefox 4-10
* Internet Explorer 7-9 
* Safari 5

Other browsers should work, (eg IE6) but are currently untested


## Contributers

* Jonah Fox aka weepy
* Troy Goode

## License

o_O is released under the [MIT license](http://www.opensource.org/licenses/mit-license.html):

```
The MIT License (MIT)

Copyright (c) 2012 Jonah Fox <jonahfox@gmail.com> (https://github.com/weepy)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
