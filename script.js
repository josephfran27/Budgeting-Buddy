

//data structure: Object for holding data about budget
let budgetData = {
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    transactions: [],   //array for all transactions
    incomeEntries: [],  //array for all income submissions
    expenseEntries: []  //array for all expense submissions
};

//DOM ELEMENTS
//the three display cards
const balanceDisplay = document.getElementById('balance');

//FORM AND INPUT
//balance update form
const balanceForm = document.querySelector('.update-balance');
const balanceInput = document.getElementById('balanceAmount');

//DISPLAY UPDATE FUNCTIONS
function updateDisplays() {
    balanceDisplay.textContent = `${budgetData.totalBalance.toFixed(2)}`;  //round 2 decimals for proper format
}

//MAIN FUNCTIONS
function updateBalance(e) {
    e.preventDefault();     //prevents form from submitting normalls (refreshes page)

    const amount = parseFloat(balanceInput.value);
    budgetData.totalBalance = amount;
    balanceInput.value = '';
    updateDisplays();
    showMessage('Balance updated successfully!');

}

//EVENT LISTENERS
document.addEventListener('DOMContentLoaded', function() {
    if(balanceForm) {
        balanceForm.addEventListener('submit', updateBalance);
    }

    updateDisplays;
});

