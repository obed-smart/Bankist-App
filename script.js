'use strict';

const loginForms = document.querySelectorAll('.login-form');
const wellcomeText = document.getElementById('logo-text');
const openTransaction = document.getElementById('open-transaction');
const logOutButton = document.getElementById('logout-btn');
const transferForm = document.querySelector('.transfer');
const closeAccountForm = document.querySelector('.close-account');
const loanMoneyForm = document.querySelector('.loan-money');
const sortBtn = document.querySelector('.sort-btn');
const currentTime = document.querySelectorAll('.current-time');

// Data
const account1 = {
  owner: 'js',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  movementsDates: [
    '2024-12-23T07:42:02.383Z',
    '2024-12-30T09:15:04.904Z',
    '2025-01-10T21:31:17.178Z',
    '2025-02-01T00:00:00.000Z',
    '2025-02-01T00:00:00.000Z',
    '2025-02-14T00:00:00.000Z',
    '2025-02-16T00:00:00.000Z',
    '2025-02-18T00:00:00.000Z',
  ],
  currency: 'USD',
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'jd',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  movementsDates: [
    '2024-12-23T07:42:02.383Z',
    '2024-12-30T09:15:04.904Z',
    '2025-01-10T21:31:17.178Z',
    '2025-02-01T00:00:00.000Z',
    '2025-02-01T00:00:00.000Z',
    '2025-02-14T00:00:00.000Z',
    '2025-02-16T00:00:00.000Z',
    '2025-02-18T00:00:00.000Z',
  ],
  currency: 'NGN',
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  movementsDates: [
    '2024-12-23T07:42:02.383Z',
    '2024-12-30T09:15:04.904Z',
    '2025-01-10T21:31:17.178Z',
    '2025-02-01T00:00:00.000Z',
    '2025-02-01T00:00:00.000Z',
    '2025-02-14T00:00:00.000Z',
    '2025-02-16T00:00:00.000Z',
    '2025-02-18T00:00:00.000Z',
  ],
  currency: 'GBP',
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  movementsDates: [
    '2024-12-23T07:42:02.383Z',
    '2024-12-30T09:15:04.904Z',
    '2025-01-10T21:31:17.178Z',
    '2025-02-01T00:00:00.000Z',
    '2025-02-01T00:00:00.000Z',
    '2025-02-14T00:00:00.000Z',
    '2025-02-16T00:00:00.000Z',
    '2025-02-18T00:00:00.000Z',
  ],
  currency: 'EUR',
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

// add event to open and close transactions log
// change the icon from up to down or vice vacer

openTransaction.addEventListener('click', e => {
  // Get the ion-icon element inside the button
  const icon = e.target;

  // Get the transaction container
  // add open the scale to full
  const transaction = document.querySelector('.MOVEMENTS');
  transaction.style.display = 'block';

  if (transaction.classList.contains('animateUP')) {
    transaction.classList.remove('animateUP');
    transaction.classList.add('animateDown');
  } else {
    transaction.classList.add('animateUP');
    transaction.classList.remove('animateDown');
  }

  // change the icon by name
  icon.setAttribute(
    'name',
    icon.getAttribute('name') === 'chevron-down-outline'
      ? 'chevron-up-outline'
      : 'chevron-down-outline'
  );
});

/**
 * check for the user and return one if found
 * @returns {object} - the user that matches the inputed name
 */

let currentUserAccount; //declearing the current user account

/**
 * login the user if the accout matches
 * @param {event} e - the form to be submitted
 */
function logIN(e) {
  e.preventDefault(); // Prevent default form submission

  const userName = e.target.querySelector('.user-name'); // Get username input
  const userKey = e.target.querySelector('.user-password'); // Get password input

  // Find account that matches the userName
  currentUserAccount = accounts.find(user => user.owner === userName.value);
  if (!currentUserAccount) return;

  if (currentUserAccount?.pin === Number(userKey.value)) {
    // Store user in localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(currentUserAccount));

    wellcomeText.textContent = `Welcome ${
      currentUserAccount.owner.split(' ')[0]
    }`;
    document.body.classList.add('islogin'); // Add class to indicate login
  } else {
    userKey.classList.add('border-[1px]', 'border-red-400');
  }
  updateUI(currentUserAccount);

  userName.value = userKey.value = '';
}

//// Auto-login on reload
document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (loggedInUser) {
    updateUI(loggedInUser);
    document.getElementById('logo-text').textContent = `Welcome ${
      loggedInUser.owner.split(' ')[0]
    }`;
    document.body.classList.add('islogin');
  }
});

