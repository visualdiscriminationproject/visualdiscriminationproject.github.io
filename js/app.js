//(function() {
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
    firestore.settings({timestampsInSnapshots: true});

    //SGuxyi1FZIdIr54SOG0CBserUkf2/participants

    var docRef = firestore.collection("storage");

    docRef.get().then(function(querySnapshot) { //Call get() to get a QuerySnapshot
    
                if (querySnapshot.empty) { //Check whether there are any documents in the result
                    console.log('no documents found');
                } else {
                        querySnapshot.docs.map(function (documentSnapshot) {
                            //Not necessary to do that  -> return documentSnapshot.data();
                            console.log(documentSnapshot.data().name); 
                        });
                }
    
    });

    /*
    getRealtimeUpdates = function() {
        docRef.onSnapshot(function (snapshot) {
            //if (snapshot) {
                // && snapshot.exists
                //console.log('snap true');
                //const myData = doc.data();

                console.log(snapshot.data());

                //snapshot.forEach(function (doc) {
                //    console.log(doc.id, " => ", doc.data());
                //})
            //} else {
            //    console.log('snap false');
            //}
        }, function(error) {
            console.log('err');
            console.log(error);
        });
    }
    */

    //getRealtimeUpdates();
//})