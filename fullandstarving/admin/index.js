var ContactList;
var CitiesList;
var cityList = [];
var submitButton = document.querySelector("#submitToParse");
var emailClient = document.querySelector("#emailClient");
var nameClient = document.getElementById("nameClient");
var cityClient = document.querySelector("#cityClient");
var facebookClient = document.querySelector("#facebookClient");
var dropDownButton = document.querySelector("#cityDropDown");
var exportButton = document.querySelector("#export");
var usernameField = document.querySelector("#nickname");
var passwordField = document.querySelector("#pass");
var loginButton = document.querySelector("#loginButton");
var cityChosenForExport = document.querySelector("#cityDropDownExport");
var data = [
  ["email", "name", "cityClient", "facebook"]
];
var dataImport;
var querylimit = 1000;
var skipNumber = 0;

init();

// function to setup login listener
function loggingIn() {

  if (Parse.User.current()) {
    loginButton.innerText = "Logout";
  } else {
    loginButton.innerText = "Login";
  }

  loginButton.addEventListener("click", function() {

    if (loginButton.innerText === "Login") {
      Parse.User.logIn(usernameField.value, passwordField.value, {
        success: function(user) {
          // Do stuff after successful login.
          alert("Login successful");
          location.reload();
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
          alert("Login Failed, you can not export and import data");
        }
      });
    } else if (loginButton.innerText === "Logout") {
      Parse.User.logOut();
      alert("Logut successful");
      location.reload();
    }


  })
}

// Init function to start all of the listener and start up code
function init() {

  Parse.initialize("fullandstarving651635156cjkbwjfhkbajkhbfjha");
  Parse.serverURL = 'http://fullandstarving651635156.herokuapp.com/parse';
  loggingIn();
  ContactList = Parse.Object.extend("ContactList");
  CitiesList = Parse.Object.extend("CitiesList");
  setupButtonListener();
  skipNumber = 0;
  listCity();

}

