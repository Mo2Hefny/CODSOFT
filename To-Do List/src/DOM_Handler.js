import _ from 'lodash';
export const DOM_Handler = (() => {
  
  const addNewTaskProject = (projectName) => {
    const projectsList = document.getElementById('task-relation-menu');
    const li = document.createElement("li");
    const radioInput = document.createElement("input");
    const label = document.createElement("label");
    // Setup input
    radioInput.setAttribute('type', 'radio');
    radioInput.setAttribute('id', `${projectName}`);
    radioInput.setAttribute('name', 'create-relation');
    radioInput.setAttribute('value', `${projectName}`);
    // Setup label
    label.setAttribute('for', `${projectName}`);
    label.textContent = projectName;
    li.appendChild(radioInput);
    li.appendChild(label);
    projectsList.appendChild(li);
  }

  const addProject = (projectName) => {
    const projectsList = document.querySelector('#projects');
    const project = document.createElement('li');
    const icon = document.createElement('i');
    const name = document.createElement('span');
    // Setup link
      project.classList.add('icon-before');
    // Setup icon
    icon.classList.add('fa-solid');
    icon.classList.add('fa-square-minus');
    // Setup name
    name.textContent = projectName;
    
    project.appendChild(icon);
    project.appendChild(name);
    projectsList.insertBefore(project, projectsList.children[projectsList.children.length - 1]);
    addNewTaskProject(projectName);
  }

  const toggleMenu = (menu) => {
    console.log(menu.nodeName);
    console.log(menu.classList);
    const menuHeaders = document.querySelectorAll('.menu-header');
    for (const menuHeader of menuHeaders)
    {
      const menuContent = menuHeader.nextElementSibling;
      if (menuContent != menu)
        menuContent.classList.remove('open');
    }
    menu.classList.toggle('open');
  }

  return {
    addProject,
    toggleMenu,
  }
})();