

// DASHBOARD SECTION
//data structure: Object for holding data about budget
let budgetData = {
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
};

//updates array for storing user updates
let updates = [];

//budget page variables for data consistency during multi-page navigation
let budgetTitle = 'Budget: 50/30/20 Rule';
let budgetType = 'template';


//function for loading from localStorage for data persistence per session
function loadDataFromMemory() {
    try {
        const savedBudgetData = sessionStorage.getItem('budgetData');
        const savedUpdates = sessionStorage.getItem('updates');
        const savedBudgetPercentages = sessionStorage.getItem('budgetPercentages');
        const savedBudgetTitle = sessionStorage.getItem('budgetTitle');
        const savedBudgetType = sessionStorage.getItem('budgetType');

        if(savedBudgetData) {
            budgetData = JSON.parse(savedBudgetData);
        }
        if(savedUpdates) {
            updates = JSON.parse(savedUpdates);
        }
        if(savedBudgetPercentages) {
            budgetPercentages = JSON.parse(savedBudgetPercentages);
        }
        if(savedBudgetTitle) {
            budgetTitle = savedBudgetTitle;
            const pageTitle = document.getElementById('budget-page-title');
            if(pageTitle) {
                pageTitle.textContent = budgetTitle;
            }
        }
        if(savedBudgetType) {
            budgetType = savedBudgetType;
        }
    }
    //if error, reset data
    catch(error) {
        console.error('Error loading data:', error);

        budgetData = {
            totalBalance: 0,
            totalIncome: 0,
            totalExpenses: 0,
        };
        updates = [];
        budgetPercentages = {
            bills: 25,
            food: 15,
            transportation: 10,
            social: 20,
            personal: 10,
            savings: 20
        };
        budgetTitle = 'Budget: 50/30/20 Rule';
        budgetType = 'template';
    }
}

//function for saving data to localStorage for data persistence per session
function saveDataToMemory() {
    try {
        sessionStorage.setItem('budgetData', JSON.stringify(budgetData));
        sessionStorage.setItem('updates', JSON.stringify(updates));
        sessionStorage.setItem('budgetPercentages', JSON.stringify(budgetPercentages));
        sessionStorage.setItem('budgetTitle', budgetTitle);
        sessionStorage.setItem('budgetType', budgetType);
    }
    catch(error) {
        console.log('Error saving data:', error);
    }
}

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

//one-time income form
const oneTimeDescription = document.getElementById('oneTimeTitle');
const oneTimeInput = document.getElementById('oneTimeAmount');
const oneTimeForm = document.querySelector('.update-one-time-income');

//clear button
const clearDashboard = document.getElementById('clear-dashboard-button');

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

// function for updating the select category/recurrense section colors upon input
function initializeSelectStyling() {
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        updateSelectColor(select);

        select.addEventListener('change', function() {
            updateSelectColor(this);
        });
    });
}

// function for updating the displays as inputs flow in 
function updateDisplays() {
    if (balanceDisplay) {
        balanceDisplay.textContent = `$${budgetData.totalBalance.toFixed(2)}`;  //round 2 decimals for proper format
    }
    if (incomeDisplay) {
        incomeDisplay.textContent = `$${budgetData.totalIncome.toFixed(2)}`;
    }
    if(expenseDisplay) {
        expenseDisplay.textContent = `$${budgetData.totalExpenses.toFixed(2)}`;
    }

    //update income display on budget section
    const budgetIncomeDisplay = document.querySelector('.income-display .income p');
    if(budgetIncomeDisplay) {
        budgetIncomeDisplay.textContent = `$${budgetData.totalIncome.toFixed(2)}`;
    }
    // FOR UPDATING BUDGET CHART WITH DATA
    if(budgetChart && budgetData.totalIncome > 0) {
        updateBudgetAllocations();
    }

    //save data
    saveDataToMemory();
}   

