(function() {
    //a custom binding to handle the enter key (could go in a separate library)
    o_O.bindings.enterKey = function(func, $el) {
      $el.keyup(function(e) {
        if(e.keyCode === 13)
          func.call(this)
      })
    }

    //represent a single todo item
    var Todo = o_O.Model({
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
        this.collection.remove(this)
      }
    })
    
    //our main view model
    var ViewModel = function(todos) {
        var self = this;
        //map array of passed in todos to an observableArray of Todo objects
        self.todos = o_O.Collection(todos)

        //store the new todo value being entered
        self.current = o_O.property("");

        // self.current.change(function(x) {
        //   console.log(this, x)
        // })
        //add a new todo, when enter key is pressed
        self.add = function () {
            var newTodo = new Todo({content: self.current()});
            self.todos.add(newTodo);
            self.current("");
        };

        //remove a single todo
        self.remove = function (todo) {
            self.todos.remove(todo);
        };

        //remove all completed todos
        self.removeCompleted = function () {
          self.todos.forEach(function(todo) {
            if(todo.done()) {
              self.todos.remove(todo);
            }
          });
        }

        //count of all completed todos
        self.completedCount = o_O.property(function () {
          return self.todos.filter(function(todo) {
            return todo.done();
          }).length
        })
        
        self.todos.on('set:done', function(object, val, old) {
          self.completedCount.change()
          self.remainingCount.change()
        })
        
        //count of todos that are not complete
        self.remainingCount = o_O.property(function () {
          return self.todos.count() - self.completedCount();
        })

        //writeable computed observable to handle marking all complete/incomplete
        self.allCompleted = o_O.property(function(v) {
            if(v === undefined) return !self.remainingCount()
            self.todos.forEach(function(todo) {
              todo.done(v);
            })
        })

        //track whether the tooltip should be shown
        self.showTooltip = o_O.property(false);
        self.showTooltip.setTrue = function() { self.showTooltip(true); }; //avoid an anonymous function each time

        //watch the current value
        self.current.change(function(newValue) {
            //if the value was just updated, then the tooltip should not be shown
            self.showTooltip(false);

            //clear the current timer, as it is actively being updated
            if (self.showTooltip.timer) {
                clearTimeout(self.showTooltip.timer);
            }

            //if there is a value and then show the tooltip after 1 second
            if (newValue) {
                self.showTooltip.timer = setTimeout(self.showTooltip.setTrue, 1000);
            }
        });

        //helper function to keep expressions out of markup
        self.getLabel = function(count) {
            return count === 1 ? "item" : "items";
        };

        // TODO: Storage
    };

    window.view = new ViewModel([])
    o_O.bind(view, '#todoapp')
})();
