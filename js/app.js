import { loadDatabase, findUserByEmail, addUser, updateUser  } from "./dbRepository.js";
import { nigeriaBanks, parseFullName, createWallets } from "./Utility.js"

const db = await loadDatabase();
//let storedUsers = JSON.parse(localStorage.getItem("bankUsers"));

// update localStorage from Db.js
// localStorage.setItem("bankUsers", JSON.stringify(bankUsers));

let currentPageIndex = 0;
let currentUserId = Number(localStorage.getItem("currentUserId")) || null;

const banksDropdownList = document.getElementById("bankSelect");

nigeriaBanks.forEach((bank, i) => {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = bank;
  banksDropdownList.appendChild(option);
});

let bodyElement = document.querySelector("body");
let mainElement = document.querySelector("main")

//page navigation buttons
let dashboardNav = document.querySelector('#dashboardNav')
let depositNav = document.querySelector('#depositNav')
let transferNav = document.querySelector('#transferNav')
let withdrawNav = document.querySelector('#withdrawNav')
let payBillsNav = document.querySelector('#payBillsNav')
let settingsNav = document.querySelector('#settingsNav')
let profileNav = document.querySelector('#profileBtn')

//form submittion buttons
let loginBtn = document.querySelector('#login-btn')
let toSignUpBtn = document.querySelector('#toSignUpBtn')
let depositBtn = document.querySelector('#depositBtn')
let transferBtn = document.querySelector('#transferBtn')
let withdrawBtn = document.querySelector('#withdrawBtn')
let changePasswordBtn = document.querySelector('#changeBtn')
let updateUserProfileBtn = document.querySelector('#settingsUpdateUser')
let signUpBtn = document.querySelector('#signUpBtn')
let loginNavBtns = document.querySelectorAll('[name="loginNavBtn"]') //slected using name attribute so as to avoid dupplicate button elements that do the samething - navigate to the login screen. 
let forgotPasswordBtn = document.querySelector('#forgotPasswordBtn')
let signOutBtn = document.querySelector('#signOutBtn')




//pages
let loginPage = document.querySelector('#login')
let dashboardPage = document.querySelector('#dashboard')
let depositPage = document.querySelector('#deposit')
let transferPage = document.querySelector('#transfer')
let withdrawPage = document.querySelector('#withdraw')
let payBillsPage = document.querySelector('#payBills')
let signUpPage = document.querySelector('#signUp')
let settingsPage = document.querySelector('#settings')
let forgotPasswordPage = document.querySelector('#forgotPassword')




//----------------Navigation Buttons events-------------------------
loginNavBtns.forEach((element) => {
  element.addEventListener("click", function () {
    showPage(loginPage);
  });
});

forgotPasswordBtn.addEventListener("click", function () {
  showPage(forgotPasswordPage);
});

signOutBtn.addEventListener("click", function() {
  localStorage.removeItem("currentUserId");
  currentUserId = null;
  showPage(loginPage);
});




//---------aside-nav------------------------------------------------
dashboardNav.addEventListener("click", function () {
  showPage(dashboardPage)
})

depositNav.addEventListener("click", function () {
  showPage(depositPage)
})
transferNav.addEventListener("click", function () {
  showPage(transferPage);
})

withdrawNav.addEventListener("click", function () {
  showPage(withdrawPage);
})

settingsNav.addEventListener("click", function () {
  showPage(settingsPage)
})

payBillsNav.addEventListener("click", function () {
  showPage(payBillsPage)
})

profileNav.addEventListener("click", function () {
  showPage(settingsPage)
})


//------------------Controllers-------------------------------------------------
loginBtn.addEventListener("click", function () {
  login()
});


