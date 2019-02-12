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

var firestore = null;

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        document.getElementById("login_block").style.display = "none";

        var myClasses = document.querySelectorAll('.authElements'),
            i = 0,
            l = myClasses.length;
    
        for (i; i < l; i++) {
            myClasses[i].style.display = 'block';
        }

        firestore = firebase.firestore();
        const objRef = firestore.collection("storage");

        objRef.get().then(function (doc) {
            if (doc && doc.exists) {
                const mData = doc.data();

                console.log(mData);
            } else {
                console.log(doc);
            }
        }).catch( function (err) {
            console.log('err', err);
        });

        console.log("go");

        // var user = firebase.auth().currentUser.uid;
        // this.userId = user.uid;
        // console.log(this.userId);
        // console.log(user);

        //const objRef = firebase.firestore().collection("storage");
        // console.log(objRef);

        //var db = firebase.firestore();
        //var usr = firebase.auth().currentUser;

        //const store = firebase.firestore()
        /*
        store.collection('storage').get().then(doc => {
            if (doc.exists) {
                console.log(doc.data())
                //res.send(doc.data())
            }
            else {
                console.log('nthg');
                //res.send("Nothing")
            }
        }).catch(reason => {
            console.log(reason)
            //res.send(reason)
        });
        */

        /*
        firebase.firestore().collection('storage').get()
            .then(function(qry) {
                console.log(qry);
            });
            */
        
//        console.log(mStr);

        /*
        db.doc("storage").get()
                              .then(function(querySnapshot) {
                                    querySnapshot.forEach(function(doc) {
                                        console.log(doc.id, " => ", doc.data());
                                    });
                              })
                              .catch(function(err) {
                                console.log("Error getting documents: ", err);
                              });
        */

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