// function for displaying the user updates in the update list
function displayUpdates() {
    if(!updatesContainer) {
        return;
    }

    updatesContainer.innerHTML = '';
    updates.forEach((update) => {
        const updateItem = document.createElement('div');
        updateItem.className = 'update-item';

        let updateHTML = 
        `<span class="update-date">• Date: ${update.date}: </span>
        <span class="update-type">Type: ${update.type}</span>
        <span class="update-type">, Amount: $${update.amount.toFixed(2)}</span>`;
            
        //specifically targets transactions and one-time income
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

// function for updating the balance in dashboard.html
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

// function for adding income in dashboard.html
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

// function for adding expenses in dashboard.html
function addExpense(e) {
    e.preventDefault();

    const amount = parseFloat(expenseInput.value);
    const description = expenseDescription.value;
    const category = expenseCategory.value;
    const recurrence = expenseRecurrence.value;
    let amountCalculated;

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

// function for adding transactions in dashboard.html
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

// function for adding one time income in dashboard.html
function addOneTimeIncome(e) {
    e.preventDefault();

    const amount = parseFloat(oneTimeInput.value);
    const description = oneTimeDescription.value;

    budgetData.totalBalance += amount;

    if(budgetData.totalBalance < 0) {
        
        balanceDisplay.style.color = '#CD5C5C';
    }
    if(budgetData.totalBalance > 0) {
        balanceDisplay.style.color = '#388E3C';
    }

    updates.push({
        type: 'One-Time Income',
        description: description,
        amount: amount,
        category: null,
        recurrence: null,
        date: new Date().toLocaleDateString()
    });

    oneTimeDescription.value = '';
    oneTimeInput.value = '';
    updateDisplays();
    displayUpdates();
}


//function for clearing the budget percentage input section
function clearDashboardInputs(e) {
    if(e) {
        e.preventDefault();
    }

    if(balanceDisplay) {
        balanceDisplay.value = '0.00';
    }
    if(incomeDisplay) {
        incomeDisplay.value = '0.00';
    }
    if(expenseDisplay) {
        expenseDisplay.value = '0.00';
    }

    budgetData = {
        totalBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
    };

    updates = [];

    updateDisplays();
    displayUpdates();
}


//  === EVENT LISTENERS ===
// function for the event listeners to each page and page content updates/set up
document.addEventListener('DOMContentLoaded', function() {

    //load data from dashboard
    loadDataFromMemory();

    //initialize styling upon page loading
    initializeSelectStyling();
    
    //initialize the budgeting page
    initializeBudgetPage();

    //for populating custom form with current percentage inputs
    populateCustomForm();

    //for setting up custom budget section in budget.html
    setUpCustomButtons();

    //display loaded data
    updateDisplays();
    displayUpdates();

    //event listeners for dashboard.html
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

    if(oneTimeForm) {
        oneTimeForm.addEventListener('submit', addOneTimeIncome);
    }

    if(clearDashboard) {
        clearDashboard.addEventListener('click', clearDashboardInputs);
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

// function for initializing the budget.html page
function initializeBudgetPage() {
    const chartCanvas = document.getElementById('myChart');
    if(chartCanvas) {
        initializeBudgetChart();
        setUpTemplateButtons();
    }
}

// function for initializing the budget.html pie chart
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
                        // update stats display to include dollar amount
                        label: function(tooltipItem, data) {
                            const label = data.labels[tooltipItem.index];
                            const percentage = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            
                            if(budgetChart.allocations) {
                                const categories = ['bills', 'food', 'transportation', 'social', 'personal', 'savings'];
                                const categoryKey = categories[tooltipItem.index];
                                const dollarAmount = budgetChart.allocations[categoryKey];

                                return `${label} (${percentage}%): $${dollarAmount.toFixed(2)}`;
                            }
                            return `${label}: ${percentage}%`;
                        }
                    }
                }
        }
    });

    if(budgetData.totalIncome > 0) {
        updateBudgetAllocations();
    }
}

// function for updating the budget.html chart as things change
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
    
    updateBudgetAllocations();

    saveDataToMemory();
}

