// Fake database
let users = {
  "admin.test": "Admin@123",
  "service.account": "service123",
  "hr.manager": "Hr@2025",
  "finance01": "Finance@123"
};

// Security flags (Blue team controls these)
let genericErrors = false;
let rateLimitEnabled = false;
let loginAttempts = {};
let blockedIPs = [];

let logs = [];

function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let errorBox = document.getElementById("error");

  let ip = "192.168.1.100"; // Simulated attacker IP

  logs.push("Login attempt from " + ip + " using: " + username);

  // Rate limiting
  if (rateLimitEnabled) {
    if (!loginAttempts[ip]) {
      loginAttempts[ip] = 0;
    }
    loginAttempts[ip]++;

    if (loginAttempts[ip] > 5) {
      errorBox.innerText = "IP temporarily blocked!";
      logs.push("IP Blocked: " + ip);
      return;
    }
  }

  // Username check
  if (!users[username]) {
    if (genericErrors) {
      errorBox.innerText = "Invalid username or password";
    } else {
      errorBox.innerText = "User does not exist in our system";
    }
    return;
  }

  // Password check
  if (users[username] !== password) {
    if (genericErrors) {
      errorBox.innerText = "Invalid username or password";
    } else {
      errorBox.innerText = "Invalid password for this account";
    }
    return;
  }

  window.location.href = "admin.html";
}

// ----------------------
// BLUE TEAM FUNCTIONS
// ----------------------

function enableGenericErrors() {
  genericErrors = true;
  alert("Generic errors enabled!");
}

function enableRateLimit() {
  rateLimitEnabled = true;
  alert("Rate limiting enabled!");
}

function resetAdminPassword() {
  users["admin.test"] = "NewSecure@456";
  alert("Admin password reset!");
}

function viewLogs() {
  let logArea = document.getElementById("logArea");
  logArea.innerHTML = logs.join("<br>");
}
