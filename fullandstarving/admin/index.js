var ContactList;
var cityList = [];
var submitButton = document.querySelector("#submitToParse");
var emailClient = document.querySelector("#emailClient");
var nameClient = document.getElementById("nameClient");
var cityClient = document.querySelector("#cityClient");
var facebookClient = document.querySelector("#facebookClient");
var dropDownButton = document.querySelector("#cityDropDown");
var exportButton = document.querySelector("#export");
var data = [
  ["email", "name", "cityClient", "facebook"]
];
var dataImport;
var querylimit = 100;
var skipNumber = 0;

init();

function init() {

  Parse.initialize("fullandstarving651635156cjkbwjfhkbajkhbfjha");
  Parse.serverURL = 'http://fullandstarving651635156.herokuapp.com/parse';

  ContactList = Parse.Object.extend("ContactList");

  setupButtonListener();

  skipNumber = 0;
  listCity();
}

function exportFunc() {

  var query = new Parse.Query("ContactList");
  query.limit(querylimit);
  query.skip(skipNumber*querylimit);
  query.find({
    success: function(results) {

      if (results.length > 0) {

        for (var i = 0; i < results.length; i++) {

          var temp = [];

          temp.push(results[i].get("email"));
          temp.push(results[i].get("name"));
          temp.push(results[i].get("cityClient"));
          temp.push(results[i].get("facebook"));

          data.push(temp);

        }

        if (results.length === 100) {
            console.log("recall");
            skipNumber++;
            exportFunc();
        } else {
          var csvContent = "data:text/csv;charset=utf-8,";
          data.forEach(function(infoArray, index) {

            dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString + "\n" : dataString;

          });

          var encodedUri = encodeURI(csvContent);
          var link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "contactlist.csv");
          document.body.appendChild(link); // Required for FF

          link.click(); // This will download the data file named "my_data.csv".
        }

      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
      return true;
    }
  });

}

function setupButtonListener() {

  submitButton.addEventListener("click", function() {

    checkForExistingContact()

  })

  exportButton.addEventListener("click", function(){
    skipNumber = 0;
    exportFunc();
  });

}

function uploadData() {

  var contactList = new ContactList();
  contactList.set("email", emailClient.value.toLowerCase());
  contactList.set("name", nameClient.value);

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

function checkForExistingContact() {

  if (emailClient.value.toLowerCase()!== ""){
		var query = new Parse.Query("ContactList");
		query.limit(querylimit);
	  query.equalTo("email", emailClient.value.toLowerCase());
	  query.find({
	    success: function(results) {
	      //alert("Successfully retrieved " + results.length + " records.");

	      results.length

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

			if (emailClient.value.toLowerCase() === "" && nameClient.value === "" && cityClient.value.toLowerCase() === "" && facebookClient.value === "")
				alert("No data is filled, Upload is cancelled");
			else {
				uploadData();
				alert("Uploading data");
			}
	}


}

function listCity() {

  var query = new Parse.Query("ContactList");
	query.limit(querylimit);
  query.skip(skipNumber*querylimit);
  query.find({
    success: function(results) {
      //alert("Successfully retrieved " + results.length + " records.");

      if (results.length > 0) {

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

function add(cityArg) {
  var el = document.getElementById("cityDropDown");
  var node = document.createElement("option");
  node.innerHTML = cityArg;
  el.appendChild(node);
}

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
                  alert('Imported -' + dataImport.length + '- rows successfully!');
									pushDataToHeroku(dataImport);
                } else {
                    alert('No data to import!');
                }
            };
            reader.onerror = function() {
                alert('Unable to read ' + file.fileName);
            };
        }
    }

		function pushDataToHeroku(tempData){

			var countCheck = 0;
			for (var i = 1; i < tempData.length; i++){

				var contactList = new ContactList();

			  contactList.set("email", tempData[i][0].toLowerCase());
			  contactList.set("name", tempData[i][1]);
			  contactList.set("cityClient", tempData[i][2].toLowerCase());
			  contactList.set("facebook", tempData[i][3]);

				contactList.save(null, {
			    success: function(contactList) {
			      countCheck++;

						console.log(countCheck);
						console.log(tempData.length-1);

						var unUploadedRows = tempData.length-1-countCheck;

						if (countCheck === (tempData.length-1)){

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
		}

});
