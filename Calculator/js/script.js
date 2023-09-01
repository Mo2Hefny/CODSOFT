'use strict';
import calculator from './calculator.js';

function Expression(equation, result) {
  this.equation = equation
  this.result = result
  this.justSolved = false
  this.isLoaded = false

  this.clear = () => {
    if (!this.isLoaded) {
      this.equation = '';
      this.result = '';
    }
    this.justSolved = false;
    this.isLoaded = false;
  }
  this.load = (equation, result) => {
    this.equation = equation;
    this.result = result;
    this.justSolved = true;
    this.isLoaded = true;
  }
}

const screen = (() => {
  const equation = document.getElementById('equation');
  const history = document.getElementById('history');
  const error = document.getElementById('error');
  let expression = new Expression('', '');
  const appendEquation = (letter) => {
    if (expression.justSolved)
      expression.clear();
    if (expression.equation.length > 18)
    {
      error.textContent = 'max size';
      return;
    }
    expression.equation += letter;
    updateScreen();
  }

  const popEquation = () => {
    if (expression.justSolved)
      expression.clear();
    let string = expression.equation;
    do {
      string = string.slice(0, -1);
    } while (string[string.length - 1] === '.');
    expression.equation = string;
    updateScreen();
  }

  const solveEquation = () => {
    if (expression.justSolved)
      return flipEquation();
    const result = calculator.solve(expression.equation);
    if (result === undefined) {
      if (error.textContent === '')
        error.textContent = 'Invalid Input.';
      return;
    }
    expression.result = result;
    addToHistory(expression.equation, result);
    expression.justSolved = true;
  }

  const updateScreen = () => {
    equation.textContent = expression.equation;
    error.textContent = '';
  }

  const flipEquation = () => {
    const temp = expression.equation;
    expression.equation = expression.result;
    expression.result = temp;
    updateScreen();
  }

  const addToHistory = (expression, result) => {
    const subEl = document.createElement('div');
    subEl.classList.add('sub');
    const equationEl = document.createElement('div');
    equationEl.classList.add('equation');
    equationEl.textContent = expression;
    const separatorEl = document.createElement('div');
    separatorEl.classList.add('separator');
    separatorEl.textContent = '=';
    const resultEl = document.createElement('div');
    resultEl.classList.add('result');
    resultEl.textContent = result;
    subEl.appendChild(equationEl);
    subEl.appendChild(separatorEl);
    subEl.appendChild(resultEl);
    history.appendChild(subEl);
    subEl.scrollIntoView();
  }

  const loadFromHistory = (event) => {
    const sub = event.target.closest('.sub');
    if (sub === null) return;
    const equation = sub.firstChild.textContent;
    const result = sub.lastChild.textContent;
    console.log(`${equation} = ${result}`);
    expression.load(equation, result);
    updateScreen();
  }
  history.addEventListener('click', loadFromHistory);

  return {
    appendEquation,
    popEquation,
    solveEquation,
  }
})();
  

document.addEventListener('keypress', handleKeyInput);
const buttons = document.getElementById('buttons');
buttons.addEventListener('click', handleButtonInput);

function handleButtonInput(event) {
  const button = event.target.closest('button');
  if (button === null) return;
  switch (button.getAttribute('id'))
  {
    case 'backspace':
      screen.popEquation();
      break;
    case 'equal':
      screen.solveEquation();
      break;
    default:
      screen.appendEquation(button.textContent);
  }
  
}

function handleKeyInput(event) {
  const key = event.key;
  const validKeys = ['.', '(', ')', '-', '+', '*', '/'];
  if (validKeys.includes(key) || (key >= '0' && key <= '9'))
    screen.appendEquation(key);
  else if (key === 'Backspace' || key === 'Delete')
    screen.popEquation();
}