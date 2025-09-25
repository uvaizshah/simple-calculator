// Get DOM elements
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const percentButton = document.getElementById('percent');
const decimalButton = document.getElementById('decimal');

// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

// Initialize calculator
function initialize() {
    updateDisplay();
    setupEventListeners();
}

// Update the calculator display
function updateDisplay() {
    currentOperandElement.textContent = formatDisplayNumber(currentOperand);
    
    if (operation != null) {
        previousOperandElement.textContent = `${formatDisplayNumber(previousOperand)} ${operation}`;
    } else {
        previousOperandElement.textContent = '';
    }
}

// Format numbers for display
function formatDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    
    let integerDisplay;
    
    if (isNaN(integerDigits)) {
        integerDisplay = '0';
    } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Number buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', () => appendNumber(button.textContent));
    });
    
    // Operator buttons
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => setOperation(button.textContent));
    });
    
    // Equals button
    equalsButton.addEventListener('click', calculate);
    
    // Clear button
    clearButton.addEventListener('click', clear);
    
    // Delete button
    deleteButton.addEventListener('click', deleteNumber);
    
    // Percent button
    percentButton.addEventListener('click', percent);
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyboardInput);
}

// Append number to display
function appendNumber(number) {
    if (currentOperand === '0' || shouldResetScreen) {
        resetScreen();
    }
    
    // Prevent multiple decimal points
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Handle zero button for single zero display
    if (number === '0' && currentOperand === '0') return;
    
    currentOperand = currentOperand.toString() + number.toString();
    updateDisplay();
}

// Reset the screen
function resetScreen() {
    currentOperand = '';
    shouldResetScreen = false;
}

// Set operation
function setOperation(op) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        calculate();
    }
    
    operation = op;
    previousOperand = currentOperand;
    shouldResetScreen = true;
    updateDisplay();
}

// Calculate result
function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '−':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                clear();
                currentOperandElement.textContent = 'Error';
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    
    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    shouldResetScreen = true;
    updateDisplay();
}

// Clear calculator
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    shouldResetScreen = false;
    updateDisplay();
}

// Delete last digit
function deleteNumber() {
    if (currentOperand === '0') return;
    
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.toString().slice(0, -1);
    }
    
    updateDisplay();
}

// Calculate percentage
function percent() {
    if (currentOperand === '') return;
    
    currentOperand = (parseFloat(currentOperand) / 100).toString();
    updateDisplay();
}

// Handle keyboard input
function handleKeyboardInput(e) {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '=' || e.key === 'Enter') calculate();
    if (e.key === 'Backspace') deleteNumber();
    if (e.key === 'Escape') clear();
    if (e.key === '%') percent();
    
    if (e.key === '+') setOperation('+');
    if (e.key === '-') setOperation('−');
    if (e.key === '*') setOperation('×');
    if (e.key === '/') setOperation('÷');
}

// Initialize the calculator when the page loads
window.addEventListener('DOMContentLoaded', initialize);