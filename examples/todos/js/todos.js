(function() {
    //a custom binding to handle the enter key (could go in a separate library)
    o_O.bindings.enterKey = function(func, $el) {
      $el.keyup(function(e) {
        if(e.keyCode === 13)
          func.call(this)
      })
    }

    //represent a single todo item
    var Todo = o_O.model.extend({
        type: 'Todo',
        content: '',
        done: false,
        editing: false
      }, {
      edit: function() {  
        this.editing(true); 
      },
      stopEditing: function() { 
        this.editing(false); 
      },
      remove: function() {
        view.todos.remove(this)
      }
    });
    
    var tooltipTimer
  
    var ViewModel = o_O.model.extend({
      current: "",
      showTooltip: false,
      remainingCount: 0,
      completedCount: 0
    }, {
      initialize: function() {
        var self = this
        this.todos = o_O.array(this.todos())

        this.todos.on('set:done remove', function() {
          
          self.completedCount(self.completed().length)
          self.remainingCount(self.count() - self.completedCount())
        })
        
        this.todos.on('set:done add remove', function() {
          self.persist()
        })
      },
      add: function () {
        var newTodo = new Todo({content: this.current()});
        this.todos.push(newTodo);
        this.current("");
      },
      count: function() {
        return this.todos.count()
      },
      removeCompleted: function (evt) {
        this.todos.remove(function(todo) {
          return todo.done()
        })
        // this.persist();
        return false
      },
      completed: function () {
        return this.todos.filter(function(todo) {
          return todo.done();
        })
      },
      persist: function() {
        amplify.store('todos', this.todos.toJSON());
      },
      //writeable computed observable to handle marking all complete/incomplete
      allCompleted: function(v) {  
        if(arguments.length == 0) return !this.remainingCount()
        this.todos.each(function(todo) {
          todo.done(v);
        })
      },
      onbind: function() {
        var self = this
        //watch the current value
        this.current.change(function(newValue) {
          //if the value was just updated, then the tooltip should not be shown
          self.showTooltip(false);

          //clear the current timer, as it is actively being updated
          clearTimeout(tooltipTimer);

          //if there is a value and then show the tooltip after 1 second
          if (newValue)
            tooltipTimer = setTimeout(function() {
              self.showTooltip(true)
            }, 1000);
        });
      }
    });
    
    window.pluralize = function(word, count) {
      return word + (count === 1 ? "" : "s");
    }
    
    var todos = amplify.store('todos') || []
    for(var i=0; i<todos.length;i++) 
      todos[i] = o_O.model.create(todos[i])

    var view = new ViewModel({todos: todos})
    window.view = view
    o_O.bind(view, '#todoapp')
})();