signUpBtn.addEventListener("click", async function () {
  let fullName = document.querySelector("#signUpFullName").value.trim();
  let email = document.querySelector("#signUpEmail").value.trim();
  //let phone = document.querySelector("#signUpPhone").value.trim();
  let password = document.querySelector("#signUpPassword").value.trim();
  let confirmPassword = document.querySelector("#signUpConfirmPassword").value.trim();

  if (!fullName || !email || !password || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (password != confirmPassword) {
    alert("Password and Confirm Password fields must match.");
    return;
  }
  try {
    let newUser = await createUser(fullName, email, password);

    //await sendVerificationEmail(newUser);

    location.href = `app.html#login?email=${encodeURIComponent(newUser.email)}&sent=true`;
    showPage(loginPage);
  } catch (error) {
    alert(error.message)
    console.log(error)
  }
  
});

toSignUpBtn.addEventListener("click", function () {
  showPage(signUpPage);
});

depositBtn.addEventListener("click", function () {
  deposit();
});

transferBtn.addEventListener("click", function () {
  transfer();
});

withdrawBtn.addEventListener("click", function () {
  withdraw();
});

updateUserProfileBtn.addEventListener("click", async () => {
  let user = await getCurrentUser();
  if (!user) return alert("User not found");

  let firstName = document.getElementById("settingsFirstName").value.trim();
  let lastName = document.getElementById("settingsLastName").value.trim();
  let phone = document.getElementById("settingsPhone").value.trim();

  // Basic validation
  if (!firstName || !lastName || !phone) {
    alert("First name, last name and phone cannot be empty");
    return;
  }

  try {
    let updatedUser = await updateUserProfile(currentUserId, firstName, lastName, phone );
    alert("Profile updated successfully!");
  } catch (error) {
    alert(error.message);
  }
  
});

changePasswordBtn.addEventListener("click", function () {
  changePwd();
});





detectPageToShow()

//----------HELPERS------------------------

function detectPageToShow() {
  let currentPage = location.hash.substring(1);
  let params = new URLSearchParams(location.hash.split("?")[1]);

  let savedUserId = Number(localStorage.getItem("currentUserId"));
  if (savedUserId) {
    currentUserId = savedUserId;
  }

  switch (currentPage) {
    case "login":
      let email = params.get("email");
      let verified = params.get("verified");

      if (email) document.querySelector("#emailInput").value = email;
      if (verified) alert("Email verified successfully!");
      showPage(loginPage);
      break;
    case "register":
      showPage(signUpPage);
      break;
    case "verifyEmail":
      verifyEmailFromUrl();
      break;
    case "forgotPassword":
      showPage(forgotPasswordPage);
      break;
    case "dashboard":
      showPage(dashboardPage);
      break;
    case "deposit":
      showPage(depositPage);
      break;
    case "transfer":
      showPage(transferPage);
      break;
    case "withdraw":
      showPage(withdrawPage);
      break;
    case "payBills":
      showPage(payBillsPage);
      break;
    case "settings":
      showPage(settingsPage);
      break;
    default:
      showPage(loginPage);
      break;
  }
}

/**
  * shows a section from the list of section in a page and hide the other section
  * 
  * @param {HTMLElement} pageToShow 
*/
function showPage(pageToShow) {
  hideSections()
  pageToShow.classList.remove('d-none');
  if (pageToShow == loginPage || pageToShow == signUpPage || pageToShow == forgotPasswordPage) {
    hideNavigitationPanels();
    centerBodyElementItems(true);
    addVerticalSpaceToMainContent(false);
    addLeftMarginSpaceToMainContent(false);
  }
  else {
    showNavigitationPanels();
    centerBodyElementItems(false);
    addVerticalSpaceToMainContent(true);
    addLeftMarginSpaceToMainContent(true);

    if (pageToShow === dashboardPage) {
      updateDashboard();  // ← update dashboard
    }
    else if(pageToShow === settingsPage) {
      populateSettings();    // ← Populate settings form
    }
  }

  // globalBackBtn.classList.add('d-none')
}

function hideSections() {
  document.querySelectorAll("section").forEach(section => {
    section.classList.add("d-none");
  });
}

function hideNavigitationPanels() {
  document.querySelector("#aside").classList.add("d-none");
  document.querySelector("#topNav").classList.add("d-none");
}

function showNavigitationPanels() {
  document.querySelector("#aside").classList.remove("d-none");
  document.querySelector("#topNav").classList.remove("d-none");
}

function centerBodyElementItems(shouldCenter = true) {
  if (shouldCenter) {
    bodyElement.classList.add("justify-content-center", "align-items-center")
  }
  else {
    bodyElement.classList.remove("justify-content-center", "align-items-center")
  }
}

function addVerticalSpaceToMainContent(addVerticalSpace = true) {
  if (addVerticalSpace) {
    mainElement.classList.add("applyVerticalPaddingToMain");
  }
  else {
    mainElement.classList.remove("applyVerticalPaddingToMain");
  }
}

function addLeftMarginSpaceToMainContent(addLeftMarginSpace = true) {
  if (addLeftMarginSpace) {
    mainElement.classList.add("mainContentMargin");
  }
  else {
    mainElement.classList.remove("mainContentMargin");
  }
}

async function sendVerificationEmail(user) {
  let verifyUrl = `http://127.0.0.1:5501/app.html#verifyEmail?email=${encodeURIComponent(user.email)}`;

  let payload = {
    email: user.email,
    subject: "Verify your email",
    displayName: "NAMAA"
  };

  try {
    let response = await fetch("https://smslive247api.readme.io/v5.0/reference/tokencreateemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_TOKEN"
      },
      body: JSON.stringify(payload)
    });
    var res = await response.json();

    //`Click the link below to verify:\n${verifyUrl}`
  }
  catch (err) {
    alert("An error happened while trying to send OTP to your email address. Please try again later.")
    //console.error(err);
  }
}

