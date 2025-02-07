'use strict';

const openTransaction = document.getElementById('open-transaction');
const logOutButton = document.getElementById('logout-btn');

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
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

/**
 * login the user if the accout matches
 */
function logIN() {
  // Select both login forms
  const forms = document.querySelectorAll('.login-form');

  forms.forEach(form => {
    // Initialize login event listeners
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent default form submission

      const userName = form.querySelector('.user-name'); // Get username input
      const userKey = form.querySelector('.user-password'); // Get password input
      const wellcomeText = document.getElementById('logo-text');

      // Find account that matches the userName
      const userAccount = accounts.find(user => user.owner === userName.value);
      if (!userAccount) return;

      if (userAccount.pin === Number(userKey.value)) {
        // Store user in localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(userAccount));

        displayTransactionLogs(userAccount);
        wellcomeText.textContent = `Welcome ${userAccount.owner.split(' ')[0]}`;
        document.body.classList.add('islogin'); // Add class to indicate login
      } else {
        userKey.classList.add('border-[1px]', 'border-red-400');
      }
    });
  });
}

//// Auto-login on reload
document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (loggedInUser) {
    displayTransactionLogs(loggedInUser);
    document.getElementById('logo-text').textContent = `Welcome ${
      loggedInUser.owner.split(' ')[0]
    }`;
    document.body.classList.add('islogin');
  }
});

logIN();

// log the user out 
function logOut() {
  location.reload();
  localStorage.removeItem('loggedInUser');
  setTimeout(() => {
    document.body.classList.remove('islogin');
  }, 100);
}

logOutButton.addEventListener('click', logOut);

/**
 * Display the transaction logs of the user.
 * @param {object} data - The details and transaction history of the user
 */
function displayTransactionLogs(account) {
  const container = document.getElementById('logs');

  container.innerHTML = '';
  const { movements } = account;
  // console.log(data);
  const fragment = document.createDocumentFragment();
  for (const [i, log] of movements.entries()) {
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
              <div class="text-[#666]">3 days ago</div>
              <div class=" font-medium ${
                log > 0 ? 'text-green-500' : 'text-red-500'
              } ">${log}€</div>
            </div>`;
    container.insertAdjacentHTML('afterbegin', item);
  }

  calcDisplaybalance(movements);
  calcDisplaySummary(account);
}

function calcDisplaybalance(movements) {
  const balace = document.querySelector('.balance');
  const calcBalance = movements.reduce((arr, cur) => arr + cur, 0);
  balace.textContent = `${calcBalance}$`;
}

/**
 * function to update the money IN , money OUT and the INTEREST and sort the transaction log
 * @param {object} account - the user account
 */
function calcDisplaySummary(account) {
  let { movements, interestRate } = account; // get the transaction and interestRate of the user account
  const originalMove = [...movements]; // create another copy of the transaction login
  let isSorted = false;

  const moneyIn = document.querySelector('.fund-in');
  const moneyOut = document.querySelector('.fund-out');
  const interest = document.querySelector('.fund-interest');
  const sortBtn = document.querySelector('.sort-btn');

  // deposited money
  const deposit = movements
    .filter(num => num > 0, 0)
    .reduce((total, num) => total + num, 0);

  // withdrawed money
  const withdrawal = movements
    .filter(num => num < 0, 0)
    .reduce((total, num) => total + num, 0);

  //interest rate
  const interestRates = movements
    .map(mov => mov * interestRate)
    .reduce((total, num) => num + total, 0);

  moneyIn.textContent = `${deposit}€`;
  moneyOut.textContent = `${withdrawal}€`;
  interest.textContent = `${interestRates}€`;

  // sort the transaction log
  sortBtn.addEventListener('click', () => {
    if (!isSorted) {
      movements.sort();
    } else {
      movements = [...originalMove];
    }

    isSorted = !isSorted;
    displayTransactionLogs(account);
  });
}
