import _ from 'lodash';
import { DOM_Handler } from "./DOM_Handler";

export const TODO = (() => {
  const addTask = () => {
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

  return {
    addProject,
    addTask,
  }
})();