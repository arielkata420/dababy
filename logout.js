firebase.auth().onAuthStateChanged((user) => {
    const logoutLink = document.getElementById('logoutLink');
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');

    if (user) {
        logoutLink.style.display = 'block';
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
    } else {
        logoutLink.style.display = 'none';
        loginLink.style.display = 'block';
        signupLink.style.display = 'block';
    }
});

document.getElementById("logoutButton").addEventListener("click", () => {
    firebase.auth().signOut()
        .then(() => {
            console.log("User logged out successfully");
            window.location.href = "login.html"; 
        })
        .catch((error) => {
            console.error("Error logging out:", error);
        });
});
