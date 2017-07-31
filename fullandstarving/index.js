var ContactList;
var submitButton = document.querySelector("#submitToParse");
var emailClient = document.querySelector("#emailClient");
var nameClient = document.getElementById("nameClient");
var cityClient = document.querySelector("#cityClient");
var facebookClient = document.querySelector("#facebookClient");

init();

function init(){

	setupButtonListener();

	Parse.initialize("fullandstarving651635156cjkbwjfhkbajkhbfjha");
	Parse.serverURL = 'http://fullandstarving651635156.herokuapp.com/parse';

	ContactList = Parse.Object.extend("ContactList");
	
}

function setupButtonListener(){

	submitButton.addEventListener("click",function(){

		checkForExistingContact()

	})

}

function uploadData(){

			var contactList = new ContactList();
			contactList.set("email",emailClient.value.toLowerCase());
			contactList.set("name",nameClient.value);
			contactList.set("cityClient",cityClient.value);
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




