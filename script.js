'use strict';

const openTransaction = document.getElementById('open-transaction');
const logINForm = document.querySelectorAll('.login-form');

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

console.log(accounts);

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

// submit the user login details

logINForm.forEach(form => {
  form.addEventListener('submit', logIN);
});

/**
 * Display the transaction logs of the user.
 * @param {object} data - The details and transaction history of the user
 */
function displayTransactionLogs(data) {
  const container = document.getElementById('logs');
  const fragment = document.createDocumentFragment();
  for (const log of data) {
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
                ${log > 0 ? '2 deposit' : '1 withdrawal'}
              </div>
              <div class="text-[#666]">3 days ago</div>
              <div class=" font-medium ${
                log > 0 ? 'text-green-500' : 'text-red-500'
              } ">${log}€</div>
            </div>`;
    container.insertAdjacentHTML("afterbegin" , item)
  }
}

/**
 * login the user if the accout matches
 * @param {form} e - get the form to be submited
 */
function logIN(e) {
  e.preventDefault(); // prevent the default form submission

  const userName = e.target.querySelector('.user-name'); // get the targeted form username
  const userKey = e.target.querySelector('.user-password'); // get the targeted form password
  const wellcomeText = document.getElementById('logo-text');

  // find account that matches the userName
  const userAccount = accounts.find(user => user.owner === userName.value);
  if (!userAccount) return;

  if (userAccount) {
    //confirm the password
    if (userAccount.pin === Number(userKey.value)) {
      displayTransactionLogs(userAccount.movements);
      wellcomeText.textContent = `wellcome ${userAccount.owner.split(' ')[0]}`;
      document.body.classList.add('islogin');
    } else {
      userKey.classList.add('border-[1px]');
      userKey.classList.add('border-red-400');
    }
  }
}
