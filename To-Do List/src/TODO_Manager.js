import _ from 'lodash';
import { DOM_Handler } from "./DOM_Handler";
import { Task } from "./Task";

let numberOfTasks = 0;

export const TODO = (() => {
  let tasksArray = [];

  const addTask = () => {
    numberOfTasks++;
    console.log('adding task...');
    const priority = document.querySelector('input[name="create-priority"]:checked').value;
    const repetition = document.querySelector('input[name="create-repetition"]:checked').value;
    const relation = document.querySelector('input[name="create-relation"]:checked').value;
    const title = document.getElementById('new-task-title').value;
    const date = new Date(document.getElementById('new-task-due').value);
    
    console.log(
    `Task: "${title}", Due: ${date}\n
    Related to ${relation} project.\n
    Repeated ${repetition}\n
    Its priority is ${priority}`
    );
    const task = new Task (title, date, priority, repetition, relation, numberOfTasks);
    task.taskEl.querySelector('.delete-task').addEventListener('click', () => {
      TODO.deleteTask(task);
    });
    tasksArray.push(task);
    filterTasks();
    console.log(tasksArray);
    document.getElementById('tasks').appendChild(tasksArray[tasksArray.length - 1].taskEl);
    //DOM_Handler.createTask(title, date, priority, repetition, relation);
  }

  const addProject = () => {
    const addProjectInput = document.querySelector('#add-project input');
    const projectName = addProjectInput.value[0].toUpperCase() + addProjectInput.value.slice(1);
    addProjectInput.value = "";
    if (projectName === "") return;
    console.log(`Adding ${projectName} Project`);

    // Check if it already exists.

    // Else add it to list
    DOM_Handler.addProject(projectName);
  }

  const deleteTask = (task) => {
    const index = tasksArray.indexOf(task);
    tasksArray = tasksArray.slice(0, index).concat(tasksArray.slice(index + 1));
  }

  const filterTasks = () => {
    tasksArray = tasksArray.filter((task) => !(task.deleted));
  }

  return {
    addProject,
    addTask,
    deleteTask,
  }
})();