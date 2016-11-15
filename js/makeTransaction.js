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
  const balance = document.getElementById('balance');
  const dropdown = document.getElementById('dropdown');
  const RecipientNumber = document.getElementById('recipientNumber');

  var myFavorites;

  //Add logout event
  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
  });


  function loadFavorites(){

    myFavorites.on('value', snap => {
      const body = document.getElementsByTagName('select').item(0);
      var option = "<option></option>";
      var i = 1;
      snap.forEach(function(subSnap) {
        option += "<option id=\""+i+"\">"+subSnap.child('Name').val()+"</option>";
        i++;
      });
      body.innerHTML = option;
    });

  }

  dropdown.addEventListener('change', e => {
    var strUser = dropdown.value;

    if(strUser.length == 0){
      recipientNumber.value = "";
    }
    else{
      myFavorites.on('value', snap => {
        snap.forEach(function(subSnap) {
          if(subSnap.child('Name').val() == strUser){
            recipientNumber.value = subSnap.child('RecipientNumber').val();
          }
        });
      });
    }

  });

  



  //Add a realtime listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      console.log('user info: '+firebaseUser["uid"]);

      var x = firebase.database().ref().child('Users').child(firebaseUser["uid"]).child('Name');
      x.on('value', function(dataSnapshot) {
        username.innerHTML = ' '+dataSnapshot.val();
      });

      var money = firebase.database().ref().child('Users').child(firebaseUser["uid"]).child('AccountMoney');
      money.on('value', function(dataSnapshot) {
        balance.innerHTML = '$'+dataSnapshot.val().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      });

      myFavorites = firebase.database().ref().child('Users').child(firebaseUser["uid"]).child('FrequentAccounts');


      loadFavorites();
    }
    else{
      console.log('Not logged in');
      window.location = "login.html";
    }
  });


}());
