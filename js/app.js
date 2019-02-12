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

    const docRef = firestore.collection("storage");

    getRealtimeUpdates = function() {
        docRef.onSnapshot(function (snapshot) {
            if (snapshot && snapshot.exists) {
            //    const myData = doc.data();

                console.log(snapshot.data());
            }
        }, function(error) {
            console.log(error);
        });
    }

    getRealtimeUpdates();
//})