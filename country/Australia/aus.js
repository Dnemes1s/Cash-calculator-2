/**
 * Australian Dollar Cash Register Calculator
 * Handles calculations specific to AUD currency
 */

document.addEventListener('DOMContentLoaded', () => {
    initAustralianCalculator();
    updateDateTime();
    setCurrentDate();
    loadUserName();
    
    // Update the date time every minute
    setInterval(updateDateTime, 60000);
    
    // Save user name when it changes
    const userNameInput = document.getElementById('user-name');
    if (userNameInput) {
        userNameInput.addEventListener('change', saveUserName);
    }
});

/**
 * Set the current date in the date input field
 */
function setCurrentDate() {
    const dateInput = document.getElementById('count-date');
    if (dateInput) {
        const today = new Date();
        // Format date as YYYY-MM-DD for the date input
        const formattedDate = today.toISOString().split('T')[0];
        dateInput.value = formattedDate;
    }
}

/**
 * Initialize the Australian Dollar calculator
 * Setting up event listeners and initial calculations
 */
function initAustralianCalculator() {
    // Add event listeners to all count inputs
    const countInputs = document.querySelectorAll('.count-input');
    countInputs.forEach(input => {
        input.addEventListener('input', calculateTotals);
    });
    
    // Reset button event listener
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', resetCalculator);
    }
    
    // Save button event listener
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
        saveButton.addEventListener('click', saveResults);
    }
    
    // Do initial calculation
    calculateTotals();
}

/**
 * Calculate all totals based on current input values
 */
function calculateTotals() {
    let notesTotal = 0;
    let coinsTotal = 0;
    let notesCount = 0;
    let coinsCount = 0;
    
    // Process all inputs
    const countInputs = document.querySelectorAll('.count-input');
    countInputs.forEach(input => {
        const value = parseFloat(input.dataset.value);
        const count = parseInt(input.value) || 0;
        const type = input.dataset.type;
        
        if (type === 'note') {
            notesTotal += value * count;
            notesCount += count;
        } else if (type === 'coin') {
            coinsTotal += value * count;
            coinsCount += count;
        }
    });
    
    // Update totals in the UI
    document.getElementById('notes-total').textContent = formatCurrency(notesTotal);
    document.getElementById('coins-total').textContent = formatCurrency(coinsTotal);
    document.getElementById('notes-count').textContent = notesCount;
    document.getElementById('coins-count').textContent = coinsCount;
    document.getElementById('grand-total').textContent = formatCurrency(notesTotal + coinsTotal);
}

/**
 * Format a number as AUD currency
 * @param {number} amount - The amount to format
 * @return {string} Formatted currency string
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 2
    }).format(amount);
}

/**
 * Reset all input fields to zero
 */
function resetCalculator() {
    if (confirm('Are you sure you want to reset all values to zero?')) {
        const countInputs = document.querySelectorAll('.count-input');
        countInputs.forEach(input => {
            input.value = 0;
        });
        calculateTotals();
    }
}

/**
 * Save the current results to localStorage
 */
function saveResults() {
    const timestamp = new Date().toISOString();
    
    // Collect all denomination values
    const denominations = {};
    const countInputs = document.querySelectorAll('.count-input');
    countInputs.forEach(input => {
        const id = input.id;
        const count = parseInt(input.value) || 0;
        denominations[id] = count;
    });
    
    // Get the user name
    const userName = document.getElementById('user-name').value || 'Anonymous';
    const countDate = document.getElementById('count-date').value;
    
    // Create save object
    const saveData = {
        timestamp: timestamp,
        userName: userName,
        countDate: countDate,
        notesTotal: document.getElementById('notes-total').textContent,
        coinsTotal: document.getElementById('coins-total').textContent,
        notesCount: document.getElementById('notes-count').textContent,
        coinsCount: document.getElementById('coins-count').textContent,
        grandTotal: document.getElementById('grand-total').textContent,
        denominations: denominations
    };
    
    // Get existing saves or initialize empty array
    const existingSaves = JSON.parse(localStorage.getItem('ausRegisterSaves')) || [];
    
    // Add new save and store back
    existingSaves.push(saveData);
    localStorage.setItem('ausRegisterSaves', JSON.stringify(existingSaves));
    
    alert('Cash count saved successfully!');
}

/**
 * Update the date and time display
 */
function updateDateTime() {
    const dateTimeElement = document.getElementById('current-date-time');
    if (dateTimeElement) {
        const now = new Date();
        dateTimeElement.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    }
}

/**
 * Save the user name to localStorage
 */
function saveUserName() {
    const userName = document.getElementById('user-name').value;
    localStorage.setItem('ausRegisterUserName', userName);
}

/**
 * Load the user name from localStorage
 */
function loadUserName() {
    const userNameInput = document.getElementById('user-name');
    if (userNameInput) {
        const savedName = localStorage.getItem('ausRegisterUserName');
        if (savedName) {
            userNameInput.value = savedName;
        }
    }
}

/**
 * Load a previously saved result
 * @param {string} timestamp - The timestamp of the save to load
 */
function loadSavedResult(timestamp) {
    const saves = JSON.parse(localStorage.getItem('ausRegisterSaves')) || [];
    const saveToLoad = saves.find(save => save.timestamp === timestamp);
    
    if (saveToLoad) {
        // Set all denomination values
        const denominations = saveToLoad.denominations;
        for (const [id, count] of Object.entries(denominations)) {
            const input = document.getElementById(id);
            if (input) {
                input.value = count;
            }
        }
        
        // Set user name if available
        if (saveToLoad.userName) {
            const userNameInput = document.getElementById('user-name');
            if (userNameInput) {
                userNameInput.value = saveToLoad.userName;
            }
        }
        
        // Set date if available
        if (saveToLoad.countDate) {
            const dateInput = document.getElementById('count-date');
            if (dateInput) {
                dateInput.value = saveToLoad.countDate;
            }
        }
        
        // Recalculate totals
        calculateTotals();
        
        alert('Saved cash count loaded successfully!');
    } else {
        alert('Could not find the saved cash count.');
    }
}

/**
 * Display a modal with saved results
 */
function showSavedResults() {
    const saves = JSON.parse(localStorage.getItem('ausRegisterSaves')) || [];
    
    if (saves.length === 0) {
        alert('No saved cash counts found.');
        return;
    }
    
    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'saved-results-modal';
    
    let modalContent = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Saved Cash Counts</h2>
            <div class="saved-list">
    `;
    
    // Add each save as a list item
    saves.forEach(save => {
        const saveDate = new Date(save.timestamp);
        const userName = save.userName || 'Anonymous';
        modalContent += `
            <div class="saved-item" data-timestamp="${save.timestamp}">
                <div class="saved-info">
                    <div class="saved-date">${saveDate.toLocaleDateString()} ${saveDate.toLocaleTimeString()}</div>
                    <div class="saved-user">By: ${userName}</div>
                    <div class="saved-total">${save.grandTotal}</div>
                </div>
                <button class="load-button">Load</button>
            </div>
        `;
    });
    
    modalContent += `
            </div>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    const loadButtons = modal.querySelectorAll('.load-button');
    loadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const timestamp = e.target.closest('.saved-item').dataset.timestamp;
            loadSavedResult(timestamp);
            document.body.removeChild(modal);
        });
    });
}