async function getCurrentUser() {
  let db = await loadDatabase();
  return db.bankUsers.find(u => u.id === currentUserId);
}

async function updateDashboard() {
  let user = await getCurrentUser();
  if (!user) return;

  // ---- Balances ----
  document.getElementById("usdBalance").textContent =
    `$${user.wallets.USD.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  document.getElementById("gbpBalance").textContent =
    `£${user.wallets.GBP.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  document.getElementById("eurBalance").textContent =
    `€${user.wallets.EUR.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  document.getElementById("ngnBalance").textContent =
    `₦${user.wallets.NGN.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  // ---- Transactions ----
  let tbody = document.getElementById("transactionsBody");
  tbody.innerHTML = ""; // clear previous items

  let allTx = [
    ...user.wallets.NGN.transactions,
    ...user.wallets.USD.transactions,
    ...user.wallets.GBP.transactions,
    ...user.wallets.EUR.transactions
  ];

  // Sort by date descending
  allTx.sort((a, b) => new Date(b.date) - new Date(a.date));

  allTx.slice(0, 5).forEach(tx => {
    let amountSign = tx.type === "Deposit" || tx.type === "FX Conversion" || tx.type === "Refund"
      ? "text-success"
      : "text-danger";

    let row = `
      <tr>
        <td>${tx.description}</td>
        <td>${tx.type}</td>
        <td>${new Date(tx.date).toLocaleString()}</td>
        <td class="${amountSign}">
          ${tx.currency === "NGN" ? "₦" : ""}${tx.amount.toLocaleString()}
        </td>
      </tr>
    `;

    tbody.insertAdjacentHTML("beforeend", row);
  });
}

async function populateSettings() {
  let user = await getCurrentUser();
  if (!user) return;

  document.getElementById("settingsFirstName").value = user.firstName;
  document.getElementById("settingsLastName").value = user.lastName;
  document.getElementById("settingsEmail").value = user.email;
  document.getElementById("settingsPhone").value = user.phone || "";
}


//---------------Base Functions-----------------------------------------------------------
function login() {
  let email = document.querySelector('#emailInput').value.trim()
  let password = document.querySelector('#passwordInput').value.trim()

  let foundUser = db.bankUsers.find(
    (user) => user.email == email && user.password == password
  )
  if (foundUser) {
    currentUserId = foundUser.id;
    // NEW: persist current user
    localStorage.setItem("currentUserId", currentUserId);

    showPage(dashboardPage);
  }
  else {
    alert('invalid email or password');
  }
}

async function createUser(fullName, email, password) {
  let db = await loadDatabase();

  // 1. Prevent duplicates
  if ( db.bankUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("User already exists");
  }

  // 2. Parse names
  let { firstName, lastName } = parseFullName(fullName);

  // 3. Generate account number
  let accountNumber = Date.now();

  // 4. Generate wallets
  let wallets = createWallets(accountNumber);

  // 6. Build the final user object
  let newUser = {
    firstName,
    lastName,
    email,
    emailVerified: false,
    phone: "",
    gender: "",
    address: "",
    DOB: "",
    accountNumber,
    password,
    wallets,
    electricity: {},
    water: {}
  };

  // 7. Save user
  return await addUser(newUser);
}


function deposit() {
  let currentUser = db.bankUsers.find(user => user.id === currentUserId);

  let depositValue = document.querySelector('#depositAmount').value.trim();
  let depositAmount = Number(depositValue);

  // Get selected method
  let selectedButton = document.querySelector('.deposit-method.active');
  let selectedMethod = selectedButton ? selectedButton.textContent.trim() : null;

  // invalid amount
  if (depositValue === "" || isNaN(depositAmount) || depositAmount < 100) {
    alert("Minimum deposit is ₦100");
    document.querySelector('#depositAmount').value = "";
    return;
  }

  // no method selected
  else if (!selectedMethod) {
    alert("Please select a deposit method");
    return;
  }

  // perform deposit
  else if (depositAmount >= 100 && currentUser && selectedMethod) {
    currentUser.wallets.NGN.balance += depositAmount;

    // clear inputs and reset selection
    document.querySelector('#depositAmount').value = "";
    document.querySelectorAll('.deposit-method').forEach(btn => btn.classList.remove('active'));
    document.querySelector('#depositBtn').classList.add('d-none');

    alert(`Deposit successful via ${selectedMethod}`);
  }

  else {
    alert("Please fill in the correct details");
    return;
  }
}

// Add event listeners only for method selection
document.querySelectorAll('.deposit-method').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.deposit-method').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show the Deposit button
    document.querySelector('#depositBtn').classList.remove('d-none');
  });
});



