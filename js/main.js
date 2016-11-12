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


  //Add logout event
  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){

    }
    else{
      window.location = "login.html";
    }
  });


}());
