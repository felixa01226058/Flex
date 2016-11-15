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
  const recipientNumber = document.getElementById('recipientNumber');
  const recipientName = document.getElementById('recipientName');
  const amount = document.getElementById('amount');
  const comment = document.getElementById('comment');
  const saveFavorite = document.getElementById('saveFavorite');
  const submit = document.getElementById('submit');

  var myFavorites;
  var myAccount;
  var hisAccount;


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
      recipientNumber.readOnly = false;

      recipientName.value = "";
      recipientName.readOnly = false;
    }
    else{
      recipientNumber.readOnly  = true;
      recipientName.readOnly = true;

      myFavorites.on('value', snap => {
        snap.forEach(function(subSnap) {
          if(subSnap.child('Name').val() == strUser){
            recipientNumber.value = subSnap.child('RecipientNumber').val();
            recipientName.value = subSnap.child('Name').val();
          }
        });
      });
    }

  });


  //Date: new Date().toUTCString()
  //DateInSeconds: Math.round(new Date().getTime()/1000)
  submit.addEventListener('click', e => {
    //Validar input
    if(recipientNumber.value.length != 8 || recipientName.value.length == 0 || amount.value.length == 0){
      alert('Incomplete or incorrect fields');
      return;
    }

    //Limite minimo de transaccion
    if(amount.value < 10){
      alert('Low amount');
      return;
    }

    //Validar que es menor que mi saldo actual
    myAccount.child('AccountMoney').once('value', function(dataSnapshot) {
      if(dataSnapshot.val() < amount.value){
        alert('Insufficient balance');
      }
    });

    var myNewBalance = dataSnapshot.val() - amount.value;


    //Validar monto maximo por dia
    



    //Guardar en mis transacciones
    myAccount.child('Transactions').push({
      "Amount": -amount.value,
      "Comment": comment.value,
      "Date": new Date().toUTCString(),
      "DateInSeconds": Math.round(new Date().getTime()/1000),
      "Recipient": recipientName,
      "RecipientNumber": recipientNumber,
      "Type": "Deposit"
    });
    //Modificar mi balance
    myAccount.child('AccountMoney').set( myNewBalance );


    //Guardar en sus transacciones
    //Modify recipient and recipient number
    hisAccount.child(recipientNumber.value).child('Transactions').push({
      "Amount": amount.value,
      "Comment": comment.value,
      "Date": new Date().toUTCString(),
      "DateInSeconds": Math.round(new Date().getTime()/1000),
      //"Recipient": recipientName,
      //"RecipientNumber": recipientNumber,
      "Type": "Entry"
    });
    //Modificar su balance
    hisAccount.child(recipientNumber.value).child('AccountMoney').once('value', function(dataSnapshot) {
      hisAccount.child(recipientNumber.value).child('AccountMoney').set( dataSnapshot.val() + amount.value );
    });


    console.log('END');
  });



  saveFavorite.addEventListener('click', e => {
    //Validar input
    //Validar que no este ya en favoritos

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


      myAccount = firebase.database().ref().child('Users').child(firebaseUser["uid"]);

      hisAccount = firebase.database().ref().child('Users');

      loadFavorites();
    }
    else{
      console.log('Not logged in');
      window.location = "login.html";
    }
  });


}());
