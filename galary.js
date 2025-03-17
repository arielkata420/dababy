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
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("logoutLink").style.display = "inline";
        document.getElementById("loginLink").style.display = "none";
        document.getElementById("signupLink").style.display = "none";

        document.getElementById("logoutButton").addEventListener("click", () => {
            firebase.auth().signOut().then(() => {
                window.location.href = "login.html"; 
            });
        });
    } else {
        document.getElementById("logoutLink").style.display = "none";
        document.getElementById("loginLink").style.display = "inline";
        document.getElementById("signupLink").style.display = "inline";
    }
});

