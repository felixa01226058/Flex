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
  var deleteOption = document.getElementById('delete');


  //freqAccounts.push({'name': 'Nelson Mandela', 'RecipientNumber': 87654321});     //Adds a new frequent account


  function loadData(id){
    var freqAccounts = firebase.database().ref().child('Users').child(id).child('FrequentAccounts');

    freqAccounts.once('value', snap => {
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
        //console.log(this.id);
        var item = this.id;
        var k = 1;
        var flag = true;
        snap.forEach(function(subSnap) {
          if(k == item && flag){
            //console.log(k);
            //console.log(subSnap.key);
            freqAccounts.child(subSnap.key).remove();
            flag = false;
          }
          k++;
        });
        window.location = "forms.html";
      }

    });
  }


  //Add logout event
  btnLogout.addEventListener('click', e => {
    console.log('out!');
    firebase.auth().signOut();
  });

  //Add a realtime listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      console.log('user info: '+firebaseUser["uid"]);
      loadData(firebaseUser["uid"]);
    }
    else{
      console.log('Not logged in');
      window.location = "login.html";
    }
  });


}());