function transfer() {
  let currentUser = db.bankUsers.find(user => user.id === currentUserId);

  let email = document.querySelector('#transferEmail').value.trim().toLowerCase();
  let transferAmount = document.querySelector('#transferAmount').value.trim();
  let balance = currentUser.wallets.NGN.balance;

  let recipient = db.bankUsers.find(user => user.email.toLowerCase() === email);

  // recipient not found
  if (!recipient) {
    alert("Recipient not found");
    return;
  }

  // block self transfer
  else if (recipient.id === currentUser.id) {
    alert("You cannot transfer to yourself");
    return;
  }

  // insufficient funds
  else if (transferAmount > balance) {
    alert("Insufficient Funds");
    return;
  }

  // perform transfer
  else if (currentUser && recipient && transferAmount <= balance) {
    currentUser.wallets.NGN.balance -= transferAmount;
    recipient.wallets.NGN.balance += transferAmount;

    document.querySelector('#transferEmail').value = "";
    document.querySelector('#transferAmount').value = "";

    alert("Transaction successful");
  }

  else {
    alert("Please fill in the correct details");
    return;
  }
}


function withdraw() {
  let currentUser = db.bankUsers.find(
    (user) => user.id === currentUserId
  );

  let bank = document.querySelector('#bankSelect').value;
  let accountNumber = document.querySelector('#accountnumberinput').value.trim();
  let withdrawAmount = Number(document.querySelector('#amountinput').value.trim());
  let balance = currentUser.wallets.NGN.balance;

  // invalid amount
  if (withdrawAmount <= 0 || isNaN(withdrawAmount)) {
    alert("Enter a valid amount");
    return;
  }

  // missing bank or account number
  else if (bank === "Select Bank" || accountNumber === "") {
    alert("Please select a bank and enter account number");
    return;
  }

  // insufficient funds
  else if (withdrawAmount > balance) {
    alert("Insufficient Funds");
    return;
  }

  // perform withdrawal
  else if (currentUser && withdrawAmount <= balance) {
    // deduct from sender
    currentUser.wallets.NGN.balance -= withdrawAmount;

    // clear form inputs
    document.querySelector('#bankSelect').value = "Select Bank";
    document.querySelector('#accountnumberinput').value = "";
    document.querySelector('#amountinput').value = "";

    alert("Withdrawal successful");
  }

  else {
    alert("Please fill in the correct details");
    return;
  }
}


async function updateUserProfile(userId, firstName, lastName, phone ) {
  // Update user object
  let updatedUser = await updateUser(userId, {
    firstName,
    lastName,
    phone
  });

  if(!updatedUser){
    throw new Error("Could not update user, database level error occurred.")
  }

  return updatedUser;
};

function changePwd() {

  let currentUser = db.bankUsers.find(
    (user) => user.id === currentUserId
  );


  if (currentUser) {
    let oldPassword = document.querySelector('#oldPasswordInput').value.trim();
    let newPassword = document.querySelector('#newPasswordInput').value.trim();

    if (currentUser.password == oldPassword) {
      //update the old user password with the new one
      currentUser.password = newPassword;
      showPage(loginPage);
    }
    else {
      console.log("invalid password")
    }

  }
  else {
    console.log("user not found")
  }
};

function verifyEmailFromUrl() {
  let params = new URLSearchParams(location.hash.split("?")[1]);
  let email = params.get("email");

  let user = db.bankUsers.find(u => u.email === email);
  if (user) {
    user.emailVerified = true;
    localStorage.setItem("bankUsers", JSON.stringify(db.bankUsers));
  }

  location.href = `app.html#login?verified=true&email=${encodeURIComponent(email)}`;
}


