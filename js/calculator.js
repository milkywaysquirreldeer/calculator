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

const operate = function(operator, firstNumber, secondNumber) {
  switch(operator) {
    case '+':
      console.log(add(firstNumber, secondNumber));
      break;
    case '-':
      console.log(subtract(firstNumber, secondNumber));
      break;
    case '*':
      console.log(multiply(firstNumber, secondNumber));
      break;
    case '/':
      console.log(divide(firstNumber, secondNumber));
  }
};

