

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
let depositNav = document.querySelector('#depositBtn')
let transferNav = document.querySelector('#transferBtn')
let withdrawNav = document.querySelector('#withdrawBtn')
let payBillsNav = document.querySelector('#payBillsBtn')
let settingsNav = document.querySelector('#settingsBtn')
let profileNav = document.querySelector('#profileBtn')

//form submittion buttons
let loginBtn = document.querySelector('#login-btn')
let toSignUpBtn = document.querySelector('#toSignUpBtn')
let depositAmountBtn = document.querySelector('#depositAmountBtn')
let transferAmountBtn = document.querySelector('#transferAmountBtn')
let withdrawalBtn = document.querySelector('#withdrawalBtn')
let changeBtn = document.querySelector('#changeBtn')
let signUpBtn = document.querySelector('#signUpBtn')
let toLoginBtn = document.querySelector('#toLogin')
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




//aside-nav
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




loginBtn.addEventListener("click", function () {
  console.log("button has been clicked")
  login()
});

signUpBtn.addEventListener("click", function () {
  signUpPage.classList.add('d-none')
  loginPage.classList.remove('d-none');
})

toSignUpBtn.addEventListener("click", function () {
  showPage(signUpPage);
})

toLoginBtn.addEventListener("click", function () {
  showPage(loginPage);
})

forgotPasswordBtn.addEventListener("click", function () {
  showPage(forgotPasswordPage);
})

depositAmountBtn.addEventListener("click", function () {
  deposit();
})

transferAmountBtn.addEventListener("click", function () {
  transfer();
})

withdrawalBtn.addEventListener("click", function () {
  withdrawPage.classList.add('d-none');
  withdraw();
})

changeBtn.addEventListener("click", function () {
  changePwd();
});

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


//Base Functions

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


function transfer() {
  let currentUser = bankUsers.find(
    (user) => user.id === currentUserId
  );

  let email = document.querySelector('#transferEmail').value.trim()
  let transferAmount = Number(document.querySelector('#transferInput').value.trim());
  let balance = currentUser.balance

  let receipientEmail = bankUsers.find(
    user => user.email.toLowerCase() === email
  );

  transferInput.value = "";
  if (currentUser && receipientEmail && transferAmount <= balance ) {
    let newBalance = balance - transferAmount
    currentUser.balance = newBalance;
    alert("Transaction successful");
  }
  

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
    alert("Transaction Successful.")
  }
  else if (currentUser && withdrawAmount > 0 && withdrawAmount > balance) {
    alert("insufficient funds.")
    return;
  }
  else {
    alert("Please fill in the correct details");
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


