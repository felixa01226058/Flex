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
  const welcome = document.getElementById('welcome');


  //Add logout event
  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){

      var principalRoute = firebase.database().ref().child('Users').child(firebaseUser["uid"]);

      principalRoute.child('Enterprise').on('value', function(dataSnapshot) {
        if(dataSnapshot.val() == null){
          principalRoute = firebase.database().ref().child('Users').child(firebaseUser["uid"]);
        }
        else {
          principalRoute = firebase.database().ref().child('Users').child(dataSnapshot.val());
        }

        var name = principalRoute.child('Name');
        name.on('value', function(dataSnapshot) {
          username.innerHTML = ' '+dataSnapshot.val();
          welcome.innerHTML = 'Welcome '+dataSnapshot.val().split(" ")[0];
        });

        var money = principalRoute.child('AccountMoney');
        money.on('value', function(dataSnapshot) {
          balance.innerHTML = '$'+dataSnapshot.val().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        });

      });


    }
    else{
      window.location = "login.html";
    }
  });


}());
