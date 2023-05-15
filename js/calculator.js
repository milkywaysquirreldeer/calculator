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
  let lastInputWasDecimal = false;
  let displayIsFull = false;
  
  for (const op of operators) {
    if (calc.history.lastInputAccepted === op)
     lastInputWasOperator = true;
  }

  if (buttonValue === '.') 
    lastInputWasDecimal = true;

  if (displayElement.innerText.length >= characterLimit)
   displayIsFull = true;

 switch(true) {
  //cases where input is dropped
  case ((calc.display.showingDefaultValue || lastInputWasOperator)
          && buttonValue === '0'):
  case (! lastInputWasOperator && displayIsFull):
  case (lastInputWasDecimal && displayElement.innerText.includes('.')):
    blinkDisplay();
    break;
  //cases where input overwrites current display 
  case ((calc.display.showingDefaultValue || lastInputWasOperator)
          && buttonValue !== '0'):
    writeToDisplay(buttonValue);
    calc.display.showingDefaultValue = false;
    calc.history.lastInputAccepted = buttonValue;
    parseDisplayToFloat(displayElement.innerText);
    break;
  default: //append input to currently displayed value
    appendToDisplay(buttonValue);
    calc.history.lastInputAccepted = buttonValue;
    parseDisplayToFloat(displayElement.innerText);
 }
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

  if (displayString.length <= 8)
   return displayString;
  else {
    const eighthCharacter = parseInt(displayString.slice(7, 8));

    if (eighthCharacter >= 5 ) { //round up the truncated number if appropriate
      return (displayString.slice(0, 7)) + (eighthCharacter + 1);
    } else {
      return displayString.slice(0, 8);
    }
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
      if (calc.history.lastInputAccepted === '=') {//start new calculation
        blinkDisplay();
        calc.equation.firstNumber = calc.history.lastCalculation;
        calc.equation.secondNumber = undefined;
        calc.equation.operator = buttonDataValue;
      } else {
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
  }
  
  calc.history.lastInputAccepted = buttonDataValue;
};

const clearEquation = function() {
  calc.equation.operator = undefined;
  calc.equation.firstNumber = undefined;
  calc.equation.secondNumber = undefined;
};

const clearHistory = function() {
  calc.history.lastCalculation = undefined;
  calc.history.lastInputAccepted = undefined;
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

const processEvaluationButton = function(buttonDataValue) {
  if (calc.history.lastInputAccepted !== '=') {
    if (typeof calc.equation.firstNumber !== 'undefined') {
      if (typeof calc.equation.secondNumber === 'undefined') {
        calc.equation.secondNumber = calc.display.floatValue;
        calc.history.lastCalculation = operate(calc.equation.operator,
        calc.equation.firstNumber, calc.equation.secondNumber);
        displayElement.innerText =
         convertToDisplayString(calc.history.lastCalculation);
        calc.display.floatValue = calc.history.lastCalculation;
      } else {
        calc.equation.firstNumber = calc.history.lastCalculation;
        calc.equation.secondNumber = calc.display.floatValue;
        calc.history.lastCalculation = operate(calc.equation.operator,
        calc.equation.firstNumber, calc.equation.secondNumber);
        displayElement.innerText =
         convertToDisplayString(calc.history.lastCalculation);
        calc.display.floatValue = calc.history.lastCalculation;
      }
    }
  }
  
  blinkDisplay();
  calc.history.lastInputAccepted = buttonDataValue;
};

const clearButton = document.querySelector('.clear-button');
const digitButtons = document.querySelectorAll('.digit-button');
const operatorButtons = document.querySelectorAll('.operator-button');
const evaluationButton = document.querySelector('.evaluation-button');

clearButton.addEventListener('click', clearDisplay);
clearButton.addEventListener('click', clearEquation);
clearButton.addEventListener('click', clearHistory);

digitButtons.forEach(button => button.addEventListener('click', () =>
 processDigitButton(button.dataset.number)));

operatorButtons.forEach(button => button.addEventListener('click', () =>
 processOperatorButton(button.dataset.operator)));

 evaluationButton.addEventListener('click', () =>
 processEvaluationButton(evaluationButton.dataset.operator));
