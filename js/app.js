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

    function updateParticipant(tag, name) {
        const user = firebase.auth().currentUser;
        const currPath = buildDocumentPath(user["uid"], tag);
        
        if (oldListenerPath != null || oldListenerPath == currPath ) {
            var unsubscribe = firestore.collection(oldListenerPath).onSnapshot(function () {});
            unsubscribe();
        }

        oldListenerPath = currPath;

        var docRef = firestore.collection(currPath);

        document.getElementById("tagParticipantSpan").innerHTML = name;

        docRef.onSnapshot(function(querySnapshot) {
            var tableBody = document.getElementById("tableBody");
            tableBody.innerHTML = "";
            var prePlotter = [];

            if (!querySnapshot.empty) {

                querySnapshot.forEach(function(doc) {
                    const mData = doc.data();
                    prePlotter.push(mData);
                });
            }

            updateTable(prePlotter);
        });
    }

    function editParticipant() {
        console.log('editing');
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

    function buildHeader(size) {
        return (size == 1) ? "1 participant" : size + " participants";        
    }

    function snapshotUpdateCall(querySnapshot) {
        if (!querySnapshot.empty) { 
            document.getElementById("nParticipantSpan").innerHTML = buildHeader(querySnapshot.size);
            document.getElementById("participantDiv").innerHTML = "";

            var tableBody = document.getElementById("tableBody2");
            tableBody.innerHTML = "";

            querySnapshot.forEach(function(doc) {
                const mData = doc.data();

                var newRow = document.createElement("tr");

                //
                var cell     = document.createElement("td");
                var cellText = document.createTextNode(mData.participantTag);
                    cell.appendChild(cellText);
                    newRow.appendChild(cell);

                tableBody.appendChild(newRow);

                //
                cell     = document.createElement("td");
                cellText = document.createTextNode(mData.descriptionTag);
                    cell.appendChild(cellText);
                    newRow.appendChild(cell);

                tableBody.appendChild(newRow);

                //
                cell     = document.createElement("td");
                cellText = document.createTextNode(mData.difficultyLevel);
                    cell.appendChild(cellText);
                    newRow.appendChild(cell);

                tableBody.appendChild(newRow);

                //
                cell     = document.createElement("td");
                cellText = document.createTextNode(mData.displayTime);
                    cell.appendChild(cellText);
                    newRow.appendChild(cell);

                tableBody.appendChild(newRow);

                //
                cell     = document.createElement("td");
                cellText = document.createTextNode(mData.trialNumbers);
                    cell.appendChild(cellText);
                    newRow.appendChild(cell);

                tableBody.appendChild(newRow);

                //
                var aTag = document.createElement('a');
                aTag.setAttribute('href', 'javascript:updateParticipant("' + doc.id + 
                '","' + mData.participantTag + '");');
                aTag.setAttribute('class', 'leading btn btn-raised');
                aTag.innerHTML = "Load Progress";

                cell     = document.createElement("td");
                    cell.appendChild(aTag);
                    newRow.appendChild(cell);

                //
                aTag = document.createElement('a');
                aTag.setAttribute('data-toggle', 'modal');
                aTag.setAttribute('data-target', '#editParticipantModal');

                aTag.setAttribute('class', 'leading btn btn-raised open-sessionDialog');

                aTag.setAttribute('data-id', doc.id);
                aTag.setAttribute('data-participantTag', mData.participantTag);
                aTag.setAttribute('data-descriptionTag', mData.descriptionTag);
                aTag.setAttribute('data-difficultyLevel', mData.difficultyLevel);
                aTag.setAttribute('data-displayTime', mData.displayTime);
                aTag.setAttribute('data-trialNumbers', mData.trialNumbers);

                aTag.innerHTML = "Edit Session Conditions";

                cell = document.createElement("td");
                    cell.appendChild(aTag);
                    newRow.appendChild(cell);

                tableBody.appendChild(newRow);
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

            const path = buildParticipantPath(user["uid"]);

            var collRef = firestore.collection(path);

            collRef.onSnapshot(snapshotUpdateCall);
        } else {
            showAuthContent();
        }
    });

    $(document).on("click", ".open-sessionDialog", function () {
        var pTag = $(this).data('participanttag');

        var recordId = $(this).data('id');
        var pDesc = $(this).data('descriptiontag');
        var pDiff = $(this).data('difficultylevel');
        var pTime = $(this).data('displaytime');
        var pSessions = $(this).data('trialnumbers');

        $(".modal-body #editParticipantTag").val( pTag );
        $(".modal-body #editParticipantDescription").val( pDesc );
        $(".modal-body #editParticipantDifficulty").val( pDiff );
        $(".modal-body #editParticipantDuration").val( pTime );
        $(".modal-body #editParticipantTrials").val( pSessions );

        $('#editParticipantSave').removeAttr('onclick');
        $("#editParticipantSave").click(function() {
            /*
            var pId  = document.getElementById("editParticipantTag").value;
            var pDes = document.getElementById("editParticipantDescription").value;
            var pDiff= document.getElementById("editParticipantDifficulty").value;
            var pDur = document.getElementById("editParticipantDuration").value;
            var pTrls= document.getElementById("editParticipantTrials").value;
    
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
            const path = buildParticipantPath(user["uid"]) + "/" + recordId;
            
            firestore.doc(path).update({
                descriptionTag: pDes,
                difficultyLevel: pDiff,
                displayTime: pDur,
                participantTag: pId,
                trialNumbers: pTrls
            }).then(function(docRef) {
                $('#editParticipantModal').modal('hide');
    
                document.getElementById("editParticipantTag").value          = "";
                document.getElementById("editParticipantDescription").value  = "";
                document.getElementById("editParticipantDifficulty").value   = "";
                document.getElementById("editParticipantDuration").value     = "";
                document.getElementById("editParticipantTrials").value       = "";
            }).catch(function(err) {
                alert(err);
            });
            */
        });
   });
//})