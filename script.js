

//data structure: Object for holding data about budget
let budgetData = {
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
};

//updates array for storing user updates
let updates = [];

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
const incomeDescription = document.getElementById('incomeTitle');
const incomeInput = document.getElementById('incomeAmount');
const incomeCategory = document.getElementById('incomeCategory');
const incomeRecurrence = document.getElementById('incomeRecurrence');
const incomeForm = document.querySelector('.update-income');

//expense update form
const expenseDescription = document.getElementById('expenseTitle');
const expenseInput = document.getElementById('expenseAmount');
const expenseCategory = document.getElementById('expenseCategory');
const expenseRecurrence = document.getElementById('expenseRecurrence');
const expenseForm = document.querySelector('.update-expense');

//transaction form
const transactionDescription = document.getElementById('transactionTitle');
const transactionInput = document.getElementById('transactionAmount');
const transactionForm = document.querySelector('.update-transaction');

//updates list
const updatesContainer = document.querySelector('.updates-list-container');

//  === DISPLAY UPDATE FUNCTIONS ===
//styling for select sections
function updateSelectColor(select) {
    if(select.value == '') {
        select.style.color = '#8b8b8b';
    }
    else {
        select.style.color = 'black';
    }
}

function initializeSelectStyling() {
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        updateSelectColor(select);

        select.addEventListener('change', function() {
            updateSelectColor(this);
        });
    });
}

function updateDisplays() {
    balanceDisplay.textContent = `$${budgetData.totalBalance.toFixed(2)}`;  //round 2 decimals for proper format
    incomeDisplay.textContent = `$${budgetData.totalIncome.toFixed(2)}`;
    expenseDisplay.textContent = `$${budgetData.totalExpenses.toFixed(2)}`;
}   

function displayUpdates() {
    updatesContainer.innerHTML = '';
    updates.forEach((update) => {
        const updateItem = document.createElement('div');
        updateItem.className = 'update-item';

        let updateHTML = 
        `<span class="update-date">• Date: ${update.date}: </span>
        <span class="update-type">Type: ${update.type}</span>
        <span class="update-type">, Amount: $${update.amount.toFixed(2)}</span>`;
            
        //specifically targets transactions
        if(update.description !== null) {
            updateHTML += `<span class="update-description">, Description: ${update.description}</span>`;
        }
                
        //specifically targets income/expense
        if(update.category !== null) {
            updateHTML += `<span class="update-category">, Category: ${update.category}</span>`;
        } 
        if (update.recurrence !== null) {
            updateHTML += `<span class="update-recurrence">, Recurrence: ${update.recurrence}</span>`;
        }

        updateItem.innerHTML = updateHTML;
        updatesContainer.appendChild(updateItem);
    });
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

    updates.push({
        type: 'Balance',
        description: null,
        amount: amount,
        category: null,
        recurrence: null,
        date: new Date().toLocaleDateString(),
    });

    balanceInput.value = '';
    updateDisplays();
    displayUpdates();
}

//add income
function addIncome(e) {
    e.preventDefault();

    const amount = parseFloat(incomeInput.value);
    const description = incomeDescription.value;
    const category = incomeCategory.value;
    const recurrence = incomeRecurrence.value;

    budgetData.totalIncome += amount;

    updates.push({
        type: 'Income',
        description: description,
        amount: amount,
        category: category,
        recurrence: recurrence,
        date: new Date().toLocaleDateString()
    });

    incomeDescription.value = '';
    incomeInput.value = '';
    incomeCategory.value = '';
    incomeRecurrence.value = '';

    //update select visual
    updateSelectColor(incomeCategory);
    updateSelectColor(incomeRecurrence);
    updateDisplays();
    displayUpdates();
}

//add expense
function addExpense(e) {
    e.preventDefault();

    const amount = parseFloat(expenseInput.value);
    const description = expenseDescription.value;
    const category = expenseCategory.value;
    const recurrence = expenseRecurrence.value;

    budgetData.totalExpenses += amount;

    updates.push({
        type: 'Expense',
        description: description,
        amount: amount,
        category: category,
        recurrence: recurrence,
        date: new Date().toLocaleDateString()
    });

    expenseDescription.value = '';
    expenseInput.value = '';
    expenseCategory.value = '';
    expenseRecurrence.value ='';

    updateSelectColor(expenseCategory);
    updateSelectColor(expenseRecurrence);
    updateDisplays();
    displayUpdates();
}

//add transaction
function addTransaction(e) {
    e.preventDefault();

    const amount = parseFloat(transactionInput.value);
    const description = transactionDescription.value;

    budgetData.totalBalance -= amount;

    if(budgetData.totalBalance < 0) {
        
        balanceDisplay.style.color = '#CD5C5C';
    }
    if(budgetData.totalBalance > 0) {
        balanceDisplay.style.color = '#388E3C';
    }

    updates.push({
        type: 'Transaction',
        description: description,
        amount: amount,
        category: null,
        recurrence: null,
        date: new Date().toLocaleDateString()
    });

    transactionDescription.value = '';
    transactionInput.value = '';
    updateDisplays();
    displayUpdates();
}

//  === EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', function() {
    initializeSelectStyling();

    if(balanceForm) {
        balanceForm.addEventListener('submit', updateBalance);
    }

    if(incomeForm) {
        incomeForm.addEventListener('submit', addIncome, updateSelectColor(incomeCategory), updateSelectColor(incomeRecurrence));
    }

    if(expenseForm) {
        expenseForm.addEventListener('submit', addExpense, updateSelectColor(expenseCategory), updateSelectColor(expenseRecurrence));
    }

    if(transactionForm) {
        transactionForm.addEventListener('submit', addTransaction);
    }
});

