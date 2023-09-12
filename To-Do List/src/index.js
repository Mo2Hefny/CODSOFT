import _ from 'lodash';
import { DOM_Handler } from './DOM_Handler';
import { TODO } from './TODO_Manager';

const addProjectButton = document.querySelector('#add-project i');
addProjectButton.addEventListener('click', TODO.addProject);
document.querySelector('#add-project input').addEventListener('keyup', (event) => {
  if (event.key === 'Enter')  TODO.addProject();
});

// Add Menu EventListeners
const menuHeaders = document.querySelectorAll('.menu-header');
console.log(menuHeaders);
for (const menuHeader of menuHeaders)
  menuHeader.addEventListener('click', (event) => {
    const header = event.target.closest('.menu-header');
    if (header === undefined) return;
    DOM_Handler.toggleMenu(header.nextElementSibling);
  });

const dropDowns = document.querySelectorAll('.dropdown');
dropDowns.forEach(dropDown => {
  // Get inner elements
  const select = dropDown.querySelector('.select');
  const selected = dropDown.querySelector('.selected');
  const caret = dropDown.querySelector('.caret');
  const menu = dropDown.querySelector('.menu');
  const options = dropDown.querySelectorAll('.menu li');

  select.addEventListener('click', () => {
    select.classList.toggle('select-clicked');
    caret.classList.toggle('caret-rotate');
    menu.classList.toggle('menu-open');
  });

  options.forEach(option => {
    selected.textContent = option.textContent;
    select.classList.remove('select-clicked');
    caret.classList.remove('caret-rotate');
    menu.classList.remove('menu-open');
    options.forEach(option => {
      option.classList.remove('active');
    });
    option.classList.add('active');
  })
})

// Add Task Events
document.querySelector('#add-task > i').addEventListener('click', TODO.addTask);
document.getElementById('new-task-title').addEventListener('keyup', (event) => {
  if (event.key === 'Enter')  TODO.addTask();
});

function updateDay() {
  const date = new Date();
  const day = date.getDate(); // getDay() returns day of the week number.
  console.log(date);
  console.log(`today is ${day}`);
  const todayIcons = document.querySelectorAll('.today-day');
  for (const icon of todayIcons)
    icon.textContent = day;
}

updateDay();