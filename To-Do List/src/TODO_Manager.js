import _ from 'lodash';
import { DOM_Handler } from "./DOM_Handler";
import { Task } from "./Task";

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

let numberOfTasks = 0;

export const TODO = (() => {
  let tasksArray = [];
  let tasksInfoArray = [];
  let projectsArray = [];
  let projectsNameArray = [];
  const isStorageAvailable = storageAvailable("localStorage");

  const sortTasks = () => {
    tasksArray.sort((a, b) => { 
      if (a.getDays() === b.getDays())
        return b.getPriority() - a.getPriority();
      return a.getDays() - b.getDays();
    })
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

    addTaskObject(title, date, priority, repetition, relation, numberOfTasks);
    updateTasksList();
  }

  const addTaskObject = (title, date, priority, repetition, relation, numberOfTasks, currentDate) => {
    const task = new Task (title, date, priority, repetition, relation, numberOfTasks, currentDate);
    task.taskEl.querySelector('.edit-task').addEventListener('click', () => {
      updateTaskInfo(task);
    })
    task.taskEl.querySelector('.delete-task').addEventListener('click', () => {
      TODO.deleteTask(task);
    });
    tasksArray.push(task);
    tasksInfoArray.push(task.getInfo());
    sortTasks();
    if (isStorageAvailable) {
      localStorage.setItem("tasks", JSON.stringify(tasksInfoArray));
      console.log(JSON.parse(localStorage.getItem("tasks")));
    }
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
    addProjectObject(projectName);
  }

  const addProjectObject = (projectName) => {
    const project = DOM_Handler.addProject(projectName);
    project.querySelector('i.delete').addEventListener('click', (event) => {
      deleteProject(event.target.closest('li'));
    })
    projectsArray.push(project);
    projectsNameArray.push(projectName);
    if (isStorageAvailable) {
      localStorage.setItem("projects", JSON.stringify(projectsNameArray));
      console.log(JSON.parse(localStorage.getItem("projects")));
    }
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
    const id = task.id;
    for (let i = 0; i < tasksInfoArray.length; i++) {
      if (tasksInfoArray[i].id == id) {
        console.log('removing from taskInfoArray')
        tasksInfoArray = tasksInfoArray.slice(0, i).concat(tasksInfoArray.slice(i + 1));
        break;
      }
    }
    tasksArray = tasksArray.slice(0, index).concat(tasksArray.slice(index + 1));
    if (isStorageAvailable) {
      localStorage.setItem("tasks", JSON.stringify(tasksInfoArray));
      console.log(JSON.parse(localStorage.getItem("tasks")));
    }
  }

  const deleteProject = (project) => {
    const index = projectsArray.indexOf(project);
    const projectName = project.querySelector("span").innerHTML;
    const nameIndex = projectsNameArray.indexOf(projectName);
    projectsArray = projectsArray.slice(0, index).concat(projectsArray.slice(index + 1));
    projectsNameArray = projectsNameArray.slice(0, nameIndex).concat(projectsNameArray.slice(nameIndex + 1));
    project.parentNode.removeChild(project);
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
    if (isStorageAvailable) {
      localStorage.setItem("projects", JSON.stringify(projectsNameArray));
      console.log(JSON.parse(localStorage.getItem("projects")));
    }
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

  const updateTaskInfo = (task) => {
    const id = task.id;
    for (let i = 0; i < tasksInfoArray.length; i++) {
      if (tasksInfoArray[i].id == id) {
        console.log('updating info');
        tasksInfoArray[i] = task.getInfo();
        break;
      }
    }
    if (isStorageAvailable) {
      localStorage.setItem("tasks", JSON.stringify(tasksInfoArray));
      console.log(JSON.parse(localStorage.getItem("tasks")));
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
      if (!(daysLeft <= 0 ^ show))
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

  const loadTODOList = () => {
    console.log('Loading TODO list.');
    // Load Tasks
    console.log(JSON.parse(localStorage.getItem("tasks")));
    const tempTasks = JSON.parse(localStorage.getItem("tasks"));
    if (tempTasks != null)
      tempTasks.forEach(taskInfo => {
        console.log(`Loading ${taskInfo.id}`);
        const dueDate = taskInfo.hasDueDate ? new Date(taskInfo.dueDate) : undefined;
        addTaskObject(taskInfo.title,
                      dueDate,
                      taskInfo.priority,
                      taskInfo.repetition,
                      taskInfo.relation,
                      taskInfo.id,
                      new Date(taskInfo.createdDate));
        numberOfTasks = Math.max(taskInfo.id, numberOfTasks) + 1;
    })
    updateTasksList();
      
    // Load Projects
    console.log(localStorage.getItem("projects"));
    console.log(JSON.parse(localStorage.getItem("projects")));
    const tempProjects = JSON.parse(localStorage.getItem("projects"))
    if (tempProjects != null)
      tempProjects.forEach(projectName => {
        console.log(`Loading ${projectName}`);
        addProjectObject(projectName);
      })
  }
  if (isStorageAvailable) loadTODOList();

  return {
    addProject,
    addTask,
    deleteTask,
    updateTODOlist,
    refreshTODOList,
  }
})();