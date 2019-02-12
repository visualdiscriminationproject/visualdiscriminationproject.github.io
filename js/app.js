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
    
    function logout() {
        firebase.auth().signOut();
    }

    function buildParticipantPath(id) {
        return "storage/" + id + "/participants";
    }

    function buildDocumentPath(id, tag) {
        return "storage/" + id + "/participants/" + tag + "/sessions";
    }

    function updateFigure() {
        var mLabels = [];

        var mPlotData = [];
        var mPlotDifficulty = [];

        var table = document.getElementById("tableBody");
        for (var i = 0, row; row = table.rows[i]; i++) {
            mPlotData.push({
                x: i,
                y: parseFloat(row.cells[6].innerText)
            });

            mPlotDifficulty.push({
                x: i,
                y: parseFloat(row.cells[2].innerText) * 100
            })

            mLabels.push('' + i);
        }

        var config = {
            type: 'line',
            data: {
                labels: mLabels,
                datasets: [
                {
                    label: 'Accuracy',
                    data: mPlotData,
                    borderColor: window.chartColors.green,
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    fill: false,
                    lineTension: 0,
                },
                {
                    label: 'Difficulty',
                    data: mPlotDifficulty,
                    borderColor: window.chartColors.red,
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    fill: false,
                    lineTension: 0,
                },
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Participant Id: '
                },
                tooltips: {
                    mode: 'index'
                },
                scales: {
                    xAxes: [{
                        //type: 'time',
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Session'
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
    }

    function updateTable(prePlotter) {
        console.log('updateTable(prePlotter)');
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

        updateFigure();
    }

    function updateParticipant(tag) {
        const user = firebase.auth().currentUser;
        const currPath = buildDocumentPath(user["uid"], tag);
        
        if (oldListenerPath != null || oldListenerPath == currPath ) {
            var unsubscribe = firestore.collection(oldListenerPath).onSnapshot(function () {});
            unsubscribe();
        }

        oldListenerPath = currPath;

        var docRef = firestore.collection(currPath);

        docRef.onSnapshot(function(querySnapshot) {
            console.log("in snap: " + querySnapshot.empty)
            if (!querySnapshot.empty) {
                var prePlotter = [];

                querySnapshot.forEach(function(doc) {
                    const mData = doc.data();
                    prePlotter.push(mData);
                });

                updateTable(prePlotter);
            }
        });

        /*
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
        }).then(function() {
            var mLabels = [];

            var table = document.getElementById("tableBody");
            for (var i = 0, row; row = table.rows[i]; i++) {
                mPlotData.push({
                    x: i,
                    y: parseFloat(row.cells[6].innerText)
                });

                mPlotDifficulty.push({
                    x: i,
                    y: parseFloat(row.cells[2].innerText) * 100
                })

                mLabels.push('' + i);
            }

            var config = {
                type: 'line',
                data: {
                    labels: mLabels,
                    datasets: [
                    {
                        label: 'Accuracy',
                        data: mPlotData,
                        borderColor: window.chartColors.green,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        fill: false,
                        lineTension: 0,
                    },
                    {
                        label: 'Difficulty',
                        data: mPlotDifficulty,
                        borderColor: window.chartColors.red,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        fill: false,
                        lineTension: 0,
                    },
                    ]
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
                            //type: 'time',
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Session'
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
        });
        */
    }

    function addNewParticipant() {
        var pId  = document.getElementById("addParticipantTag").value;
        var pDes = document.getElementById("addParticipantDescription").value;
        var pDiff= document.getElementById("addParticipantDifficulty").value;
        var pDur = document.getElementById("addParticipantDuration").value;
        var pTrls= document.getElementById("addParticipantTrials").value;

        if (!$.isNumeric(pDiff)) {
            alert("Difficulty must be a number.");
            return;
        }

        if (!$.isNumeric(pDur)) {
            alert("Duration (seconds) must be a number.");
            return;
        }

        if (!$.isNumeric(pTrls)) {
            alert("Trials (counts) must be a number.");
            return;
        }

        pDiff = parseInt(pDiff);
        pDur  = parseInt(pDur);
        pTrls = parseInt(pTrls);

        const user = firebase.auth().currentUser;   
        const path = buildParticipantPath(user["uid"]);
        
        firestore.collection(path).add({
            descriptionTag: pDes,
            difficultyLevel: pDiff,
            displayTime: pDur,
            participantTag: pId,
            trialNumbers: pTrls
        }).then(function(docRef) {
            $('#addParticipantModal').modal('hide');

            document.getElementById("addParticipantTag").value          = "";
            document.getElementById("addParticipantDescription").value  = "";
            document.getElementById("addParticipantDifficulty").value   = "";
            document.getElementById("addParticipantDuration").value     = "";
            document.getElementById("addParticipantTrials").value       = "";
        }).catch(function(err) {
            alert(err);
        });
    }

    function showAuthContent() {
        document.getElementById("login_block").style.display = "block";
    
        var myClasses = document.querySelectorAll('.authElements'),
            i = 0,
            l = myClasses.length;
    
        for (i; i < l; i++) {
            myClasses[i].style.display = 'none';
        }
    }

    function hideAuthContent() {
        document.getElementById("login_block").style.display = "none";
    
        var myClasses = document.querySelectorAll('.authElements'),
            i = 0,
            l = myClasses.length;
    
        for (i; i < l; i++) {
            myClasses[i].style.display = 'block';
        }
    }

    function clearParticipantDiv() {
        document.getElementById("participantDiv").innerHTML = "";
    }

    function buildHeader(size) {
        return (size == 1) ? "1 participant" : size + " participants";        
    }

    function snapshotUpdateCall(querySnapshot) {
        if (!querySnapshot.empty) { 
            document.getElementById("nParticipantSpan").innerHTML = buildHeader(querySnapshot.size);
            document.getElementById("participantDiv").innerHTML = "";

            querySnapshot.forEach(function(doc) {
                const mData = doc.data();

                var aTag = document.createElement('a');
                aTag.setAttribute('href', 'javascript:updateParticipant(' + 
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

    var oldListenerPath = null;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            hideAuthContent();

            clearParticipantDiv();

            const path = buildParticipantPath(user["uid"]);

            var collRef = firestore.collection(path);

            collRef.onSnapshot(snapshotUpdateCall);
        } else {
            showAuthContent();
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