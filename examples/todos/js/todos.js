(function() {
    //a custom binding to handle the enter key (could go in a separate library)
    o_O.bindings.enterKey = function(func) {
			this.$.keyup(function(e) {
				if(e.keyCode === 13)
					func()
			})
    }

    o_O.bindings.visible = function(val, $el) {
			val ? $el.show() : $el.hide()
    };

    //represent a single todo item
    var Todo = function (content, done) {
        this.content = o_O.property(content);
        this.done    = o_O.property(done);
        this.editing = o_O.property(false);
    };

    //can place methods on prototype, as there can be many todos
    Todo.prototype.edit = function() {  this.editing(true); }
    Todo.prototype.stopEditing = function() { this.editing(false); }
		
		Todo.prototype.remove = function() {
			this.parent.remove(this)
		}
		
    //our main view model
    var ViewModel = function(todos) {
        var self = this;
        //map array of passed in todos to an observableArray of Todo objects
        self.todos = o_O.collection(todos)

        //store the new todo value being entered
        self.current = o_O.property();

        //add a new todo, when enter key is pressed
        self.add = function () {
            var newTodo = new Todo(self.current());
            self.todos.add(newTodo);
            self.current("");
        };

        //remove a single todo
        self.remove = function (todo) {
            self.todos.remove(todo);
        };

        //remove all completed todos
        self.removeCompleted = function () {
            self.todos.remove(function(todo) {
                return todo.done();
            });
        };

        //count of all completed todos
        self.completedCount = function () {
					return self.todos.count(function(todo) {
						return todo.done();
					})
        }

        //count of todos that are not complete
        self.remainingCount = function () {
					return self.todos.count() - self.completedCount();
        }

        //writeable computed observable to handle marking all complete/incomplete
        self.allCompleted = o_O.property({
            //always return true/false based on the done flag of all todos
            read: function() {
                return !self.remainingCount();
            },
            //set all todos to the written value (true/false)
            write: function(newValue) {
                ko.utils.arrayForEach(self.todos, function(todo) {
                    //set even if value is the same, as subscribers are not notified in that case
                    todo.done(newValue);
                });
            }
        });

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
            return count.value === 1 ? "item" : "items";
        };

        // //internal computed observable that fires whenever anything changes in our todos
        // o_O.property(function() {
        //     //get a clean copy of the todos, which also creates a dependency on the observableArray and all observables in each item
        //     var todos = ko.toJS(self.todos);
        // 
        //     //store to local storage
        //     amplify.store("todos-knockout", todos);
        // }).extend({ throttle: 1000 }); //save at most once per second
    };

    // check local storage for todos
    // var todos = amplify.store("todos-knockout");

		window.view = new ViewModel([])
		o_O.bind(view, '#todoapp')
    // bind a new instance of our view model to the page
    // ko.applyBindings();
})();
