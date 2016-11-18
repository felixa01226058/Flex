(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBpNT2BDHUnebERrbr_86rbr2zKuAwg_XE",
    authDomain: "flex-38b98.firebaseapp.com",
    databaseURL: "https://flex-38b98.firebaseio.com",
    storageBucket: "flex-38b98.appspot.com",
    messagingSenderId: "31841539582"
  };
  firebase.initializeApp(config);


  //Get elements
  const btnLogout = document.getElementById('btnLogout');
  const username = document.getElementById('username');


  function loadData(){
    var transactions = firebase.database().ref().child('Users').child(firebase.auth()["currentUser"]["uid"]).child('Transactions');
    //Adds a new transaction

    transactions.once('value', snap => {
      const body = document.getElementsByTagName('tbody').item(0);
      var tr = '';
      snap.forEach(function(subSnap) {
        tr += '<tr>';
        tr += "<td>"+subSnap.key+"</td>";
        tr += "<td>"+subSnap.child("Date").val()+"</td>";
        tr += "<td>"+subSnap.child("Type").val()+"</td>";
        tr += "<td>"+subSnap.child("RecipientNumber").val()+"</td>";
        tr += "<td>"+subSnap.child("Recipient").val()+"</td>";
        tr += "<td>"+subSnap.child("Comment").val()+"</td>";
        tr += "<td>$  "+subSnap.child("Amount").val()+"</td>";
        tr += "</tr>";
      });
      body.innerHTML = tr;
    });
  }


  //Add logout event
  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

  //Add a realtime listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      var name = firebase.database().ref().child('Users').child(firebaseUser["uid"]).child('Name');
      name.on('value', function(dataSnapshot) {
        username.innerHTML = ' '+dataSnapshot.val();
      });

      loadData();
    }
    else{
      window.location = "login.html";
    }
  });


}());
