

//data structure: Object for holding data about budget
let budgetData = {
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0
};

//  === DOM ELEMENTS ===
//the three display cards
const balanceDisplay = document.getElementById('balance');
const incomeDisplay = document.getElementById('income');
const expenseDisplay = document.getElementById('expenses');

//  === FORM AND INPUT ===
//balance update form
const balanceInput = document.getElementById('balanceAmount');
const balanceForm = document.querySelector('.update-balance');

//income update form
const incomeInput = document.getElementById('incomeAmount');
const incomeCategory = document.getElementById('incomeCategory');
const incomeRecurrence = document.getElementById('incomeRecurrence');
const incomeForm = document.querySelector('.update-income');

//expense update form
const expenseInput = document.getElementById('expenseAmount');
const expenseCategory = document.getElementById('expenseCategory');
const expenseRecurrence = document.getElementById('expenseRecurrence');
const expenseForm = document.querySelector('.update-expense');

//transaction form
const transactionInput = document.getElementById('transactionAmount');
const transactionForm = document.querySelector('.update-transaction');

//  === DISPLAY UPDATE FUNCTIONS ===
function updateDisplays() {
    balanceDisplay.textContent = `$${budgetData.totalBalance.toFixed(2)}`;  //round 2 decimals for proper format
    incomeDisplay.textContent = `$${budgetData.totalIncome.toFixed(2)}`;
    expenseDisplay.textContent = `$${budgetData.totalExpenses.toFixed(2)}`;
}   

//  === MAIN FUNCTIONS ===
//update balance
function updateBalance(e) {
    e.preventDefault();     //prevents page refresh

    const amount = parseFloat(balanceInput.value);
    budgetData.totalBalance = amount;

    if(budgetData.totalBalance < 0) {
        balanceDisplay.style.color = '#CD5C5C';
    }
    if(budgetData.totalBalance > 0) {
        balanceDisplay.style.color = '#388E3C';
    }

    balanceInput.value = '';
    updateDisplays();
}

//add income
function addIncome(e) {
    e.preventDefault();

    const amount = parseFloat(incomeInput.value);

    budgetData.totalIncome += amount;

    incomeInput.value = '';
    incomeCategory.value = '';
    incomeRecurrence.value = '';
    updateDisplays();
}

//add expense
function addExpense(e) {
    e.preventDefault();

    const amount = parseFloat(expenseInput.value);

    budgetData.totalExpenses += amount;

    expenseInput.value = '';
    expenseCategory.value = '';
    expenseRecurrence.value ='';
    updateDisplays();
}

//add transaction
function addTransaction(e) {
    e.preventDefault();

    const amount = parseFloat(transactionInput.value);
    budgetData.totalBalance -= amount;

    if(budgetData.totalBalance < 0) {
        balanceDisplay.style.color = '#CD5C5C';
    }
    if(budgetData.totalBalance > 0) {
        balanceDisplay.style.color = '#388E3C';
    }

    transactionInput.value = '';
    updateDisplays();
}

//  === EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', function() {
    if(balanceForm) {
        balanceForm.addEventListener('submit', updateBalance);
    }

    if(incomeForm) {
        incomeForm.addEventListener('submit', addIncome);
    }

    if(expenseForm) {
        expenseForm.addEventListener('submit', addExpense);
    }

    if(transactionForm) {
        transactionForm.addEventListener('submit', addTransaction);
    }
});

