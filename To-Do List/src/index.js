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

// Add Task Events
document.querySelector('#add-task > i').addEventListener('click', TODO.addTask);
document.getElementById('new-task-title').addEventListener('keyup', (event) => {
  if (event.key === 'Enter')  TODO.addTask();
});

// Add SideBar Traverse
const links = document.querySelectorAll('.nav-links li:not(.add)');
links.forEach(link => {
  link.addEventListener('click', () => {
    const links = document.querySelectorAll('.nav-links li');
    links.forEach(link => {
      link.classList.remove('active');
    })
    link.classList.add('active');
    TODO.updateTODOlist();
  })
});
TODO.updateTODOlist();

// Refresh icon functionality
document.getElementById('refresh').addEventListener('click', TODO.refreshTODOList)

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

document.getElementById('menu-arrow').addEventListener('click', toggleSideBar);
function toggleSideBar() {
  const sideBar = document.getElementById('sidebar');
  sideBar.classList.toggle('open');
}