//function for calculating a dollar amount for each budgeting category based on income
function calculateBudgetAllocations() {
    const income = budgetData.totalIncome;

    // edge case handling
    if(income <= 0) {
        return {
            bills: 0,
            food: 0,
            transportation: 0,
            social: 0,
            personal: 0,
            savings: 0
        };
    }

    // get dollar amount per category according to percentage
    return {
        bills: (income * budgetPercentages.bills) / 100,
        food: (income * budgetPercentages.food) / 100,
        transportation: (income * budgetPercentages.transportation) / 100,
        social: (income * budgetPercentages.social) / 100,
        personal: (income * budgetPercentages.personal) / 100,
        savings: (income * budgetPercentages.savings) / 100
    };
}

//function for updating the pie chart data with dollar amounts
function updateBudgetAllocations() {
    if(!budgetChart) {
        return;
    }

    const allocations = calculateBudgetAllocations();

    budgetChart.data.datasets[0].data = [
        budgetPercentages.bills,
        budgetPercentages.food,
        budgetPercentages.transportation,
        budgetPercentages.social,
        budgetPercentages.personal,
        budgetPercentages.savings
    ];

    budgetChart.allocations = allocations;
    budgetChart.update();
}

// function for the updating the pie chart according to the clicking of the different template buttons with event listeners
function setUpTemplateButtons() {
    const templateButtons = document.querySelectorAll('.template-container .update-button');

    templateButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            let newBudget;
            const pageTitle = document.getElementById('budget-page-title');
            budgetType = 'template';

            switch(index) {
                // 50/30/20 rule
                case 0:
                    //change title and percentage divisions
                    budgetTitle = 'Budget: 50/30/20 Rule';
                    if(pageTitle) {
                        pageTitle.textContent = budgetTitle;
                    }
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
                    budgetTitle = 'Budget: 60/20/20 Rule';
                    if(pageTitle) {
                        pageTitle.textContent = budgetTitle;
                    }
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
                    budgetTitle = 'Budget: 80/20 Rule';
                    if(pageTitle) {
                        pageTitle.textContent = budgetTitle;
                    }               
                    newBudget = {
                        bills: 30,
                        food: 20,
                        transportation: 15,
                        social: 10,
                        personal: 5,
                        savings: 20
                    };
                    break;
                default:
                    return;
            }
            updateChart(newBudget);
        });
    });
}

// custom form DOM elements
const customBudgetForm = document.getElementById('custom-budget-form');
const billsInput = document.getElementById('billsPercentage');
const foodInput = document.getElementById('foodPercentage');
const transportationInput = document.getElementById('transportationPercentage');
const socialInput = document.getElementById('socialPercentage');
const personalInput = document.getElementById('personalPercentage');
const savingsInput = document.getElementById('savingsPercentage');
const percentageTotal = document.getElementById('percentageTotal');

//function for updating the percentage total as the user inputs
function updatePercentageTotal() {
    if(!percentageTotal) {
        return;
    }

    //checks if inputs are defined, if not, result is 0
    const bills = parseFloat(billsInput?.value) || 0;
    const food = parseFloat(foodInput?.value) || 0;
    const transportation = parseFloat(transportationInput?.value) || 0;
    const social = parseFloat(socialInput?.value) || 0;
    const personal = parseFloat(personalInput?.value) || 0;
    const savings = parseFloat(savingsInput?.value) || 0;

    const total = bills + food + transportation + social + personal + savings;

    percentageTotal.textContent = `Total: ${total}%`

    //if total === 100% 0r 0
    if(total === 100 || total === 0) {
        percentageTotal.style.color = '#388E3C';
    }
    //if total > 100%
    else if(total > 100) {
        percentageTotal.style.color = '#CD5C5C';
        percentageTotal.textContent += ' (Over 100%)';
    }

    //if total < 100%
    else if(total > 0 && total < 100) {
        percentageTotal.style.color = '#BA8534';
        percentageTotal.textContent += ' (Under 100%)';
    }
}

