import _ from 'lodash';
import { DOM_Handler } from "./DOM_Handler";
import { Task } from "./Task";

let numberOfTasks = 0;

export const TODO = (() => {
  let tasksArray = [];
  let projectsArray = [];

  const sortTasks = () => {
    tasksArray.sort((a, b) => { return a.getDays() - b.getDays();})
  }

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
    sortTasks();
    console.log(tasksArray);
    updateTasksList();
    //DOM_Handler.createTask(title, date, priority, repetition, relation);
  }

  const addProject = () => {
    const addProjectInput = document.querySelector('#add-project input');
    const projectName = addProjectInput.value[0].toUpperCase() + addProjectInput.value.slice(1);
    addProjectInput.value = "";
    if (projectName === "") return;
    console.log(`Adding ${projectName} Project`);

    // Check if it already exists.
    const links = document.querySelectorAll('#projects li:not(.add)');
    links.forEach(link => {
      if (link.querySelector('span').innerHTML === projectName)
      {
        console.log('Project is already created.');
        const links = document.querySelectorAll('.nav-links li');
        links.forEach(link => {
          link.classList.remove('active');
        })
        link.classList.add('active');
        // Open this project
        updateTODOlist();
        return;
      }
    })
    
    // Else add it to list
    const project = DOM_Handler.addProject(projectName);
    project.querySelector('i.delete').addEventListener('click', (event) => {
      deleteProject(event.target.closest('li'));
    })
    projectsArray.push(project);
    DOM_Handler.addNewTaskProject(projectName);
    project.addEventListener('click', (event) => {
      if (event.target.classList.contains('delete'))  return;
      const links = document.querySelectorAll('.nav-links li');
      links.forEach(link => {
        link.classList.remove('active');
      })
      event.target.closest('li').classList.add('active');
      updateTODOlist();
    })
  }

  const deleteTask = (task) => {
    const index = tasksArray.indexOf(task);
    tasksArray = tasksArray.slice(0, index).concat(tasksArray.slice(index + 1));
  }

  const deleteProject = (project) => {
    const index = projectsArray.indexOf(project);
    projectsArray = projectsArray.slice(0, index).concat(projectsArray.slice(index + 1));
    project.parentNode.removeChild(project);
    const projectName = project.querySelector("span").innerHTML;
    tasksArray.forEach(task => {
      if (task.getRelatedProject() === projectName) {
        task.deleteTask();
        deleteTask(task);
      }
    })
    if (project.classList.contains('active')) {
      document.getElementById('inbox').classList.add('active');
      updateTODOlist();
    }
    console.log(`projects: ${projectsArray}`);
    DOM_Handler.updateNewTaskProject(projectsArray);
  }

  const updateTODOlist = () => {
    const link = document.querySelector('.nav-links li.active');
    updateHeader(link.innerHTML);
    console.log(`Showing ${link.querySelector('span').innerHTML} tasks`);
    console.log(tasksArray)
    updateTasksList();
  }

  const updateTasksList = () => {
    const link = document.querySelector('.nav-links li.active');
    const tasksList = document.querySelector('.tasks-list');
    while (tasksList.children.length > 1) {
      tasksList.removeChild(tasksList.lastChild);
    }
    
    const title = link.querySelector('span').innerHTML;
    switch (title) {
      case 'Today': handleTodayTasks(true); break;
      case 'Inbox': handleTodayTasks(true);
      case 'Upcoming': handleTodayTasks(false); break;
      default: handleProjectsTasks(title); break;
    }
  }

  const refreshTODOList = () => {
    console.log('refreshing list')
    tasksArray.forEach(task => {
      if (!task.handleChecked())
        deleteTask(task);
    });
    sortTasks();
    updateTasksList();
  }

  const handleProjectsTasks = (project) => {
    const tasksList = document.querySelector('.tasks-list');
    tasksArray.forEach(task => {
      if (task.getRelatedProject() === project)
        tasksList.appendChild(task.taskEl);
    })
  }

  const handleTodayTasks = (show) => {
    const tasksList = document.querySelector('.tasks-list');
    tasksArray.forEach(task => {
      const daysLeft = task.getDays();
      if (!(daysLeft === 0 ^ show))
        tasksList.appendChild(task.taskEl);
    });
  }

  const updateHeader = (header) => {
    const listTitle =  document.querySelector('.list-title');
    listTitle.innerHTML = header;
    const icon = listTitle.querySelector('i');
    if (icon === null) return;
    icon.classList.remove('fa-xl');
  }

  return {
    addProject,
    addTask,
    deleteTask,
    updateTODOlist,
    refreshTODOList,
  }
})();