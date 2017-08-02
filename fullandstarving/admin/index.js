var ContactList;
var cityList = [];
var submitButton = document.querySelector("#submitToParse");
var emailClient = document.querySelector("#emailClient");
var nameClient = document.getElementById("nameClient");
var cityClient = document.querySelector("#cityClient");
var facebookClient = document.querySelector("#facebookClient");
var dropDownButton = document.querySelector("#cityDropDown");
var exportButton = document.querySelector("#export");
var data;

init();

function init(){

	Parse.initialize("fullandstarving651635156cjkbwjfhkbajkhbfjha");
	Parse.serverURL = 'http://fullandstarving651635156.herokuapp.com/parse';

	ContactList = Parse.Object.extend("ContactList");

	setupButtonListener();

	
	listCity();
}

function setupButtonListener(){

	submitButton.addEventListener("click",function(){

		checkForExistingContact()

	})

	exportButton.addEventListener("click",function(){

		data = [["email", "name", "cityClient","facebook"]];

		var query = new Parse.Query("ContactList");
		query.find({
			success: function(results){
				//alert("Successfully retrieved " + results.length + " records.");

				results.length

				if (results.length > 0){
					
					for (var i = 0; i < results.length; i++){

						var temp = [];
						console.log(temp.push(results[i].get("email")));
						console.log(temp.push(results[i].get("name")));
						console.log(temp.push(results[i].get("cityClient")));
						console.log(temp.push(results[i].get("facebook")));
						temp

						data.push(temp);

					}
				
				}

				var csvContent = "data:text/csv;charset=utf-8,";
				data.forEach(function(infoArray, index){

				   dataString = infoArray.join(",");
				   csvContent += index < data.length ? dataString+ "\n" : dataString;

				}); 

				var encodedUri = encodeURI(csvContent);
				var link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "contactlist.csv");
				document.body.appendChild(link); // Required for FF

				link.click(); // This will download the data file named "my_data.csv".
					},
					error: function(error) {
						alert("Error: " + error.code + " " + error.message);
						return true;
					}
				});


		

	})

}

function uploadData(){

			var contactList = new ContactList();
			contactList.set("email",emailClient.value.toLowerCase());
			contactList.set("name",nameClient.value);

			if (dropDownButton.value === "Add city") {

				contactList.set("cityClient",cityClient.value.toLowerCase());

			} else {

				contactList.set("cityClient",dropDownButton.value.toLowerCase())

			}

			
			contactList.set("facebook",facebookClient.value);
			contactList.save(null, {
				  success: function(contactList) {
				    // Execute any logic that should take place after the object is saved.
				    alert('New object created with objectId: ' + contactList.id);
				  },
				  error: function(contactList, error) {
				    // Execute any logic that should take place if the save fails.
				    // error is a Parse.Error with an error code and message.
				    alert('Failed to create new object, with error code: ' + error.message);
				  }
			});
}

function checkForExistingContact(){

	var query = new Parse.Query("ContactList");
	query.equalTo("email",emailClient.value.toLowerCase());
	query.find({
		success: function(results){
			//alert("Successfully retrieved " + results.length + " records.");

			results.length

			if (results.length > 0){
				alert("The email has been registered");
			}
			else{
				alert("Uploading data");
				uploadData();
			}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
			return true;
		}
	});
}

function listCity(){

	var query = new Parse.Query("ContactList");
	query.find({
		success: function(results){
			//alert("Successfully retrieved " + results.length + " records.");

			if (results.length > 0){
				
				for (var i = 0; i < results.length; i++) {

					cityList.push(results[i].get("cityClient").toLowerCase());
					console.log(results[i].get("cityClient"));

				}

				var sortedCity = cityList.slice().sort();

				console.log(sortedCity);

				var sortedCityTrun = [];
				for (var i = 0; i < cityList.length - 1; i++) {
				    if (sortedCity[i + 1] != sortedCity[i]) {
				        sortedCityTrun.push(sortedCity[i]);
				        add(sortedCity[i]);
				    }
				}

				console.log(sortedCityTrun);

			}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
			return true;
		}
	});

}

function add(cityArg){
  var el = document.getElementById("cityDropDown");
  var node = document.createElement("option");
  node.innerHTML = cityArg;
  el.appendChild(node);
}




