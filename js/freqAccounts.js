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

  const newAccountNumber = document.getElementById('newAccountNumber');
  const newName = document.getElementById('newName');
  const newComment = document.getElementById('newComment');
  const submit = document.getElementById('submit');

  var freqAccount;
  var checkDB;
  var myAccount;
  var acc;

  var firebaseUserID;


  function loadData(){
    freqAccounts.on('value', snap => {
      const body = document.getElementsByTagName('tbody').item(0);
      var tr = '';
      snap.forEach(function(subSnap) {
        tr += "<tr>";
        tr += "<td>"+subSnap.child("RecipientNumber").val()+"</td>";
        tr += "<td>"+subSnap.child("Name").val()+"</td>";
        tr += "<td class=\"delete\"><a><i class=\"fa fa-times-circle\"></i></a></td>";
        tr += "</tr>";
      });
      body.innerHTML = tr;

      var abcElements = document.querySelectorAll(".delete");
      for (var j = 0; j < abcElements.length; j++){
        abcElements[j].id = j+1;
        abcElements[j].addEventListener('click', deleteFreq, false);
      }

      function deleteFreq(){
        var item = this.id;
        var k = 1;
        var flag = true;
        snap.forEach(function(subSnap) {
          if(k == item && flag){
            freqAccounts.child(subSnap.key).remove();
            flag = false;
          }
          k++;
        });
        window.location = "forms.html";
      }

    });
  }


  submit.addEventListener('click', e => {
    var name = newName.value;
    var accountNumber = newAccountNumber.value;

    if(accountNumber.length != 10){
      alert('Account number must be 10 characters long');
      return;
    }

    //Check if account exists in freq list
    var isInFrequents = false;
    freqAccounts.once('value', snap => {
      snap.forEach(function(subSnap) {
        if(subSnap.child("RecipientNumber").val() == accountNumber){
          isInFrequents = true;
        }
      });
    });
    if(isInFrequents){
      alert('It is already in frequents');
      return;
    }


    //Check if account exists in db and if it is mine
    var accountInDB = false;
    var itsMine = false;
    checkDB.once('value', snap => {
      snap.forEach(function(subSnap) {
        if(subSnap.child('AccountNumber').val() == accountNumber){
          accountInDB = true;
          if(subSnap.key == firebaseUserID){
            itsMine = true;
          }
        }
      });

      if(accountInDB && itsMine){
        alert('It is your account');
      }
      else if(accountInDB){
        freqAccounts.push({'Name': name, 'RecipientNumber': accountNumber});
        alert('Added to frequents');
        window.location = "forms.html";
      }
      else if(!accountInDB){
        alert('This account is not register in Flex Corp!');
      }

    });

  });


  //Add logout event
  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

  //Add a realtime listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){

      var principalRoute = firebase.database().ref().child('Users').child(firebaseUser["uid"]);


      principalRoute.child('Enterprise').on('value', function(dataSnapshot) {
        if(dataSnapshot.val() == null){
          firebaseUserID = firebaseUser["uid"];
          principalRoute = firebase.database().ref().child('Users').child(firebaseUser["uid"]);
        }
        else {
          firebaseUserID = dataSnapshot.val();
          principalRoute = firebase.database().ref().child('Users').child(dataSnapshot.val());
        }


        var name = principalRoute.child('Name');
        name.on('value', function(dataSnapshot) {
          username.innerHTML = ' '+dataSnapshot.val();
        });

        checkDB = firebase.database().ref('Users');
        myAccount = principalRoute.child('AccountNumber');
        freqAccounts = principalRoute.child('FrequentAccounts');

        loadData();

      });


    }
    else{
      window.location = "login.html";
    }
  });


}());
