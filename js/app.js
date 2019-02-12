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
        return "storage/" + id + "/participants/" + tag + "/sessions";
    }

    function updateChart(id, tag) {
        var docRef = firestore.collection(buildDocumentPath(id, tag));

        var mPlotData = [];

        docRef.get().then(function(querySnapshot) {
            var prePlotter = [];

            if (!querySnapshot.empty) {
                querySnapshot.forEach(function(doc) {
                    const mData = doc.data();

                    prePlotter.push(mData);
                });
            }

            return prePlotter;
        }).then(function(prePlotter) {
            var tableBody = document.getElementById("tableBody");
            tableBody.innerHTML = "";

            prePlotter.forEach(function(row) {
                var newRow = document.createElement("tr");

                // Session Date
                var cell     = document.createElement("td");
                var cellText = document.createTextNode(row.sessionDate);
                cell.appendChild(cellText);
                newRow.appendChild(cell);

                // Display time
                cell     = document.createElement("td");
                cellText = document.createTextNode(row.displayTime);
                cell.appendChild(cellText);
                newRow.appendChild(cell);

                // difficultyLevel
                cell     = document.createElement("td");
                cellText = document.createTextNode(row.difficultyLevel);
                cell.appendChild(cellText);
                newRow.appendChild(cell);

                // trialCount
                cell     = document.createElement("td");
                cellText = document.createTextNode(row.trialCount);
                cell.appendChild(cellText);
                newRow.appendChild(cell);

                // correctAnswers
                cell     = document.createElement("td");
                cellText = document.createTextNode(row.correctAnswers);
                cell.appendChild(cellText);
                newRow.appendChild(cell);

                // correctAnswers
                cell     = document.createElement("td");
                cellText = document.createTextNode(row.wrongAnswers);
                cell.appendChild(cellText);
                newRow.appendChild(cell);

                tableBody.appendChild(newRow);

                // correctAnswers
                cell     = document.createElement("td");
                cellText = document.createTextNode((row.correctAnswers / (row.wrongAnswers + row.correctAnswers)) * 100);
                cell.appendChild(cellText);
                newRow.appendChild(cell);

                tableBody.appendChild(newRow);
            });
        }).then(function(prePlotter) {
            console.log('pull from table');

            var table = document.getElementById("tableBody");
            for (var i = 0, row; row = table.rows[i]; i++) {
                mPlotData.push({
                    //x: moment(row.cells[0].innerText).format(),
                    x: i,
                    y: parseFloat(row.cells[6].innerText)
                });
            }

//            var datapoints = [0, 20, 20, 60, 60, 120, NaN, 180, 120, 125, 105, 110, 170];
            var config = {
                type: 'line',
                data: {
//                    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                    datasets: [{
                        label: 'Linear interpolation',
                        data: mPlotData,
                        borderColor: window.chartColors.green,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        fill: false,
                        lineTension: 0,
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Participant Id: ' + tag
                    },
                    tooltips: {
                        mode: 'index'
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Date'
                            },
                            ticks: {
                                major: {
                                    fontStyle: 'bold',
                                    fontColor: '#FF0000'
                                }
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Accuracy'
                            },
                            ticks: {
                                suggestedMin: 0,
                            }
                        }]
                    }
                }
            };

            var ctx = document.getElementById('canvas').getContext('2d');
            
            window.myLine = new Chart(ctx, config);
            window.myLine.update();
        });;
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
                    var headerText = (querySnapshot.size == 1) ? 
                      "1 participant" : 
                      querySnapshot.size + " participants";

                    document.getElementById("nParticipantSpan").innerHTML = headerText;

                    querySnapshot.forEach(function(doc) {
                        const mData = doc.data();

                        var aTag = document.createElement('a');
                        aTag.setAttribute('href', 'javascript:updateChart(' + 
                                                   '"' + user["uid"] + '",' +
                                                   '"' + doc.id + '"' +
                                                   ');');

                        aTag.setAttribute('class', 'leading');
                        aTag.innerHTML = mData.participantTag + " (" + doc.id + ")";
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