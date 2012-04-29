0.2.6
=====

* model class itself is now evented
* array can now be extended
* added o_O.collection example file
* fixed bad enumeration in array::find
* extended models dont need type on creation

0.2.5
=====

* refactor bindings. Can now omit parans mostly - are added automatically. 
* bindings are now explicit, and o_O now knows what type of binding each is (inbound/outbound/twoway)
* add new bindings with o_O.newBinding
* performance improvements
* added router


0.2.4
=====

* force read on emit
* added dependencies as a property

0.2.3
=====

* properties now emit synchronously
* binding now emit asynchronously via requestAnimationFrame (for HTML writing events), except for the first run
* Added zooming example

0.2.2
=====

* Moved version string
* Added ability to export to an alternative namespace
* extended support for bind to o_O.model and o_O.array

0.2.1
=====

* Set array length before emitting events
* Rewrite array::renderItem
* Added property.bind
* Computed properties now also emit

0.2.0
=====

* o_O.array 
* o_O.model
* Timeouts per property