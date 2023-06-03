const calc = {
  display: {
    floatValue: 0,
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
  clearEquation: function() {
    this.equation.operator = undefined;
    this.equation.firstNumber = undefined;
    this.equation.secondNumber = undefined;
    this.history.lastCalculation = undefined;
  },
  resetAllValues: function() {
    this.display.floatValue = 0;
    this.equation.operator = undefined;
    this.equation.firstNumber = undefined;
    this.equation.secondNumber = undefined;
    this.history.lastCalculation = undefined;
    this.history.lastInputAccepted = undefined;
  },
};

const displayElement = document.querySelector('.display');

/* Provides visual feedback upon button presses when no characters will be
    changed in the display */
const blinkDisplay = function() {
  displayElement.classList.add('blink-display');
  setTimeout(
    function() {
      displayElement.classList.remove('blink-display');
    }
    , 100);
};

const writeToDisplay = function(buttonValue) {
  if (buttonValue === '.') { /* add conventional preceding zero to leading
                                decimal points entered by user */
    displayElement.innerText = '0.';
  } else { //write character to display normally
  displayElement.innerText = buttonValue;
  }
};

const appendToDisplay = function(buttonValue) {
  if (
      (displayElement.innerText.includes('.')
        && buttonValue === '.')
      || displayElement.innerText === '0'
     ) { //drop any repeating decimal points and leading zeros
    blinkDisplay();
  } else { //add character to display normally
    displayElement.innerText += buttonValue;
  }
};

const parseDisplayToFloat = function(displayString) {
  calc.display.floatValue = Number.parseFloat(displayString);
};

const processDigitButton = function(buttonValue) {
  const characterLimit = 8;
  const operationInputs = ['+', '-', '*', '/', '='];
  const numericInputs = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
  let lastInputWasOperation = false;
  let lastInputWasEqualsButton = false;
  let lastInputWasNumeric = false;

  for (const operationInput of operationInputs) {
    if (calc.history.lastInputAccepted === operationInput) {
     lastInputWasOperation = true;
    }
  }

  if (calc.history.lastInputAccepted === '=') {
    lastInputWasEqualsButton = true;
  }

  for (const numericInput of numericInputs) {
    if (calc.history.lastInputAccepted === numericInput) {
     lastInputWasNumeric = true;
    }
  }

  if (displayElement.innerText.length < characterLimit) {
    if (lastInputWasOperation) {
      writeToDisplay(buttonValue);
      if (lastInputWasEqualsButton) { /* by manually overwriting a displayed
                                         calculation with other numeric values,
                                         a user is opting to discard any
                                         ongoing chain of calculations. */
        calc.clearEquation();
      }
    } else { //last value input was number or '.'
      if (displayElement.innerText === '0') {
        if (buttonValue === '0') {
          blinkDisplay();
        } else {
            writeToDisplay(buttonValue);
        }
      } else {
        appendToDisplay(buttonValue);
      }
    }
  } else { //display full
    if (lastInputWasNumeric) { //drop current input to prevent display overflow
     blinkDisplay();
    } else {
       writeToDisplay(buttonValue);
       if (lastInputWasEqualsButton) { /* user is opting to overwrite a
                                          calculated result with new input;
                                          discard any ongoing calculations */
        calc.clearEquation();
       }
    }
  }

  calc.history.lastInputAccepted = buttonValue;
  parseDisplayToFloat(displayElement.innerText);
};

const operate = function(operator, firstNumber, secondNumber) {
  const add =
    function (x, y) {
      return x + y;
    };

  const subtract =
    function (x, y) {
      return x - y;
    };

  const multiply =
    function (x, y) {
      return x * y;
    };

  const divide =
    function (x, y) {
      return x / y;
    };
  
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
    if (displayString.includes('.')) {
      return (displayString.includes('0.') ?
        number.toPrecision(6).toString() : /* leaves room for leading zero on
                                              the display */
        number.toPrecision(7).toString());
    } else { //number will display in exponential format, so leave room
      return number.toPrecision(3).toString();
    }
  }
};

const calcButtons = document.querySelector('.calc-buttons');

