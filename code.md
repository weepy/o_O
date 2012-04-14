```funnyface
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
* [Zooming Example](http://weepy.github.com/o_O/examples/zoom/index.html)

## The Basics

# o_O properties

Use `o_O(...)` to create an evented o_O `property`:

```javascript

name = o_O('Homer Simpson')

// read a value
name() // => 'Homer Simpson'

// write a value
name('Bart Simpson')
```

o_O properties are evented, so it's possible to bind to a change event: 

```javascript
name.change(function(new_name, old_name) {
  console.log('my name changed from', old_name, 'to', new_name)
})
```

# Computed properties

o_O can also create computed properties:

```javascript
firstName = o_O('Homer')
surName = o_O('Simpson')
fullName = function() {
  return firstName() + ' ' + surName()
}

fullName() // => 'Homer Simpson'
```

A computed property automatically determines it's dependencies and is recalculated whenever a dependency changes:

```javascript
firstName('Bart')

fullName() // => 'Bart Simpson'
```

# HTML binding with o_O.bind

Bind an object to a section of HTML with the `o_O.bind(...)` method, and bind parts of that HTML section to o_O `properties` with the `data-bind` attribute:

```javascript
person = {
  firstName: o_O('Michael'),
  surName: o_O('Jackson'),
  fullName: function() {
    return person.firstName() + ' ' + person.surName()
  },
  age: o_O(50)
}
o_O.bind(person, '#person');
```
```html
<div id="#person">
  <div data-bind="text: fullName()"></div>
  <div data-bind="text: age()"></div>
</div>
```

This will render the HTML and retrigger the bindings whenever a dependency changes. So e.g calling `person.firstName('Miss')` will update the HTML.

The binding names are associated with jQuery (or whatever $ is), so css will call $.fn.css. There are also some custom bindings: 

* `foreach` : renders the innerHTML for a list of items
* `value` : two-way binding for forms
* `visible` : hides an element if falsey
* `if/unless` : removes/shows the inner HTML
* `with` : rebinds the context (similar to javascript `with`)
* `options`: options for a select
* `log`: outputs to console.log
* `call`: general purpose

Event handlers will also work, e.g. `click: handleClick`.

NB if there's no corresponding binding found, it will simply update the attribute on the element; this is especially useful for attributes such as id, class, src, href

## Digging Deeper

Besides creating basic javascript objects containing o_O `properties`, you can also create an o_O `model` (using `o_O.model(...)`) that creates o_O `properties` for you out of the box as well as giving you access to event aggregation:

```javascript
var homer = o_O.model({
  name: 'Homer Simpson',
  age: 40
});

homer.on('set:name', function(character, name_new, name_old){
  console.log("Homer's name changed.");
});
```

You can also create an o_O evented `array` that lets you create an array of items (can be anything) and if the items support it (i.e. they are o_O `models`) aggregates events across all of them:

```javascript
var cast = o_O.array();

cast.push(o_O.model({name: 'Homer', age: 40}));
cast.push(o_O.model({name: 'Marge', age: 36}));
cast.push(o_O.model({name: 'Bart', age: 10}));
cast.push(o_O.model({name: 'Lisa', age: 8}));
cast.push(o_O.model({name: 'Maggie', age: 2}));

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

The special `foreach` binding will render this list: 

```html
<ul id="#cast" data-bind='foreach: cast'>
  <li data-bind="text: fullName() +',' + age()" ></li>
</ul>

<script>
o_O.bind(cast, '#cast')
</script>
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