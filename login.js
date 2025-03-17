const firebaseConfig = {
  apiKey: "AIzaSyCVpuQrqXHJzspJG8GzrIbNegmsi_hqFpA",
  authDomain: "dababy-5abac.firebaseapp.com",
  projectId: "dababy-5abac",
  storageBucket: "dababy-5abac.firebasestorage.app",
  messagingSenderId: "219514736030",
  appId: "1:219514736030:web:40a5727738b483fef1da8f",
  measurementId: "G-0MSJE1GXDX"
};

const app = firebase.initializeApp(firebaseConfig);
console.log(app);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
      var uid = user.uid;
      console.log("Logged in as UID:", uid);

      firebase.database().ref("/users/" + user.uid).get().then((snapshot) => {
          console.log(snapshot.val());
          const userData = snapshot.val();

          if (window.location.href.indexOf('temp.html') < 0) {
              window.location.href = "temp.html"; 
          }
      }).catch((error) => {
          console.error("Error fetching user data:", error);
      });
  } else {
      console.log("No user signed in.");
  }
});

function loginUser() {
  const email = document.getElementById("loginemail").value;
  const password = document.getElementById("loginpassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
          const user = userCredential.user;
          console.log("Login successful:", user.email);

          window.location.href = "temp.html";  
      })
      .catch((error) => {
          const errorMessage = error.message;
          console.error("Login failed:", errorMessage);
          alert("Login failed: " + errorMessage);
      });
}

