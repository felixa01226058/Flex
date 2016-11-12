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


  function loadData(){
    freqAccounts.on('value', snap => {
      const body = document.getElementsByTagName('tbody').item(0);
      var tr = '';
      var i = 1;
      snap.forEach(function(subSnap) {
        tr += '<tr>';
        tr += "<td>"+subSnap.child("RecipientNumber").val()+"</td>";
        tr += "<td>"+subSnap.child("Name").val()+"</td>";
        tr += "<td class=\"delete\"><a><i class=\"fa fa-times-circle\"></i></a></td>";
        tr += "</tr>";
        i++;
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
    const accountNumber = newAccountNumber.value;
    if(accountNumber.length < 8){
      alert('Account number must be 8 characters long');
      return false;
    }
    const name = newName.value;

    //Check if account exists in freq list
    freqAccounts.on('value', snap => {
      var isRepeated = false;
      snap.forEach(function(subSnap) {
        if(subSnap.child("RecipientNumber").val() == accountNumber){
          alert('This account is already in your frequent accounts!');
          isRepeated = true;
        }
      });
    });

    if(isRepeated){
      return false;
    }

    //Check if account exists in db
    /*var checkDB = firebase.database().ref().child('Users');

    checkDB.on('value', snap => {
      alert('do u even enter');
      snap.forEach(function(subSnap) {
        console.log(subSnap.key);
        alert('duo');
      });
    });
    return false;*/


    //Add new frequent account
    freqAccounts.push({'name': name, 'RecipientNumber': accountNumber});
    window.location = "forms.html"
  });


  //Add logout event
  btnLogout.addEventListener('click', e => {
    console.log('out!');
    firebase.auth().signOut();
  });

  //Add a realtime listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      console.log('user info: '+firebaseUser["uid"]);

      var x = firebase.database().ref().child('Users').child(firebaseUser["uid"]).child('Name');
      x.on('value', function(dataSnapshot) {
        username.innerHTML = dataSnapshot.val();
      });


      freqAccounts = firebase.database().ref().child('Users').child(firebaseUser["uid"]).child('FrequentAccounts');
      loadData();
    }
    else{
      console.log('Not logged in');
      window.location = "login.html";
    }
  });


}());
