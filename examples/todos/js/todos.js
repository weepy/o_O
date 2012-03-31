(function() {
    //a custom binding to handle the enter key (could go in a separate library)
    o_O.bindings.enterKey = function(func, $el) {
      $el.keyup(function(e) {
        if(e.keyCode === 13)
          func.call(this)
      })
    }

    //represent a single todo item
    var Todo = o_O.model({
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
        window.view.todos.remove(this)
      }
    })

    //our main view model
    var ViewModel = function(todos) {
        var self = this;

        //map array of passed in todos to an observableArray of Todo objects
        self.todos = o_O.array(todos)

        //store the new todo value being entered
        self.current = o_O("");

        //add a new todo, when enter key is pressed
        self.add = function () {
            var newTodo = new Todo({content: self.current()});
            self.todos.push(newTodo);
            self.current("");
        };

        //remove all completed todos
        self.removeCompleted = function (evt) {
          self.todos.remove(function(todo) {
            return todo.done()
          })
          self.persist();
          evt.preventDefault()
        }

        //count of all completed todos
        self.completedCount = o_O(function () {
          return self.todos.filter(function(todo) {
            return todo.done();
          }).length
        })

        self.todos.on('add', function() {
          self.remainingCount.change()
          self.allCompleted.change()
          self.persist()
        })

        self.todos.on('set:done', function() {
          self.completedCount.change()
          self.remainingCount.change()
          self.allCompleted.change()
        })

        self.todos.on('update', function() {
          self.persist()
        })

        self.todos.on('remove', function() {
          //self.remainingCount.change()
          //self.allCompleted.change()
          self.persist()
        })

        //count of todos that are not complete
        self.remainingCount = o_O(function () {
          return self.todos.count() - self.completedCount();
        })

        //writeable computed observable to handle marking all complete/incomplete
        self.allCompleted = o_O(function(v) {
            if(v === undefined) return !self.remainingCount()
            self.todos.forEach(function(todo) {
              todo.done(v);
            })
        })

        //track whether the tooltip should be shown
        self.showTooltip = o_O(false);
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

        self.persist = function() {
          var todos = [];
          self.todos.forEach(function(todo){
            todos.push({id: todo.id, content: todo.content(), done: todo.done()});
          });
          amplify.store('todos', todos);
        };
    };

    var todos = [];
    var storedTodos = amplify.store('todos') || [];
    storedTodos.forEach(function(storedTodo) {
      var todo = new Todo({id: storedTodo.id, content: storedTodo.content, done: storedTodo.done});
      todos.push(todo);
    });

    window.view = new ViewModel(todos)
    o_O.bind(view, '#todoapp')
})();
