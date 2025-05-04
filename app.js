/**
 * Cash Register Calculator
 * Main application JavaScript file
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize feather icons if available
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Check if the page has a print button and attach event listener
    const printButton = document.getElementById('print-button');
    if (printButton) {
        printButton.addEventListener('click', printResults);
    }
});

/**
 * Print the cash register results
 */
function printResults() {
    // Check if formatCurrency function exists (might be defined in aus.js)
    if (typeof formatCurrency !== 'function') {
        // Define the formatCurrency function if not available
        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-AU', {
                style: 'currency',
                currency: 'AUD',
                minimumFractionDigits: 2
            }).format(amount);
        }
    }
    // Prepare print view
    const originalContent = document.body.innerHTML;
    
    // Get the current date and time
    const currentDate = new Date().toLocaleString();
    
    // Get all the denomination values and totals
    const denominationValues = {};
    const inputs = document.querySelectorAll('.count-input');
    inputs.forEach(input => {
        const id = input.id;
        const label = input.closest('.denomination').querySelector('label').textContent;
        const value = parseInt(input.value) || 0;
        const amount = value * parseFloat(input.dataset.value);
        
        if (value > 0) {
            denominationValues[id] = {
                label,
                count: value,
                amount: amount
            };
        }
    });
    
    // Get the totals
    const notesTotal = document.getElementById('notes-total').textContent;
    const coinsTotal = document.getElementById('coins-total').textContent;
    const grandTotal = document.getElementById('grand-total').textContent;
    const notesCount = document.getElementById('notes-count').textContent;
    const coinsCount = document.getElementById('coins-count').textContent;
    
    // Create a simplified print layout
    let printContent = `
        <div class="print-container">
            <div class="print-header">
                <h1>Cash Register Count</h1>
                <p class="print-date">Date: ${currentDate}</p>
            </div>
            
            <div class="print-summary">
                <div class="print-grand-total">
                    <strong>TOTAL:</strong> ${grandTotal}
                </div>
                <div class="print-total-item">
                    <strong>Notes:</strong> ${notesTotal} (${notesCount} notes)
                </div>
                <div class="print-total-item">
                    <strong>Coins:</strong> ${coinsTotal} (${coinsCount} coins)
                </div>
            </div>
            
            <div class="print-details">
                <h2>Count Details</h2>
                <table class="print-table">
                    <thead>
                        <tr>
                            <th>Denomination</th>
                            <th>Count</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Add rows for notes
    const noteInputs = Array.from(inputs).filter(input => input.dataset.type === 'note');
    if (noteInputs.some(input => parseInt(input.value) > 0)) {
        printContent += `<tr class="category-row"><td colspan="3">Notes</td></tr>`;
        // Sort notes by value (highest first)
        noteInputs.sort((a, b) => parseFloat(b.dataset.value) - parseFloat(a.dataset.value));
        noteInputs.forEach(input => {
            const id = input.id;
            const count = parseInt(input.value) || 0;
            if (count > 0) {
                const data = denominationValues[id];
                printContent += `
                    <tr>
                        <td>${data.label}</td>
                        <td>${data.count}</td>
                        <td>${formatCurrency(data.amount)}</td>
                    </tr>
                `;
            }
        });
    }
    
    // Add rows for coins
    const coinInputs = Array.from(inputs).filter(input => input.dataset.type === 'coin');
    if (coinInputs.some(input => parseInt(input.value) > 0)) {
        printContent += `<tr class="category-row"><td colspan="3">Coins</td></tr>`;
        // Sort coins by value (highest first)
        coinInputs.sort((a, b) => parseFloat(b.dataset.value) - parseFloat(a.dataset.value));
        coinInputs.forEach(input => {
            const id = input.id;
            const count = parseInt(input.value) || 0;
            if (count > 0) {
                const data = denominationValues[id];
                printContent += `
                    <tr>
                        <td>${data.label}</td>
                        <td>${data.count}</td>
                        <td>${formatCurrency(data.amount)}</td>
                    </tr>
                `;
            }
        });
    }
    
    printContent += `
                    </tbody>
                </table>
            </div>
            
            <div class="print-footer">
                <p>Cash Register Calculator</p>
            </div>
        </div>
    `;
    
    // Replace content, print, and restore
    document.body.innerHTML = printContent;
    
    window.print();
    
    // Restore original content
    document.body.innerHTML = originalContent;
    
    // Re-initialize any event listeners
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Reattach event listener for print button
    const newPrintButton = document.getElementById('print-button');
    if (newPrintButton) {
        newPrintButton.addEventListener('click', printResults);
    }
    
    // Re-initialize calculation functions if on the Australian dollar page
    if (window.location.pathname.includes('aus.html')) {
        initAustralianCalculator();
    }
}
