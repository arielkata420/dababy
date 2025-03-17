document.addEventListener("DOMContentLoaded", function () {
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
    const auth = firebase.auth();
    const database = firebase.database();
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault(); 
            const alertDiv = document.getElementById("alert");
            alertDiv.style.display = "none";

            const emailInput = document.getElementById("email").value;
            const passInput = document.getElementById("password").value;
            const phoneInput = document.getElementById("phone").value;

            if (passInput.length < 6) {
                alertDiv.style.display = "block";
                alertDiv.innerText = "Password must be at least 6 characters.";
                return;
            }
            if (phoneInput.length < 12) {
                alertDiv.style.display = "block";
                alertDiv.innerText = "phone must be at least 12 numbers.";
                return;
            }

            auth.createUserWithEmailAndPassword(emailInput, passInput,phoneInput)
                .then((userCredential) => {
                    const user = userCredential.user;

                    const tempuser = {
                        uid: user.uid,
                        email: emailInput,
                        phone:phoneInput,
                        createdAt: new Date().toISOString() 
                    };

                    database.ref("users/" + user.uid).set(tempuser)
                        .then(() => {
                            console.log("User data saved successfully.");
                        })
                        .catch((error) => {
                            console.error("Error saving user data to the database:", error);
                        });

                    document.getElementById("email").value = '';
                    document.getElementById("password").value = '';

                    document.getElementById("thankYouMessage").style.display = "block";
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    alertDiv.innerText = errorMessage;
                    alertDiv.style.display = "block";
                });
        });
    } else {
        console.error("Signup form not found!");
    }

    auth.onAuthStateChanged((user) => {
        if (user) {
            document.getElementById("logoutLink").style.display = "inline";
            document.getElementById("loginLink").style.display = "none";
            document.getElementById("signupLink").style.display = "none";

            document.getElementById("logoutButton").addEventListener("click", () => {
                auth.signOut().then(() => {
                    window.location.href = "login.html"; 
                });
            });
        } else {
            document.getElementById("logoutLink").style.display = "none";
            document.getElementById("loginLink").style.display = "inline";
            document.getElementById("signupLink").style.display = "inline";
        }
    });
});
