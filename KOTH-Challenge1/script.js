// Fake database
const users = {
  "admin.test": "Admin@123",
  "service.account": "service123",
  "hr.manager": "Hr@2025",
  "finance01": "Finance@123"
};

function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let errorBox = document.getElementById("error");

  // Username does not exist
  if (!users[username]) {
    errorBox.innerText = "User does not exist in our system";
    return;
  }

  // Wrong password
  if (users[username] !== password) {
    errorBox.innerText = "Invalid password for this account";
    return;
  }

  // Correct login
  window.location.href = "admin.html";
}
