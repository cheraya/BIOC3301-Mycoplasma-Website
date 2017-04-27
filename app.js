(function (){
  
// Initialize Firebase
  const config = {
      apiKey: "AIzaSyDuUYG0kdCC1UgTeHc4Ln_CSrcLyPGZ_XM",
      authDomain: "mycoplasma-database.firebaseapp.com",
      databaseURL: "https://mycoplasma-database.firebaseio.com",
      storageBucket: "mycoplasma-database.appspot.com",
    messagingSenderId: "786179828638"
};
firebase.initializeApp(config);

// Get elements
    const preObject = document.getElementById('object'); 

    // Create references, gets you to root of database. Child key of objects
    const dbRefObject = firebase.database().ref().child('object');

    // Sync object changes (calling 'on' the database reference, which points at location of object)
    // 'value' event-type causes the callback function to be called everytime there is a change in the data within the location i.e. the firebase console database. The callback function logs the change into the console. Snap parameter is a data snapshot
    dbRefObject.on('value', snap => {
        preObject.innerText = JSON.stringify(snap.val(), null, 3);
    });

// Getting reference objects
var auth = firebase.auth();
var database = firebase.database();

auth.signInAnonymously().catch(function(error){
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode === 'auth/operation-not-allowed') {
    alert('You must enable Anonymous auth in the Firebase Console.');
  } else {
    console.error(error);
  }
});

auth.onAuthStateChanged(function(user) {
  if (user) {
    var uid = user.uid;
    var time = Date.now();

    // sending userdata and scores (set function)
    database.ref('replication/' + uid).set({
        username: username,
        score: score
    });

    // reading and sorting scores (once function)
    var ref = database.ref('replication').orderByChild('score').limitToFirst(10);
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var data = childSnapshot.val();
        // TODO: use same HTML as apps
        var node = document.createElement("li");
        var textnode = document.createTextNode(data.username+': '+-data.score);         // Create a text node
        node.appendChild(textnode);
        if (data.score == score) {
          // TODO: change this to a class-addition
          leaderboard.appendChild(node).style.color = "red";
        } else {
          leaderboard.appendChild(node);
        } 
      });
    });

  } else {
    // TODO: send 'Snap we are sorry we have database issues message'
  }
});

auth.signOut();

})(); // wrapper function