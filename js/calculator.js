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
const blinkTheDisplay = function() {
  display.classList.add('blink-display');
  setTimeout(() => display.classList.remove('blink-display'), 100);
};

const displayPressedButton = function(character) {
  const maximumDigits = 8; // Max characters limited by calculator's display
  if (display.innerText.length < maximumDigits) {
    display.innerText === '0' ?
     display.innerText = character : display.innerText += character;
     valueFromDisplay = Number.parseFloat(display.innerText);
  } else {
    blinkTheDisplay();
  }
};

const clearDisplay = () => display.innerText = '0';

document.querySelector('.clear-button').addEventListener('click',
 clearDisplay);

const digitButtons = document.querySelectorAll('.digit-button');

digitButtons.forEach(button => button.addEventListener('click', () =>
 displayPressedButton(button.dataset.number)));

document.querySelectorAll('.operator-button').forEach(button =>
 button.addEventListener('click', () => blinkTheDisplay()));
