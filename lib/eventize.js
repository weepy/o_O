/*********          _   _        
 *   _____ _____ _ _| |_(_)______ 
 *  / -_) V / -_) ' \  _| |_ / -_)
 *  \___|\_/\___|_||_\__|_/__\___|     
 */
!function() {
  var methods  = {
    on  : function(event, fct){
      this._events = this._events || {};
      this._events[event] = this._events[event]  || [];
      this._events[event].push(fct);
      return this
    },
    off  : function(event, fct){
      this._events = this._events || {};
      if( event in this._events === false  )  return;
      this._events[event].splice(this._events[event].indexOf(fct), 1);
      return this
    },
    emit  : function(event /* , args... */){
      this._events = this._events || {};
      var args = Array.prototype.slice.call(arguments, 1)
      var events
      if(events = this._events[event]) {
        for(var i = 0; i < events.length; i++)
          events[i].apply(this, args)
      }
      args.unshift(event)
      if(events = this._events['*']) {
        for(var i = 0; i < events.length; i++)
          events[i].apply(this, args)
      }
      return this
    }
  }

  o_O.eventize = function(o) {
    o.on = methods.on
    o.off = methods.off
    o.emit = methods.emit
    return o
  }
}();