// log the user out
function logOut() {
  localStorage.removeItem('loggedInUser');
  setTimeout(() => {
    document.body.classList.remove('islogin');
  }, 100);
  wellcomeText.textContent = 'Log in to get started';
}

/**
 * update all the ui when called
 * @param {object} currentUser - the curent logged in user
 */
function updateUI(currentUser) {
  displayTransactionLogs(currentUser);
  calcDisplaybalance(currentUser);
  calcDisplaySummary(currentUser);
}

/**
 * function to update and display date of transactions
 * @param {date} date - date of the transaction
 * @returns {date} The formated based on the user's locale
 */
function formatedTransactionDate(date) {
  // get the different between the future and now
  const calcPassedDate = (now, future) =>
    Math.round(Math.abs(future - now) / (1000 * 60 * 60 * 24));

  const passedDate = calcPassedDate(new Date(), date); // future date instance

  if (passedDate === 0) return 'Today';
  if (passedDate === 1) return 'Yesterday';
  if (passedDate <= 7) return `${passedDate} days ago`;

  // const day = `${date.getDate()}`.padStart(2, '0');
  // const month = `${date.getMonth() + 1}`.padStart(2, '0');
  // const year = date.getFullYear();

  return new Intl.DateTimeFormat(navigator.language).format(date);
}

/**
 * format the transactions based on user's locale
 * @param {object} account  - The user account
 * @returns {number} the formated money based on the currency and user's local
 */
function formatUserFunds(log, currency) {
  const userMoneyOptions = {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  };

  // dynamically format user money
  return new Intl.NumberFormat(navigator.language, userMoneyOptions).format(
    log
  );
}

/**
 * Display the transaction logs of the user.
 * @param {object} account - The details of the user
 */
function displayTransactionLogs(account, sort = false) {
  const container = document.getElementById('logs');
  container.innerHTML = '';
  const { movements } = account;
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  for (const [i, log] of movs.entries()) {
    const date = new Date(account.movementsDates[i]); // get date from date array

    const displayTime = formatedTransactionDate(date); // date to be deplayed on the page

    // dynamically format user money
    const userMoney = formatUserFunds(log, account.currency);

    const item = ` <div
              class="flex px-8 max-md:px-4 max-md:text-[14px] py-6 items-center justify-between border-b-[2px] border-b-[#eee]"
            >
              <div
                class="uppercase  ${
                  log > 0
                    ? 'bg-linear-[to_top_left,#39b385,#9be15d]'
                    : 'bg-linear-[to_top_left,#e52a5a,#ff585f]'
                } px-4 py-1 text-[#fff] rounded-full font-medium"
              >
                ${log > 0 ? `${i + 1} deposit` : `${i + 1} withdrawal`}
              </div>
              <div class="text-[#666]">${displayTime}</div>
              <div class=" font-medium ${
                log > 0 ? 'text-green-500' : 'text-red-500'
              } ">${userMoney}</div>
            </div>`;
    container.insertAdjacentHTML('afterbegin', item);
  }

  calcDisplaybalance(account);
  calcDisplaySummary(account);
}
//
/**
 * dispaly and update the current user account balance
 * display and update the current user account time and date of checking
 * @param {object} account - the user account
 */

function calcDisplaybalance(account) {
  // formate current balance date
  const now = new Date();
  const localeTime = navigator.language;

  const timeOptions = {
    dateStyle: 'medium',
    timeStyle: 'short',
  };

  for (const time of currentTime) {
    time.textContent = new Intl.DateTimeFormat(localeTime, timeOptions).format(
      now
    );
  }
  // display current balance
  const { movements } = account;
  const balace = document.querySelector('.balance');
  account.balace = movements.reduce((arr, cur) => arr + cur, 0);

  const userMoney = formatUserFunds(account.balace, account.currency);

  balace.textContent = userMoney;
}