//function for populatng the form with current budget percentages as the user inputs
function populateCustomForm() {

    if(!customBudgetForm) {
        return;
    }

    if(budgetType === 'custom') {
        if(billsInput) {
            billsInput.value = budgetPercentages.bills;
        }
        if(foodInput) {
            foodInput.value = budgetPercentages.food;
        }
        if(transportationInput) {
            transportationInput.value = budgetPercentages.transportation;
        }
        if(socialInput) {
            socialInput.value = budgetPercentages.social;
        }
        if(personalInput) {
            personalInput.value = budgetPercentages.personal;
        }
        if(savingsInput) {
            savingsInput.value = budgetPercentages.savings;
        }
    }
    else {
        clearCustomPercentageInputs();
    }

    updatePercentageTotal();
}

//function for applying the custom budget form submission
function applyCustomPercentages(e) {
    e.preventDefault();

    const pageTitle = document.getElementById('budget-page-title');

    const bills = parseFloat(billsInput?.value) || 0;
    const food = parseFloat(foodInput?.value) || 0;
    const transportation = parseFloat(transportationInput?.value) || 0;
    const social = parseFloat(socialInput?.value) || 0;
    const personal = parseFloat(personalInput?.value) || 0;
    const savings = parseFloat(savingsInput?.value) || 0;

    const total = bills + food + transportation + social + personal + savings;

    //handling for the different cases for percentages
    if(total !== 100) {
        percentageTotal.style.color = '#CD5C5C';
        percentageTotal.textContent = 'Total percentages must equal 100 for submission.';
        return;
    }

    //update the budget percentages with the custom inputs
    budgetTitle = 'Budget: Custom';
    budgetType = 'custom';
    pageTitle.textContent = budgetTitle;
    const newBudget = {
        bills: bills,
        food: food,
        transportation: transportation,
        social: social,
        personal: personal,
        savings: savings
    };

    updateChart(newBudget);
}

//function for clearing the budget percentage input section
function clearCustomPercentageInputs(e) {
    if(e) {
        e.preventDefault();
    }

    if(billsInput) {
        billsInput.value = '';
    }
    if(foodInput) {
        foodInput.value = '';
    }
    if(transportationInput) {
        transportationInput.value = '';
    }
    if(socialInput) {
        socialInput.value = '';
    }
    if(personalInput) {
        personalInput.value = '';
    }
    if(savingsInput) {
        savingsInput.value = '';
    }

    const pageTitle = document.getElementById('budget-page-title');
    budgetTitle = 'Budget: 50/30/20 Rule';
    budgetType = 'template';
    if(pageTitle) {
        pageTitle.textContent = budgetTitle;
    }

    const defaultBudget = {
        bills: 25,
        food: 15,
        transportation: 10,
        social: 20,
        personal: 10,
        savings: 20
    };

    budgetPercentages = defaultBudget;

    if(budgetChart) {
        budgetChart.data.datasets[0].data = [
            defaultBudget.bills,
            defaultBudget.food,
            defaultBudget.transportation,
            defaultBudget.social,
            defaultBudget.personal,
            defaultBudget.savings
        ];
        updateBudgetAllocations();
    }

    //saves only budget related data
    try {
        sessionStorage.setItem('budgetPercentages', JSON.stringify(budgetPercentages));
        sessionStorage.setItem('budgetTitle', budgetTitle);
        sessionStorage.setItem('budgetType', budgetType);
    }
    catch(error) {
        console.log('Error saving budget data: ', error);
    }
}

//function for updating the pie chart with the custom budget percentage inputs and action listeners for the input sections
function setUpCustomButtons() {
    if(!customBudgetForm) {
        return;
    }

    const inputSections = [billsInput, foodInput, transportationInput, socialInput, personalInput, savingsInput];

    inputSections.forEach(input => {
        if(input) {
            input.addEventListener('input', updatePercentageTotal);
        }
    });

    customBudgetForm.addEventListener('submit', applyCustomPercentages);

    const clearButton = document.getElementById('clear-budget-button');

    if(clearButton) {
        clearButton.addEventListener('click', clearCustomPercentageInputs);
    }
}

// SAVINGS SECTION
