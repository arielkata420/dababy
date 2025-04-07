const firebaseConfig = {
    apiKey: "AIzaSyCVpuQrqXHJzspJG8GzrIbNegmsi_hqFpA",
    authDomain: "dababy-5abac.firebaseapp.com",
    projectId: "dababy-5abac",
    storageBucket: "dababy-5abac.firebasestorage.app",
    messagingSenderId: "219514736030",
    appId: "1:219514736030:web:40a5727738b483fef1da8f",
    measurementId: "G-0MSJE1GXDX"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

const tempPageContent = document.getElementById("tempPageContent");
const loginLink = document.getElementById("loginLink");
const signupLink = document.getElementById("signupLink");
const logoutLink = document.getElementById("logoutLink");
const logoutButton = document.getElementById("logoutButton");
const turnOnButton = document.getElementById('turnOnButton');
const turnOffButton = document.getElementById('turnOffButton');
const espCamStream = document.getElementById('espCamStream');
var useruid

let displayDefaultState = false;
let isStreaming = false;

function isbaby() {
  const accountSid = 'AC0a918d3b53aad359e4d8e70268fb451b';
  const authToken = '704b84afaab649f310e2da1c61e10365';
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const data = new URLSearchParams();
  data.append("Body", "you forgot you dababy in the car here is the website https://arielkata420.github.io/dababy/");
  data.append("MessagingServiceSid", "MG9dfc2ef1520ce442caf19d60bbf40b3e");
  data.append("To","+972526735190" );

  const authString = btoa(`${accountSid}:${authToken}`);

  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + authString,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data.toString()
  })
  .then(response => response.text())
  .then(text => console.log("SMS Sent:", text))
  .catch(error => console.error("Error sending SMS:", error));
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        tempPageContent.style.display = "block";
        loginLink.style.display = "none";
        signupLink.style.display = "none";
        logoutLink.style.display = "inline";

        logoutButton.onclick = () => {
            firebase.auth().signOut().then(() => {
                window.location.href = "login.html";
            }).catch((error) => {
                console.error("Logout Error:", error.message);
            });
        };

        fetchTemperatureData();
        fetchEspCamIp(); 
    } else {
        window.location.href = "login.html";
    }
});

let rxdata
function fetchTemperatureData() {

    const countref= firebase.database().ref("RX/RX")
    countref.on('value',(snapshot)=>{
        rxdata = snapshot.val()
    })

    const tempRef = firebase.database().ref('/RX/TX/A');
    tempRef.on('value', (snapshot) => {
       

        const tempValue = parseInt(snapshot.val(), 10);
        if (isNaN(tempValue)) {
            console.log("No valid temperature data found.");
            return;
        }

        let imageSrc, description;
        let showStream = false;
        switch (tempValue) {
            case 2: 
                imageSrc = "babysnow.png"; 
                showStream = true;
                isbaby();
                if(rxdata==0){
                    description = "מערכות  כבויות קר באוטו"
                }
                else {
                    description = "מערכות  דלוקות קר באוטו  "

                }


                break;
            case 3: 
                imageSrc = "babygood.jpg"; 
                description = "נעים באוטו "; 
                showStream = true;
                isbaby();
                if(rxdata==0){
                    description = "מערכות  כבויות נעים באוטו"
                }
                else {
                    description = "מערכות  דלוקות נעים  באוטו  "

                }

                break;
            case 4: 
                imageSrc = "babylava.png"; 
                description = " חם באוטו  "; 
                showStream = true;
                isbaby();
                if(rxdata==0){
                    description = "מערכות  כבויות חם באוטו"
                }
                else {
                    description = "מערכות  דלוקות חם באוטו  "

                }

                break;
                case 5: 
                imageSrc = "baaaby.jpg"; 
                description = "אין תינוק באוטו"; 
                showStream = false;
                firebase.database().ref("/RX/RX").set(2);  
            
               
                break;
            
            case 6: 
                 imageSrc = "200w (1).gif";
                description = " מחכה ללחיצת  כפתור  "; 
                showStream = false;
 
                break;
            default: 
                imageSrc = "arieli.jpeg"; 
                description = "מצב לא  מוגדר  ";
                showStream = false;
        }

        updateTempContent("temp", imageSrc, description);

        toggleStream(showStream);
    }, (error) => {
        console.error("Firebase Read Error:", error.message);
    });
}

function fetchEspCamIp() {
    const espCamRef = firebase.database().ref('/espcam/IP');

    espCamRef.on('value', (snapshot) => {
        const espIp = snapshot.val();
        console.log("ESP32-CAM IP Retrieved:", espIp); 

        if (!espIp) {
            console.error("No ESP32-CAM IP found in Firebase.");
            return;
        }

        const streamUrl = `https://8817-62-56-146-41.ngrok-free.app/stream`;
        console.log("Setting Stream URL:", streamUrl);

        if (window.location.protocol === "https:") {
            console.warn("⚠️ Your website is HTTPS but ESP32-CAM uses HTTP. The browser may block the stream!");
            alert("Your website is using HTTPS while ESP32-CAM uses HTTP. The video stream may be blocked by your browser.");
        }

        espCamStream.dataset.streamUrl = streamUrl; 
        toggleStream(isStreaming);
    });
}

function updateTempContent(key, imageSrc, description) {
    let tempContent = document.getElementById(`${key}Content`);

    if (!tempContent) {
        tempContent = document.createElement('div');
        tempContent.id = `${key}Content`;
        tempContent.className = "mb-3";

        tempContent.innerHTML = ` 
            <div class="card shadow-sm" style="width: 18rem;">
                <img id="${key}img" src="" class="card-img-top" alt="Temperature Image">
                <div class="card-body">
                    <h5 class="card-title">מצב ברכב</h5>
                    <p id="${key}text" class="card-text">${description}</p>
                </div>
            </div>
        `;
        tempPageContent.appendChild(tempContent);
    }

    document.getElementById(`${key}img`).src = imageSrc;
    document.getElementById(`${key}text`).textContent = description;
}

function toggleStream(shouldShow) {
    if (shouldShow && !displayDefaultState) {
        espCamStream.src = espCamStream.dataset.streamUrl || "";
        espCamStream.style.display = "block";
        isStreaming = true;
    } else {
        espCamStream.src = "";
        espCamStream.style.display = "none";
        isStreaming = false;
    }
}

turnOnButton.onclick = function () {
    sendDataToFPGA(1);
    displayDefaultState = false;
    fetchTemperatureData();
};

turnOffButton.onclick = function () {
    sendDataToFPGA(0);
    displayDefaultState = true;
    toggleStream(false); 
    updateTempContent("temp", "baaaaby.jpeg", " מערכות כבויות ");
};

function sendDataToFPGA(value) {
    const dataRef = firebase.database().ref("/RX/RX");
    dataRef.set(value)
        .then(() => console.log(`Data set to ${value}`))
        .catch((error) => console.error("Error writing to database:", error));
}
