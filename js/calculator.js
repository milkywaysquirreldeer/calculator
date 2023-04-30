const add = function (x, y) {
  return x + y;
}

const subtract = function (x, y) {
  return x - y;
}

const multiply = function (x, y) {
  return x * y;
}

const divide = function (x, y) {
  return x / y;
}

let firstNumber;
let operator;
let secondNumber;
const display = document.querySelector('.display');

const operate = function(operator, firstNumber, secondNumber) {
  switch(operator) {
    case '+':
      display.innerText = add(firstNumber, secondNumber);
      break;
    case '-':
      display.innerText = subtract(firstNumber, secondNumber);
      break;
    case '*':
      display.innerText = multiply(firstNumber, secondNumber);
      break;
    case '/':
      display.innerText = divide(firstNumber, secondNumber);
  }
};

let valueFromDisplay;

/* Provides visual feedback upon button presses when no characters will be
    added to the display */
const blinkCalculatorDisplay = function() {
  display.classList.add('blink-display');
  setTimeout(() => display.classList.remove('blink-display'), 100);
};

const defaultZero = '0';

const displayPressedButton = function(buttonValue) {
  const characterLimit = 8;
  if (!(display.innerText.length >= characterLimit)) {
    if (display.innerText === defaultZero) {
      if (buttonValue === '0') { // Do not accept leading zeros as input
        blinkCalculatorDisplay();
      } else { // Accept first digit of input
        display.innerText = buttonValue;
      }
    } else { // Accept subsequent digit of input
      if (buttonValue === '.' && display.innerText.includes('.')) {
        // Prevent multiple decimal points
        blinkCalculatorDisplay();
      } else {
        display.innerText += buttonValue;
      }
    }
     valueFromDisplay = Number.parseFloat(display.innerText);
  } else { // Display was already full before button press
    blinkCalculatorDisplay();
  }
};

//const clearDisplay = () => display.innerText = '0';
const clearDisplay = function() {
  if (display.innerText === defaultZero) { // Display is already cleared
    blinkCalculatorDisplay();
  } else {
    display.innerText = defaultZero;
  }
};

document.querySelector('.clear-button').addEventListener('click',
 clearDisplay);

const digitButtons = document.querySelectorAll('.digit-button');

digitButtons.forEach(button => button.addEventListener('click', () =>
 displayPressedButton(button.dataset.number)));

document.querySelectorAll('.operator-button').forEach(button =>
 button.addEventListener('click', () => blinkCalculatorDisplay()));