// Export function to download data as csv according to city selection
function exportFunc() {

  var query = new Parse.Query("ContactList");
  query.limit(querylimit);
  query.descending("createdAt");
  // Check which city was chosen for export
  if (cityChosenForExport.value.toLowerCase() !== "all cities") {
    query.equalTo("cityClient", cityChosenForExport.value.toLowerCase());
  }

  // Skip number to get data for more than query limit
  query.skip(skipNumber * querylimit);
  query.find({
    success: function(results) {

      if (results.length >= 0) {

        for (var i = 0; i < results.length; i++) {

          var temp = [];

          // Push data to the array
          temp.push(results[i].get("email"));
          temp.push(results[i].get("name"));
          temp.push(results[i].get("cityClient"));
          temp.push(results[i].get("facebook"));
          data.push(temp);

        }


        if (results.length === querylimit) {
          console.log("recall");
          // increment skip number for pagination
          skipNumber++;

          // recursive call export for pagination
          exportFunc();

        } else {

            const csvString = Papa.unparse(data); // unparse generates CSV from your Object
            const a = document.createElement('a');  // create a simple link to a resource where your payload is your encoded CSV
            a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvString)}`;
            a.download = 'contactlist.csv'; // or whatever you wanna call it
            a.click();

/*
          //console.log("Producing");
          // after all of the rows are read, prepare csv file for export
          var csvContent = "data:text/csv;charset=utf-8,";
          data.forEach(function(infoArray, index) {
            //console.log("Producing");
            dataString = infoArray.join("\",\"");
            csvContent += index < data.length ? "\"" + dataString + "\" \n" : "\"" + dataString;

          });

          console.log("Finishing");
          var encodedUri = encodeURI(csvContent);
          var link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "contactlist.csv");
          document.body.appendChild(link); // Required for FF

          link.click(); // This will download the data file named "my_data.csv".
*/
        }

      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
      return true;
    }
  });

}

// Function to add listener to buttons
function setupButtonListener() {

  // Add listener to upload data
  submitButton.addEventListener("click", function() {
    submitButton.disabled = "true";
    checkForExistingContact()
  })


  // Add listener to export data to csv
  exportButton.addEventListener("click", function() {

    // Check if user has logged in
    if (Parse.User.current()) {
      alert("Exporting is in progress, Click OK and please wait until the download window appears")
      skipNumber = 0;
      data = [
        ["email", "name", "cityClient", "facebook"]
      ];
      exportFunc();
    } else {
      alert("You should login before exporting data");
    }
  });

}

// Function to upload data to the server
function uploadData() {

  var contactList = new ContactList();
  contactList.set("email", emailClient.value.toLowerCase());
  contactList.set("name", nameClient.value);

  // Check if user wants to add new city or choose from the list
  if (dropDownButton.value === "Add city") {

    contactList.set("cityClient", cityClient.value.toLowerCase());
    var citiesList = new CitiesList();
    citiesList.set("city", cityClient.value.toLowerCase());
    citiesList.set("size", 1);
  } else {

    contactList.set("cityClient", dropDownButton.value.toLowerCase())

  }

  contactList.set("facebook", facebookClient.value);
  contactList.save(null, {
    success: function(contactList) {
      // Execute any logic that should take place after the object is saved.
      alert('New object created with objectId: ' + contactList.id);

      var query = new Parse.Query("CitiesList");

      if (dropDownButton.value === "Add city") {

        query.equalTo("city", cityClient.value.toLowerCase());

      } else {

        query.equalTo("city", dropDownButton.value.toLowerCase());

      }

        query.find({
          success: function(results) {
            //alert("Successfully retrieved " + results.length + " records.");
            if (results.length > 0) {

              var tempLength = results[0].get("size")+1;
              results[0].set("size",tempLength);
              alert("The city has "+ tempLength + " data\nDon't go more than 6000 data!");
              results[0].save(null, {
                success: function(citiesList) {
                  // Execute any logic that should take place after the object is saved.
                  location.reload();
                },
                error: function(citiesList, error) {
                  // Execute any logic that should take place if the save fails.
                  // error is a Parse.Error with an error code and message.
                  alert('Failed to create new city, with error code: ' + error.message);
                }
              });


            } else {
              alert("Uploading city data");
              citiesList.save(null, {
                success: function(citiesList) {
                  // Execute any logic that should take place after the object is saved.
                  location.reload();
                },
                error: function(citiesList, error) {
                  // Execute any logic that should take place if the save fails.
                  // error is a Parse.Error with an error code and message.
                  alert('Failed to create new city, with error code: ' + error.message);
                }
              });
            }

          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
            return true;
          }
        });
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

  console.log("listing city");
  var query = new Parse.Query("CitiesList");
  query.find({
    success: function(results) {

      if (results.length >= 0) {

        for (var i = 0; i < results.length; i++) {

          console.log(results[i].get("city").toLowerCase());
          add(results[i].get("city").toLowerCase());

        }
      }

    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
      return true;
    }
  });

/*
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

        if (results.length === querylimit) {
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

          console.log(sortedCityTrun);
          alert("Data has been updated to the latest version")
        }
      }

    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
      return true;
    }
  });*/

}

// Add city to the dropdown list
function add(cityArg) {
  var el = document.getElementById("cityDropDown");
  var elForExport = document.getElementById("cityDropDownExport");
  var node = document.createElement("option");
  var nodeForExport = document.createElement("option");
  node.innerHTML = cityArg;
  nodeForExport.innerHTML = cityArg;
  el.appendChild(node);
  elForExport.appendChild(nodeForExport);
}

// Function to call the import method
$(document).ready(function() {

  // The event listener for the file upload
  document.getElementById('csvFileUpload').addEventListener('change', upload, false);

  // Method that checks that the browser supports the HTML5 File API
  function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      isCompatible = true;
    }
    return isCompatible;
  }

  // Method that reads and processes the selected file
  function upload(evt) {

    // Check if user has logged in
    if (Parse.User.current()) {

      if (!browserSupportFileUpload()) {
        alert('The File APIs are not fully supported in this browser!');
      } else {
        dataImport = null;
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
          var csvData = event.target.result;
          dataImport = $.csv.toArrays(csvData);
          if (dataImport && dataImport.length > 0) {
            alert('Imported -' + dataImport.length + '- rows successfully! - Wait for next pop up window!');
            pushDataToHeroku(dataImport);
          } else {
            alert('No data to import!');
          }
        };
        reader.onerror = function() {
          alert('Unable to read ' + file.fileName);
        };
      }

    } else {

      alert("You should login before importing data");

    }


  }

  // Import data to server bulk .csv data
  function pushDataToHeroku(tempData) {

    var countCheck = 0;

    if (tempData[0][0].toLowerCase() === "email" &&
      tempData[0][1].toLowerCase() === "name" &&
      tempData[0][2].toLowerCase() === "city" &&
      tempData[0][3].toLowerCase() === "facebook") {

      for (var i = 1; i < tempData.length; i++) {

        var contactList = new ContactList();

        contactList.set("email", tempData[i][0].toLowerCase());
        contactList.set("name", tempData[i][1]);
        contactList.set("cityClient", tempData[i][2].toLowerCase());
        contactList.set("facebook", tempData[i][3]);

        contactList.save(null, {
          success: function(contactList) {
            countCheck++;

            console.log(countCheck);
            console.log(tempData.length - 1);

            var tempDataLength = tempData.length - 1;

            progressBarUpdate(countCheck, tempDataLength);

            var unUploadedRows = tempData.length - 1 - countCheck;

            if (countCheck === (tempData.length - 1)) {

              alert("Successfully uploaded: " + parseInt(countCheck) + " rows");

            }

          },
          error: function(contactList, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
          }
        });
      }
    } else if (tempData[0][1].toLowerCase() === "city" && tempData[0][2].toLowerCase() === "size") {
        console.log("uploading city");

        for (var i = 1; i < tempData.length; i++){
          var citiesListUpload = new CitiesList();
          citiesListUpload.set("city",tempData[i][1].toLowerCase());
          citiesListUpload.set("size",parseInt(tempData[i][2]));

          citiesListUpload.save(null, {
            success: function(citiesListUpload) {
              countCheck++;

              console.log(countCheck);
              console.log(tempData.length - 1);

              var tempDataLength = tempData.length - 1;

              progressBarUpdate(countCheck, tempDataLength);

              var unUploadedRows = tempData.length - 1 - countCheck;

              if (countCheck === (tempData.length - 1)) {

                alert("Successfully uploaded: " + parseInt(countCheck) + " rows");

              }

            },
            error: function(citiesListUpload, error) {
              // Execute any logic that should take place if the save fails.
              // error is a Parse.Error with an error code and message.
              alert('Failed to create new object, with error code: ' + error.message);
            }
          });
        }

    }

  }

});

// Update progress Bar
function progressBarUpdate(progress, length) {
  var elem = document.getElementById("myBar");
  elem.style.width = (progress / length) * 100 + "%";
  elem.innerHTML = progress + "/" + length;
}
