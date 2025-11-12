

import { nigeriaBanks, bankUsers } from "./Db.js"

let currentPageIndex = 0;
let currentUserId;

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
let dashboardNav = document.querySelector('#dashboardBtn')
let transferNav = document.querySelector('#transferBtn')
let withdrawNav = document.querySelector('#withdrawBtn')
let changePwdNav = document.querySelector('#changePwdBtn')
let payBillsNav = document.querySelector('#payBillsBtn')
let settingsNav = document.querySelector('#settingsBtn')

//form submittion buttons
let loginBtn = document.querySelector('#login-btn')
let toSignUpBtn = document.querySelector('#toSignUpBtn')
let sendBtn = document.querySelector('#sendBtn')
let withdrawalBtn = document.querySelector('#withdrawalBtn')
let changeBtn = document.querySelector('#changeBtn')
let signUpBtn = document.querySelector('#signUpBtn')
let toLoginBtn = document.querySelector('#toLogin')
let forgotPasswordBtn = document.querySelector('#forgotPasswordBtn')
 let signOutBtn = document.querySelector('#signOutBtn')



//pages
let loginPage = document.querySelector('#login')
let dashboardPage = document.querySelector('#dashboard')
let transferPage = document.querySelector('#transfer')
let withdrawPage = document.querySelector('#withdraw')
let changePwdPage = document.querySelector('#changePwd')
let payBillsPage = document.querySelector('#payBills')
let signUpPage = document.querySelector('#signUp')
let settingsPage = document.querySelector('#settings')
let asidePage = document.querySelector('#aside')
let forgotPasswordPage = document.querySelector('#forgotPassword')





dashboardNav.addEventListener("click", function () {
  showPage(dashboardPage)
})

transferNav.addEventListener("click", function () {
  showPage(transferPage)
})

withdrawNav.addEventListener("click", function () {
  showPage(withdrawPage);
})

settingsNav.addEventListener("click", function () {
  showPage(settingsPage)
})

changePwdNav.addEventListener("click", function () {
  showPage(settingsPage)
})

payBillsNav.addEventListener("click", function () {
  showPage(payBillsPage)
})



sendBtn.addEventListener("click", function () {
  newBalPage.classList.remove('d-none');
  showGlobalBackBtn()
})

withdrawalBtn.addEventListener("click", function () {
  withdrawPage.classList.add('d-none');
  withdraw();
  newBalPage.classList.remove('d-none');
})

signUpBtn.addEventListener("click", function () {
  signUpPage.classList.add('d-none')
  loginPage.classList.remove('d-none');
})

toSignUpBtn.addEventListener("click", function () {
  signUpPage.classList.remove('d-none')
  loginPage.classList.add('d-none');
})

changeBtn.addEventListener("click", function () {
  changePwd();
});

loginBtn.addEventListener("click", function () {
  console.log("button has been clicked")
  login()
});

toLoginBtn.addEventListener("click", function () {
  showPage(loginPage);
})

forgotPasswordBtn.addEventListener("click", function () {
  showPage(forgotPasswordPage);
})

signOutBtn.addEventListener("click", function() {
  showPage(loginPage);
})













detectPageToShow()
function detectPageToShow() {
  let currentPage = location.hash.substring(1);
  switch (currentPage) {
    case "login":
      showPage(loginPage);
      break;
    case "register":
      showPage(signUpPage);
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

function login() {
  let email = document.querySelector('#emailInput').value.trim()
  let password = document.querySelector('#passwordInput').value.trim()

  let foundUser = bankUsers.find(
    (user) => user.email == email && user.password == password
  )
  console.log(foundUser)
  if (foundUser) {
    console.log(foundUser.id)
    console.log("login successful")

    showPage(dashboardPage);
  }
  else {
    alert('invalid email or password');
  }
  return foundUser;
}

//get current user id after being logged in
//get the current user using the current user id in step 1
// confirm if the old password passed into the form exists 
//replace the old password with the nw password passed

function greetUser(name) {
  const hour = new Date().getHours();
  let time;
  if (hour >= 0 && hour < 12) {
    time = "Morning";
  }
  else if (hour >= 12 && hour < 17) {
    time = "Afternoon";
  }
  else {
    time = "Evening";
  }
  console.log(`Good ${time}, ${name}`);
}

function withdraw() {
  let currentUser = bankUsers.find(
    (user) => user.id === currentUserId
  );

  let withdrawAmount = Number(document.querySelector('#withdrawInput').value.trim());
  let balance = currentUser.balance
  withdrawInput.value = "";
  if (currentUser && withdrawAmount <= balance) {

    let newBalance = balance - withdrawAmount
    currentUser.balance = newBalance;
    newBalPage.textContent = `Hello ${currentUser.firstName}, your new balance is ₦${currentUser.balance.toLocaleString()}`;
  }
  else if (currentUser && withdrawAmount > 0 && withdrawAmount > balance) {
    alert("insufficient funds.")
    return;
  }
  else {
    alert("Please enter a valid amount.");
    return;
  }
}

function changePwd() {

  let currentUser = bankUsers.find(
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


