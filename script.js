

// DASHBOARD SECTION
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
    let amountCalculated;
    const description = incomeDescription.value;
    const category = incomeCategory.value;
    const recurrence = incomeRecurrence.value;

    //weekly pay calculated to monthly
    if(recurrence === 'weekly') {
        amountCalculated = (amount * 52) / 12;
    }
    //yearly
    else if(recurrence === 'yearly') {
        amountCalculated = amount / 12;
    }
    //monthly
    else { 
        amountCalculated = amount;
    }



    budgetData.totalIncome += amountCalculated;

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

    //weekly pay calculated to monthly
    if(recurrence === 'weekly') {
        amountCalculated = (amount * 52) / 12;
    }
    //yearly
    else if(recurrence === 'yearly') {
        amountCalculated = amount / 12;
    }
    //monthly
    else { 
        amountCalculated = amount;
    }

    budgetData.totalExpenses += amountCalculated;

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
    // for budget page
    initializeBudgetPage();

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

// BUDGETING SECTION
let budgetPercentages = {
    bills: 25,
    food: 15,
    transportation: 10,
    social: 20,
    personal: 10,
    savings: 20
};

let budgetChart;

//initializes page
function initializeBudgetPage() {
    const chartCanvas = document.getElementById('myChart');
    if(chartCanvas) {
        initializeBudgetChart();
        setUpTemplateButtons();
    }
}

//initializes chart
function initializeBudgetChart() {
    const ctx = document.getElementById('myChart').getContext('2d');

    budgetChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Bills', 'Food', 'Transportation', 'Social', 'Personal', 'Savings'],
            datasets: [{
                data: [
                    budgetPercentages.bills,            //need
                    budgetPercentages.food,             //need
                    budgetPercentages.transportation,   //need
                    budgetPercentages.social,           //want
                    budgetPercentages.personal,         //want
                    budgetPercentages.savings           //savings
                ],
                backgroundColor: [
                    '#2c702f',
                    '#2c702f',
                    '#2c702f',
                    '#46b24c',
                    '#46b24c',
                    '#C1F6C1'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,   //chart resizes according to container
            maintainAspectRatio: false, //chart fills container height
            legend: {
                    position: 'bottom',
                    //legend styling
                    labels: {
                        padding: 20,
                        usePointStyle: true //circle instead of square
                    }
                },
                tooltips: {
                    callbacks: {
                        // Display stats upon hover
                        label: function(tooltipItem, data) {
                            var label = data.labels[tooltipItem.index];
                            var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            return label + ': ' + value + '%';
                        }
                    }
                }
        }
    });
}

function updateChart(newData) {
    budgetPercentages = newData;
    budgetChart.data.datasets[0].data = [
        budgetPercentages.bills,
        budgetPercentages.food,
        budgetPercentages.transportation,
        budgetPercentages.social,
        budgetPercentages.personal,
        budgetPercentages.savings
    ];
    budgetChart.update();
}

function setUpTemplateButtons() {
    const templateButtons = document.querySelectorAll('.template-container .update-button');

    templateButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // let income = budgetData.totalIncome;
            // let expenses = budgetData.totalExpenses;

            let newBudget;
            let pageTitle = document.getElementById('budget-page-title');

            switch(index) {
                // 50/30/20 rule
                case 0:
                    //change title and percentage divisions
                    pageTitle.textContent = 'Budget: 50/30/20 Rule';
                    newBudget = {
                        bills: 25,
                        food: 15,
                        transportation: 10,
                        social: 20,
                        personal: 10,
                        savings: 20
                    };
                    break;
                // 60/20/20 rule
                case 1:
                    pageTitle.textContent = 'Budget: 60/20/20 Rule';
                    newBudget = {
                        bills: 30,
                        food: 20,
                        transportation: 10,
                        social: 10,
                        personal: 10,
                        savings: 20
                    };
                    break;
                //80/20 rule
                case 2:
                    pageTitle.textContent = 'Budget: 80/20 Rule';
                    newBudget = {
                        bills: 30,
                        food: 20,
                        transportation: 15,
                        social: 10,
                        personal: 5,
                        savings: 20
                    };
                    break;
            }
            updateChart(newBudget);
        });
    });
}

//implement
