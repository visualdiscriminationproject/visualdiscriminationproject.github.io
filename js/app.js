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

    const docRef = firestore.collection("storage/SGuxyi1FZIdIr54SOG0CBserUkf2/participants");

    getRealtimeUpdates = function() {
        docRef.onSnapshot(function (doc) {
            if (doc && doc.exists) {
                const myData = doc.data();

                console.log(myData);                
            }
        });
    }

    getRealtimeUpdates();
//})