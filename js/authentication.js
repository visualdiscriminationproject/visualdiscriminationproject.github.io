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

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById("display_block").style.display = "block";
        document.getElementById("login_block").style.display = "none";

        var user = firebase.auth().currentUser;

        // TODO: pull participants and potentially edit

        // TODO: display active participants 

        //if (user != null){
        //    var email_id = user.email;
        //    document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
        //}
    } else {
        document.getElementById("display_block").style.display = "none";
        document.getElementById("login_block").style.display   = "block";
    }
});