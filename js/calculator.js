const calc = {
  display: {
    floatValue: 0,
    showingDefaultValue: true,
  },
  equation: {
    operator: undefined,
    firstNumber: undefined,
    secondNumber: undefined,
  },
  history: {
    lastCalculation: undefined,
    lastInputAccepted: undefined,
  },
};

const displayElement = document.querySelector('.display');

/* Provides visual feedback upon button presses when no characters will be
    changed in the display */
const blinkDisplay = function() {
  displayElement.classList.add('blink-display');
  setTimeout(() => displayElement.classList.remove('blink-display'), 100);
};

const writeToDisplay = function(buttonValue) {
  displayElement.innerText = buttonValue;
};

const appendToDisplay = function(buttonValue) {
  displayElement.innerText += buttonValue;
};

const parseDisplayToFloat = function(displayString) {
    calc.display.floatValue = Number.parseFloat(displayString);
};

const processDigitButton = function(buttonValue) {
  const characterLimit = 8;
  const operators = ['+', '-', '*', '/'];
  let lastInputWasOperator = false;
  for (const op of operators) {
    if (calc.history.lastInputAccepted === op)
     lastInputWasOperator = true;
  }
  if (displayElement.innerText.length < characterLimit) {
    if (calc.display.showingDefaultValue || lastInputWasOperator) {
      if (buttonValue === '0') { // drop input from any leading zeros
        blinkDisplay();
        return;
      } else { // button pressed was not '0'
        writeToDisplay(buttonValue);
        calc.display.showingDefaultValue = false;
      }
    } else { // not showingDefaultValue
      appendToDisplay(buttonValue);
    }
  } else { // display full; cannot accept input
    blinkDisplay();
    return;
  }
  calc.history.lastInputAccepted = buttonValue;
  parseDisplayToFloat(displayElement.innerText);
};

const operate = function(operator, firstNumber, secondNumber) {
  const add = (x, y) => x + y;
  const subtract = (x, y) => x - y;
  const multiply = (x, y) => x * y;
  const divide = (x, y) => x / y;
  
    switch(operator) {
    case '+':
      return add(firstNumber, secondNumber);
    case '-':
      return subtract(firstNumber, secondNumber);
    case '*':
      return multiply(firstNumber, secondNumber);
    case '/':
      return divide(firstNumber, secondNumber);
  }
};

const convertToDisplayString = function(number) {
  let displayString = number.toString();
  if (displayString.length <= 8) {
   return displayString;
   } else {
    return displayString.slice(0, 8);
  }
};

const processOperatorButton = function(buttonDataValue) {
  if (typeof calc.equation.firstNumber === 'undefined') {
    blinkDisplay();
    calc.equation.firstNumber = calc.display.floatValue;
    calc.equation.operator = buttonDataValue;
  } else { //firstNumber was defined already
    if (typeof calc.equation.secondNumber === 'undefined') {
      calc.equation.secondNumber = calc.display.floatValue;
      calc.history.lastCalculation = operate(calc.equation.operator,
       calc.equation.firstNumber, calc.equation.secondNumber);
      displayElement.innerText =
       convertToDisplayString(calc.history.lastCalculation);
      calc.display.floatValue = calc.history.lastCalculation;
      calc.equation.operator = buttonDataValue;
    } else { //secondNumber was defined already
      calc.equation.firstNumber = calc.history.lastCalculation;
      calc.equation.secondNumber = calc.display.floatValue;
      calc.history.lastCalculation = operate(calc.equation.operator,
       calc.equation.firstNumber, calc.equation.secondNumber);
      displayElement.innerText =
       convertToDisplayString(calc.history.lastCalculation);
      calc.display.floatValue = calc.history.lastCalculation;
      calc.equation.operator = buttonDataValue;
    }
  }
  calc.history.lastInputAccepted = buttonDataValue;
};

const clearEquation = function() {
  calc.equation.operator = undefined;
  calc.equation.firstNumber = undefined;
  calc.equation.secondNumber = undefined;
};

const clearDisplay = function() {
  const defaultZero = '0';
  if (displayElement.innerText === defaultZero) { //display is already cleared
    blinkDisplay();
  } else {
    calc.display.showingDefaultValue = true;
    displayElement.innerText = defaultZero;
    parseDisplayToFloat(displayElement.innerText);
  }
};

const clearButton = document.querySelector('.clear-button');
const digitButtons = document.querySelectorAll('.digit-button');
const operatorButtons = document.querySelectorAll('.operator-button');
const evaluationButton = document.querySelector('.evaluation-button');

clearButton.addEventListener('click', clearDisplay);
clearButton.addEventListener('click', clearEquation);

digitButtons.forEach(button => button.addEventListener('click', () =>
 processDigitButton(button.dataset.number)));

operatorButtons.forEach(button => button.addEventListener('click', () =>
 processOperatorButton(button.dataset.operator)));