/**
 * function to update the money IN , money OUT and the INTEREST and sort the transaction log
 * @param {object} account - the user account
 */
function calcDisplaySummary(account) {
  let { movements, interestRate } = account; // get the transaction and interestRate of the user account
  const originalMove = [...movements]; // create another copy of the transaction login

  const moneyIn = document.querySelector('.fund-in');
  const moneyOut = document.querySelector('.fund-out');
  const interest = document.querySelector('.fund-interest');

  // deposited money
  const deposit = movements
    .filter(num => num > 0)
    .reduce((total, num) => total + num, 0);

  // withdrawed money
  const withdrawal = movements
    .filter(num => num < 0, 0)
    .reduce((total, num) => Math.abs(total + num), 0);

  //interest rate
  const interestRates = movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * (interestRate / 100))
    .reduce((total, int) => total + int, 0);

  moneyIn.textContent = formatUserFunds(deposit, account.currency);
  moneyOut.textContent = formatUserFunds(withdrawal, account.currency);
  interest.textContent = formatUserFunds(interestRates, account.currency);
}

/**
 * transfer money to the chosen user
 * @param {event} e - the form to be submited
 */
function transferMoney(e) {
  e.preventDefault();
  const inputUserName = e.target.querySelector('.user-name');
  const inputAmout = e.target.querySelector('.amount');

  const amount = Number(inputAmout.value);
  const reciversAcc = accounts.find(user => user.owner === inputUserName.value);

  inputAmout.value = inputUserName.value = '';

  console.log(currentUserAccount);
  if (
    amount > 0 &&
    amount <= currentUserAccount.balace &&
    reciversAcc?.owner !== currentUserAccount.owner
  ) {
    currentUserAccount.movements.push(-amount);
    reciversAcc.movements.push(amount);

    currentUserAccount.movementsDates.push(new Date().toISOString()); // add transfer date
    reciversAcc.movementsDates.push(new Date().toISOString()); // add reciever date
    updateUI(currentUserAccount);
  }
}

/**
 * load money to the user
 * @param {event} e - the form to be submited
 */
function loanMoney(e) {
  e.preventDefault();
  const inputAmout = e.target.querySelector('.load-amount');
  const amount = Number(inputAmout.value);

  if (
    amount > 0 &&
    currentUserAccount.movements.some(mov => mov >= amount * 0.1)
  ) {
    currentUserAccount?.movements.push(amount);
    currentUserAccount.movementsDates.push(new Date().toISOString()); // add load date
    updateUI(currentUserAccount);
  }
  inputAmout.value = '';
}

/**
 * delete the user account
 * @param {event} e - the form to be submited
 */
function closeAccount(e) {
  e.preventDefault();
  const userName = e.target.querySelector('.user-name');
  const userPin = e.target.querySelector('.user-pin');

  // check if the username and pin matches the current account
  if (
    userName.value === currentUserAccount?.owner &&
    Number(userPin.value) === currentUserAccount.pin
  ) {
    // find the index of the current account
    const index = accounts.findIndex(
      acc =>
        acc.owner === currentUserAccount.owner &&
        acc.pin === currentUserAccount.pin
    );

    accounts.splice(index, 1); // remove the current account from the array
    document.body.classList.remove('islogin'); // hide the ui
    wellcomeText.textContent = 'Log in to get started';
  }
  userName.value = userPin.value = '';
}

let sorted = false; // initializing a sort

// sort the transaction log
sortBtn.addEventListener('click', () => {
  displayTransactionLogs(currentUserAccount, !sorted);
  sorted = !sorted; // switching the sorted
});

// event clicks

// Select both login forms
loginForms.forEach(form => {
  // Initialize login event listeners
  form.addEventListener('submit', logIN);
});

logOutButton.addEventListener('click', logOut); // logout action
transferForm.addEventListener('submit', transferMoney); // transfer money
loanMoneyForm.addEventListener('submit', loanMoney); // loan money
closeAccountForm.addEventListener('submit', closeAccount); // delete or close account
