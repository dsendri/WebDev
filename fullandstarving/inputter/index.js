var ContactList;
var cityList = [];
var submitButton = document.querySelector("#submitToParse");
var emailClient = document.querySelector("#emailClient");
var nameClient = document.getElementById("nameClient");
var cityClient = document.querySelector("#cityClient");
var facebookClient = document.querySelector("#facebookClient");
var dropDownButton = document.querySelector("#cityDropDown");
var data = [
  ["email", "name", "cityClient", "facebook"]
];
var dataImport;
var querylimit = 100;
var skipNumber = 0;

init();

// Init function to start all of the listener and start up code
function init() {

  alert("Please wait until the data has been updated")
  Parse.initialize("fullandstarving651635156cjkbwjfhkbajkhbfjha");
  Parse.serverURL = 'http://fullandstarving651635156.herokuapp.com/parse';
  ContactList = Parse.Object.extend("ContactList");
  setupButtonListener();
  skipNumber = 0;
  listCity();

}

// Function to add listener to buttons
function setupButtonListener() {

  // Add listener to upload data
  submitButton.addEventListener("click", function() {
    checkForExistingContact()
  })

}

// Function to upload data to the server
function uploadData() {

  var contactList = new ContactList();
  contactList.set("email", emailClient.value.toLowerCase());
  contactList.set("name", nameClient.value);

  // Check if user wants to add new city or choose from the list
  if (dropDownButton.value === "Add city") {

    contactList.set("cityClient", cityClient.value.toLowerCase());

  } else {

    contactList.set("cityClient", dropDownButton.value.toLowerCase())

  }

  contactList.set("facebook", facebookClient.value);
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

// Check if the email has been registered
function checkForExistingContact() {

  // Check if there is empty field on the email field
  if (emailClient.value.toLowerCase() !== "") {

    var query = new Parse.Query("ContactList");
    query.limit(querylimit);
    query.equalTo("email", emailClient.value.toLowerCase());
    query.find({
      success: function(results) {
        //alert("Successfully retrieved " + results.length + " records.");
        if (results.length > 0) {
          alert("The email has been registered");
        } else {
          alert("Uploading data");
          uploadData();
        }

      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
        return true;
      }
    });

  } else {

    // Check if the is no data filled, then discontinue the upload
    if (emailClient.value.toLowerCase() === "" && nameClient.value === "" && cityClient.value.toLowerCase() === "" && facebookClient.value === "")
      alert("No data is filled, Upload is cancelled");
    else {

      // Upload data to server
      uploadData();
      alert("Uploading data");
    }
  }


}

// List cities that have been uploaded to server
function listCity() {

  var query = new Parse.Query("ContactList");
  query.limit(querylimit);
  query.skip(skipNumber * querylimit);
  query.find({
    success: function(results) {
      //alert("Successfully retrieved " + results.length + " records.");

      if (results.length >= 0) {

        for (var i = 0; i < results.length; i++) {

          cityList.push(results[i].get("cityClient").toLowerCase());
          //console.log(results[i].get("cityClient"));

        }

        if (results.length === 100) {
          console.log("recall");
          skipNumber++;
          listCity();
        } else {
          var sortedCity = cityList.slice().sort();

          //console.log(sortedCity);

          var sortedCityTrun = [];
          for (var i = 0; i < cityList.length; i++) {
            if (sortedCity[i + 1] != sortedCity[i]) {
              sortedCityTrun.push(sortedCity[i]);
              add(sortedCity[i]);
            }
          }
          alert("Data has been updated to the latest version")
          console.log(sortedCityTrun);
        }
      }

    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
      return true;
    }
  });

}

// Add city to the dropdown list
function add(cityArg) {
  var el = document.getElementById("cityDropDown");
  var node = document.createElement("option");
  node.innerHTML = cityArg;
  el.appendChild(node);
}
