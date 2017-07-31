var todos = [];

var input = prompt("What would you like to do?");

while (input !== "quit"){

	if (input === "list") {

		todos.forEach(function(todo, i){
			console.log("***********");
			console.log(i+": "+todo);
			console.log("***********");
		});

	} else if (input === "new") {

		var newTodo = prompt("Enter new todo?");
		todos.push(newTodo);

	} else if (input === "delete"){

		var newTodo = prompt("Enter index to delete?");
		todos.splice(newTodo,1);


	}

	input = prompt("What would you like to do?");
}

console.log("OK, YOU QUIT THE APP");

