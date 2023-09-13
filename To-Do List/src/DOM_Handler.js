import _ from "lodash";
export const DOM_Handler = (() => {
  const createTask = (title, date, priority, repetition, relation) => {
    let task = document.createElement("li");
    task.classList.add("task");
    task.innerHTML = `<div class="drop-down-top"><div class="checkbox-before"><input type="checkbox" name="task1" id="task1" /><h4 class="task-title checkbox-text">${title}</h4></div><i class="fa-solid fa-caret-down fa-lg"></i></div><div class="task-details drop-down-content"><ul class="sub-tasks-list"></ul><div class="properties"><div class="date">${date}</div><div class="priority">${priority}</div><div class="repetition">${repetition}</div><div class="relation">${relation}</div></div></div>`;
    task.firstChild.addEventListener("click", (event) => {
      const header = event.target.closest(".drop-down-top");
      if (header === undefined) return;
      DOM_Handler.toggleMenu(header.nextElementSibling);
    });
    document.getElementById("tasks").appendChild(task);
  };

  const updateNewTaskProject = (projectsArray) => {
    const projectsList = document.getElementById("task-relation-menu");
    while (projectsList.children.length > 1) {
      projectsList.removeChild(projectsList.lastChild);
    }
    projectsArray.forEach((project) => {
      const projectName = project.querySelector("span").innerHTML;
      addNewTaskProject(projectName);
    });
  };

  const addNewTaskProject = (projectName) => {
    const projectsList = document.getElementById("task-relation-menu");
    const li = document.createElement("li");
    const radioInput = document.createElement("input");
    const label = document.createElement("label");
    // Setup input
    radioInput.setAttribute("type", "radio");
    radioInput.setAttribute("id", `${projectName}`);
    radioInput.setAttribute("name", "create-relation");
    radioInput.setAttribute("value", `${projectName}`);
    // Setup label
    label.setAttribute("for", `${projectName}`);
    label.textContent = projectName;
    li.appendChild(radioInput);
    li.appendChild(label);
    projectsList.appendChild(li);
  };

  const addProject = (projectName) => {
    const projectsList = document.querySelector("#projects");
    const project = document.createElement("li");
    const icon = document.createElement("i");
    const name = document.createElement("span");
    // Setup link
    project.classList.add("icon-before");
    // Setup icon
    icon.classList.add("fa-solid");
    icon.classList.add("fa-square-minus");
    icon.classList.add("delete");
    // Setup name
    name.textContent = projectName;

    project.appendChild(icon);
    project.appendChild(name);
    projectsList.insertBefore(
      project,
      projectsList.children[projectsList.children.length - 1]
    );
    return project;
  };

  const toggleMenu = (menu) => {
    const menuHeaders = document.querySelectorAll(".menu-header");
    for (const menuHeader of menuHeaders) {
      const menuContent = menuHeader.nextElementSibling;
      if (menuContent != menu) menuContent.classList.remove("open");
    }
    menu.classList.toggle("open");
  };

  return {
    createTask,
    addProject,
    updateNewTaskProject,
    addNewTaskProject,
    toggleMenu,
  };
})();
