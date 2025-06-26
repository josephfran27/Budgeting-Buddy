

//data structure: Object for holding data about budget
let budgetData = {
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0
};

//DOM ELEMENTS
//the three display cards
const balanceDisplay = document.getElementById('balance');
const incomeDisplay = document.getElementById('income');

//FORM AND INPUT
//balance update form
const balanceInput = document.getElementById('balanceAmount');
const balanceForm = document.querySelector('.update-balance');

//income update form
const incomeInput = document.getElementById('incomeAmount');
const incomeCategory = document.getElementById('incomeCategory');
const incomeForm = document.querySelector('.update-income');

//DISPLAY UPDATE FUNCTIONS
function updateDisplays() {
    balanceDisplay.textContent = `${budgetData.totalBalance.toFixed(2)}`;  //round 2 decimals for proper format
    incomeDisplay.textContent = `${budgetData.totalIncome.toFixed(2)}`;
}   

//MAIN FUNCTIONS
function updateBalance(e) {
    e.preventDefault();     //prevents form from submitting normalls (refreshes page)

    const amount = parseFloat(balanceInput.value);
    budgetData.totalBalance = amount;

    balanceInput.value = '';
    updateDisplays();
}

function addIncome(e) {
    e.preventDefault();

    const amount = parseFloat(incomeInput.value);

    budgetData.totalIncome += amount;

    incomeInput.value = '';
    incomeCategory.value = '';
    updateDisplays();
}

//EVENT LISTENERS
document.addEventListener('DOMContentLoaded', function() {
    if(balanceForm) {
        balanceForm.addEventListener('submit', updateBalance);
    }

    if(incomeForm) {
        incomeForm.addEventListener('submit', addIncome);
    }
});

