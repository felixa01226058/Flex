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

  var destinationID;
  var user;
  var userNumber;

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


  submit.addEventListener('click', e => {
    var myNewBalance;

    //Validar input
    if(recipientNumber.value.length != 10 || recipientName.value.length == 0 || amount.value.length == 0){
      alert('Incomplete or incorrect fields');
      return;
    }

    //Limite minimo de transaccion
    if(amount.value < 10){
      alert('Low amount');
      return;
    }

    //Get destinationID
    hisAccount.once('value', snap => {
      snap.forEach(function(subSnap) {
        if(subSnap.child('AccountNumber').val() == recipientNumber.value){
          destinationID = subSnap.key;
        }
      });

      if(destinationID != null){
          var insufficient = false;
          //Validar que es menor que mi saldo actual
          myAccount.child('AccountMoney').once('value', function(dataSnapshot) {
            if(dataSnapshot.val() < amount.value){
              alert('Insufficient balance');
              insufficient = true;
            }
            else{
              //Modificar mi balance
              myAccount.child('AccountMoney').set( dataSnapshot.val() - amount.value );
            }
          });


          if(!insufficient){
            //Guardar en sus transacciones
            hisAccount.child(destinationID).child('Transactions').push({
              "Amount": amount.value,
              "Comment": comment.value,
              "Date": new Date().toUTCString(),
              "DateInSeconds": Math.round(new Date().getTime()/1000),
              "Recipient": user,
              "RecipientNumber": userNumber,
              "Type": "Entry"
            });
            //Modificar su balance
            hisAccount.child(destinationID).child('AccountMoney').once('value', function(dataSnapshot) {
              var result = +dataSnapshot.val() + +amount.value;
              console.log(result);
              hisAccount.child(destinationID).child('AccountMoney').set( result );
            });

            //Guardar en mis transacciones
            myAccount.child('Transactions').push({
              "Amount": -amount.value,
              "Comment": comment.value,
              "Date": new Date().toUTCString(),
              "DateInSeconds": Math.round(new Date().getTime()/1000),
              "Recipient": recipientName.value,
              "RecipientNumber": recipientNumber.value,
              "Type": "Deposit"
            });

          }
        }
        else{
          alert('Inexistent account');
          return;
        }

    });


  });



  saveFavorite.addEventListener('click', e => {
    if(recipientNumber.value.length != 10){
      alert('Account number must be 10 characters long');
      return;
    }

    //Check if account exists in freq list
    var isInFrequents = false;
    freqAccounts.once('value', snap => {
      snap.forEach(function(subSnap) {
        if(subSnap.child("RecipientNumber").val() == recipientNumber.value){
          isInFrequents = true;
        }
      });
    });
    if(isInFrequents){
      alert('Its already in frequents');
      return;
    }


    //Check if account is not myself
    var itsMine = false;
    myAccount.once('value', snap => {
      if(snap.val() == recipientNumber.value){
        event.stopImmediatePropagation();
        itsMine = true;
        return;
      }
    });

    //Check if account exists in db
    var accountInDB = false;
    checkDB.once('value', snap => {
      snap.forEach(function(subSnap) {
        if(subSnap.child('AccountNumber').val() == recipientNumber.value){
          accountInDB = true;
        }
      });

      if(accountInDB && itsMine){
        alert('its your account!!');
      }
      else if(accountInDB){
        freqAccounts.push({'Name': recipientName.value, 'RecipientNumber': recipientNumber.value});

        alert('Added');
        window.location = "forms.html";
      }
      else if(!accountInDB){
        alert('This account is not register in Flex Corp!');
      }

    });


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

      myAccount = firebase.database().ref().child('Users').child(firebaseUser["uid"]);


      myNumber = firebase.database().ref().child('Users').child(firebaseUser["uid"]);
      myNumber.on('value', function(dataSnapshot) {
        user = dataSnapshot.child('Name').val();
      });
      myNumber.on('value', function(dataSnapshot) {
        userNumber = dataSnapshot.child('AccountNumber').val();
      });

      myFavorites = firebase.database().ref().child('Users').child(firebaseUser["uid"]).child('FrequentAccounts');
      hisAccount = firebase.database().ref().child('Users');
      checkDB = firebase.database().ref('Users');
      freqAccounts = firebase.database().ref().child('Users').child(firebaseUser["uid"]).child('FrequentAccounts');

      loadFavorites();
    }
    else{
      console.log('Not logged in');
      window.location = "login.html";
    }
  });


}());
