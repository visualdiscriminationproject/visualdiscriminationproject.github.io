//(function() {

    function login() {
        var userEmail = document.getElementById("email_field").value;
        var userPass  = document.getElementById("password_field").value;
    
        firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
    
            window.alert("Error : " + errorMessage);
        });
    }
    
    function logout(){
        firebase.auth().signOut();
    }

    function buildParticipantPath(id) {
        return "storage/" + id + "/participants";
    }

    function buildDocumentPath(id, tag) {
        return "storage/" + id + "/participants/" + tag;
    }

    function updateChart(id, tag) {
        console.log('called update for: ' + id + " tag: " + tag);

        var docRef = firestore.doc(buildDocumentPath(id, tag));
        docRef.get().then(function(querySnapshot) {
            if (querySnapshot.empty) {
                console.log('no documents found');
            } else {
                console.log(querySnapshot.data());
            }
        });
    }

    // init db
    var config = {
        apiKey: "AIzaSyAe1F5zmD2UEopduuroDDQ6opPYWyquJvQ",
        authDomain: "visual-discrimination-app.firebaseapp.com",
        databaseURL: "https://visual-discrimination-app.firebaseio.com",
        projectId: "visual-discrimination-app",
        storageBucket: "visual-discrimination-app.appspot.com",
        messagingSenderId: "313567895439"
    };

    firebase.initializeApp(config);

    var firestore = firebase.firestore();
    firestore.settings({
        timestampsInSnapshots: true
    });

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            document.getElementById("login_block").style.display = "none";
    
            var myClasses = document.querySelectorAll('.authElements'),
                i = 0,
                l = myClasses.length;
        
            for (i; i < l; i++) {
                myClasses[i].style.display = 'block';
            }

            document.getElementById("participantDiv").innerHTML = "";

            var collRef = firestore.collection(buildParticipantPath(user["uid"]));
            collRef.get().then(function(querySnapshot) { //Call get() to get a QuerySnapshot    
                if (!querySnapshot.empty) { //Check whether there are any documents in the result
                    var headerText = (querySnapshot.size == 1) ? "1 participant" : 
                      querySnapshot.size + " participants";

                    document.getElementById("nParticipantSpan").innerHTML = headerText;

                    querySnapshot.forEach(function(doc) {
                        console.log(doc.data());

                        var aTag = document.createElement('a');
                        aTag.setAttribute('href', 'javascript:updateChart(' + 
                                                   '"' + user["uid"] + '",' +
                                                   '"' + doc.id + '"' +
                                                   ');');
                        aTag.setAttribute('class', 'leading');
                        aTag.innerHTML = doc.id;
                            document.getElementById("participantDiv").appendChild(aTag);

                        var brTag = document.createElement('br');
                            document.getElementById("participantDiv").appendChild(brTag);
                            document.getElementById("participantDiv").appendChild(brTag);
                    });
                }
            });

            // TODO: pull participants and potentially edit
            // TODO: display active participants 
        } else {
            document.getElementById("login_block").style.display = "block";
    
            var myClasses = document.querySelectorAll('.authElements'),
                i = 0,
                l = myClasses.length;
        
            for (i; i < l; i++) {
                myClasses[i].style.display = 'none';
            }
        }
    });

    /*
    var docRef = firestore.doc("storage/SGuxyi1FZIdIr54SOG0CBserUkf2/participants/-LXtheo6MwIVKCX0GAkS");
    docRef.get().then(function(querySnapshot) { //Call get() to get a QuerySnapshot    
        if (querySnapshot.empty) { //Check whether there are any documents in the result
            console.log('no documents found');
        } else {
            console.log(querySnapshot.data());
        }
    });
    */

    /*
    var collRef = firestore.collection("storage/SGuxyi1FZIdIr54SOG0CBserUkf2/participants");
    collRef.get().then(function(querySnapshot) { //Call get() to get a QuerySnapshot    
        if (querySnapshot.empty) { //Check whether there are any documents in the result
            console.log('no coll found');
        } else {
            querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());
            });
        }
    });
    */

//})