const showDivideByZeroError = function() {
  // Show text error on display
  displayElement.textContent = 'nope';
  setTimeout(
    function() {
      displayElement.innerText = '';
    }
    , 1000);

  const divisionButton = calcButtons.querySelector('[data-operator="/"]');

  // Provide visual error via temporary restyling of buttons
  divisionButton.classList.add('divide-by-zero-error');
  setTimeout(
    function() {
      divisionButton.classList.remove('divide-by-zero-error');
    }
    , 1000);

  const zeroButton = calcButtons.querySelector('[data-number="0"]');

  zeroButton.classList.add('divide-by-zero-error');
  setTimeout(
    function() {
      zeroButton.classList.remove('divide-by-zero-error');
    }
    , 1000);
};

const undoDivideByZero = function(numerator) {
  /* Discard the invalid operation and restore the number that the user tried to
     divide by zero, so that the user can try a different operation with it */
  calc.resetAllValues();
  setTimeout(
    function() {
      processDigitButton(convertToDisplayString(numerator));
    }
    , 1001);
};

const processOperatorButton = function(buttonDataValue) {
  if (typeof calc.equation.firstNumber === 'undefined') {
    blinkDisplay();
    calc.equation.firstNumber = calc.display.floatValue;
    calc.equation.operator = buttonDataValue;
  } else { //firstNumber was defined already
    if (typeof calc.equation.secondNumber === 'undefined') {
      if (calc.equation.operator === '/'
          && calc.display.floatValue === 0) {
        showDivideByZeroError();
        undoDivideByZero(calc.equation.firstNumber);
        return;
      } else {
        calc.equation.secondNumber = calc.display.floatValue;
        calc.history.lastCalculation = operate(calc.equation.operator,
         calc.equation.firstNumber, calc.equation.secondNumber);
        displayElement.innerText =
         convertToDisplayString(calc.history.lastCalculation);
        calc.display.floatValue = calc.history.lastCalculation;
        calc.equation.operator = buttonDataValue;
      }
    } else { //secondNumber was defined already
      if (calc.history.lastInputAccepted === '=') { //start new calculation
        blinkDisplay();
        calc.equation.firstNumber = calc.history.lastCalculation;
        calc.equation.secondNumber = undefined;
        calc.equation.operator = buttonDataValue;
      } else {
        if (calc.equation.operator === '/'
            && calc.display.floatValue === 0) {
          showDivideByZeroError();
          undoDivideByZero(calc.history.lastCalculation);
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
  }
  
  calc.history.lastInputAccepted = buttonDataValue;
};

const processEvaluationButton = function(buttonDataValue) {
  if (calc.history.lastInputAccepted !== '=') {
    if (typeof calc.equation.firstNumber !== 'undefined') {
      if (calc.display.floatValue === 0 && calc.equation.operator === '/') {
      //user is dividing by zero
        showDivideByZeroError();
        if (typeof calc.history.lastCalculation !== 'undefined') {
          undoDivideByZero(calc.history.lastCalculation);
        } else {
          undoDivideByZero(calc.equation.firstNumber);
        }
        return;
      } else {
        if (typeof calc.equation.secondNumber !== 'undefined') {
          calc.equation.firstNumber = calc.history.lastCalculation;
        }
        
        calc.equation.secondNumber = calc.display.floatValue;
        calc.history.lastCalculation = operate(calc.equation.operator,
         calc.equation.firstNumber, calc.equation.secondNumber);
        displayElement.innerText =
         convertToDisplayString(calc.history.lastCalculation);
        calc.display.floatValue = calc.history.lastCalculation;
      }
    } //else no calculation arguments provided yet, so skip the above
  } //else no calculation arguments provided yet, so skip the above

  blinkDisplay();
  calc.history.lastInputAccepted = buttonDataValue;
};

const clearDisplay = function() {
  const defaultZero = '0';

  if (displayElement.innerText === defaultZero) { //display is already cleared
    blinkDisplay();
  } else {
    displayElement.innerText = defaultZero;
    parseDisplayToFloat(displayElement.innerText);
  }
};

const clearButton = document.querySelector('.clear-button');
const digitButtons = document.querySelectorAll('.digit-button');
const operatorButtons = document.querySelectorAll('.operator-button');
const evaluationButton = document.querySelector('.evaluation-button');

clearButton.addEventListener('click',
  function() {
    calc.resetAllValues();
  }
);

clearButton.addEventListener('click',
  function() {
    clearDisplay();
  }
);

digitButtons.forEach(
  function(button) {
    button.addEventListener('click',
      function() {
        processDigitButton(button.dataset.number);
      }
    )
  }
);

operatorButtons.forEach(
  function(button) {
    button.addEventListener('click',
      function() {
        processOperatorButton(button.dataset.operator);
      }
    )
  }
);

evaluationButton.addEventListener('click',
  function() {
    processEvaluationButton(evaluationButton.dataset.operator);
  }
);

const parseKeyboardInput = function (evt) {
  const numpad = 'Numpad';
  const digit = 'Digit';
  /* Visually indicates button presses when user is using keyboard instead of
     mouse for input */
  const indicateKeyboardPress = function(character, buttonType) {
    const digitPressed = 'digit-pressed-using-keyboard';
    const operatorPressed = 'operator-pressed-using-keyboard';
    const clearPressed = 'clear-pressed-using-keyboard';

    if (buttonType === 'numeric') {
      if (character === '.') {
        const decimalButtonElement = calcButtons.querySelector(
         `[data-number="."]`);

        decimalButtonElement.classList.add(`${digitPressed}`);
        setTimeout(
          function() {
            decimalButtonElement.classList.remove(`${digitPressed}`);
          }
          , 100);
      } else {
        const digitButtonElement = calcButtons.querySelector(
         `[data-number="${character}"]`);

        digitButtonElement.classList.add(`${digitPressed}`);
        setTimeout(
          function() {
            digitButtonElement.classList.remove(`${digitPressed}`);
          }
          , 100);
      }
    } else if (buttonType === 'operator') {
      const operatorButtonElement = calcButtons.querySelector(
       `[data-operator="${character}"]`);

      operatorButtonElement.classList.add(`${operatorPressed}`);
      setTimeout(
        function() {
          operatorButtonElement.classList.remove(`${operatorPressed}`);
        }
        , 100);
    } else if (buttonType === 'clear') {
      const clearButtonElement = calcButtons.querySelector(
       '.clear-button');

      clearButtonElement.classList.add(`${clearPressed}`);
      setTimeout(
        function() {
          clearButtonElement.classList.remove(`${clearPressed}`);
        }
        , 100);
    }
  };

  for (let i = 0; i < 10; i++) {
    if (! evt.shiftKey) {
      if (evt.code === `${numpad}${i}`
          || evt.code === `${digit}${i}`) {
        indicateKeyboardPress(i, 'numeric');
        processDigitButton(`${i}`);
        return;
      }
    } else {
      if (evt.code === 'Digit8') { //the user entered '*' using Shift + 8
        indicateKeyboardPress('*', 'operator');
        processOperatorButton('*');
        return;
      } else if (evt.code === 'Equal') { /* the user entered '+' using
                                            Shift + '=' */
        indicateKeyboardPress('+', 'operator');
        processOperatorButton('+');
        return;
      }
    }
  }

  switch(evt.code) {
    case `${numpad}Decimal`:
    case  'Period':
      indicateKeyboardPress('.', 'numeric');
      processDigitButton('.');
      break;
    case `${numpad}Add`:
      indicateKeyboardPress('+', 'operator');
      processOperatorButton('+');
      break;
    case `${numpad}Subtract`:
    case 'Minus':
      indicateKeyboardPress('-', 'operator');
      processOperatorButton('-');
      break;
    case `${numpad}Multiply`:
      indicateKeyboardPress('*', 'operator');
      processOperatorButton('*');
      break;
    case `${numpad}Divide`:
    case 'Slash':
      evt.preventDefault(); //default behavior for '/' in FF is "find in page"
      indicateKeyboardPress('/', 'operator');
      processOperatorButton('/');
      break;
    case `${numpad}Enter`:
    case 'Enter':
      indicateKeyboardPress('=', 'operator');
      processEvaluationButton('=');
      break;
    case 'Equal':
      indicateKeyboardPress('=', 'operator');
      processOperatorButton('=');
      break;
    case `Escape`:
      indicateKeyboardPress(null, 'clear');
      calc.resetAllValues();
      clearDisplay();
  }
};

window.addEventListener('keydown',
  function (evt) {
    parseKeyboardInput(evt);
  }
);
