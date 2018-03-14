

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBzQRSyecDNazmIOXM9Ehn5oMIO0nTnjAM",
    authDomain: "trainarrivals-85c77.firebaseapp.com",
    databaseURL: "https://trainarrivals-85c77.firebaseio.com",
    projectId: "trainarrivals-85c77",
    storageBucket: "trainarrivals-85c77.appspot.com",
    messagingSenderId: "27270694233"
  };
  
  firebase.initializeApp(config);  
  var database = firebase.database();


  var trainname;
  var destination;
  var frequency;
  var firstrain;
  var minsaway;
  var convertfirsttrain;
  var currenttime = moment();
  var timefromnow;
  var timeleft;
  var nexttcalc;
  var nexttrain;

// get value from form fields when the user clicks add train 

  $("#addtrain").on("click", function(event) {
    event.preventDefault();

    trainname = $("#trainname").val().trim();
    firstrain = $("#firsttraintime").val().trim();
    frequency = $("#frequency").val().trim();
    destination = $("#destination").val().trim();

    // calulate arrival times and mins away 
    convertfirsttrain = moment(firstrain, "HH:mm").subtract(1, "years");
    console.log("firsttimeconverted: " + convertfirsttrain);

    timefromnow = moment().diff(moment(convertfirsttrain), "minutes");
    console.log("timefromnow: " + timefromnow);

    timeleft = (timefromnow % frequency);
    console.log("timeleft: " + timeleft);

    minsaway = (frequency - timeleft);
    console.log("minsaway: " + minsaway);

    nexttcalc = moment().add(minsaway, "minutes");
    nexttrain = moment(nexttcalc).format("hh:mm A");
    console.log("nexttrain: " + moment(nexttrain).format("hh:mm A"));
    alert("Train information sucessfuly added!");
    
    //send data to database 
    database.ref().push({
        trainname: trainname,
        firstrain: firstrain,
        frequency: frequency,
        destination: destination,
        nexttrain: nexttrain,
        minsaway: minsaway,
        dateadded: firebase.database.ServerValue.TIMESTAMP
      });
      
      $("form")[0].reset();

  });



// add new itmes to the database without overrideing existing items 

database.ref().on("child_added", function(childSnapshot) {
    $("#trainname").text(childSnapshot.val().trainname);
    $("#firsttraintime").text(childSnapshot.val().firstrain);
    $("#frequency").text(childSnapshot.val().frequency);
    $("#destination").text(childSnapshot.val().destination);
    $(nexttrain).text(childSnapshot.val().nexttrain);
    $(minsaway).text(childSnapshot.val().minsaway);
    
   

    var row = $("<tr>");
    var tname = $("<td>").text(childSnapshot.val().trainname);
    var desti = $("<td>").text(childSnapshot.val().destination);
    var frequen =  $("<td>").text(childSnapshot.val().frequency);
    var nextariv = $("<td>").text(childSnapshot.val().nexttrain);
    var minaway = $("<td>").text(childSnapshot.val().minsaway);

    
    row.append(tname, desti, frequen, nextariv, minaway)
    $("tbody").append(row)
  });


  