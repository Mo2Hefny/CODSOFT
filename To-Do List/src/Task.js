import { compareAsc, format, formatDistance } from 'date-fns'

export class Task {
  #title;
  #dueDate;
  #createDate;
  #priority;
  #repetition;
  #relation;
  taskEl;
  #titleEl;
  #subTasksEl;
  #dateEl;
  #repetitionEl;
  #priorityEl;
  #subTaskArray;
  deleted;
  id;

  constructor(title, date, priority, repetition, relation, id) {
    this.#createDate = format(new Date(), 'dd-MM-yyyy')
    this.#setDate(date, repetition);
    this.#title = title;
    this.#priority = priority;
    this.#repetition = repetition;
    this.#relation = relation;
    this.#subTaskArray = [];
    console.log(this.#dueDate);
    this.#createTaskElement();
    this.#updateDatePickerValue();
    this.deleted = false;
    this.id = id;
  }

  #setDate(date, repetition) {
    console.log(`Due: ${date} & Repeated ${repetition}`);
    console.log(isNaN(date));
    if (isNaN(date) && repetition != 'Once')
      date = new Date();
    this.#dueDate =  (isNaN(date)) ? 'None' : format(date, 'dd-MM-yyyy');
  }
  
  getDays() {
    if (this.#dueDate === 'None') return -1;
    const dateArray = this.#dueDate.split('-');
    const dueDate = new Date(`${dateArray[1]}-${dateArray[0]}-${dateArray[2]}`);
    const today = new Date(format(new Date(), 'MM-dd-yyyy'));
    console.log(dueDate);
    console.log(today);
    const diff = (dueDate - today) / 1000;
    console.log(diff);
    return diff / (3600 * 24);
  }

  getRelatedProject() {
    return this.#relation;
  }

  #getDateString() {
    if (this.#dueDate === 'None') return 'None';
    const dateArray = this.#dueDate.split('-');
    const dueDate = new Date(`${dateArray[1]}-${dateArray[0]}-${dateArray[2]}`);
    const days = this.getDays();
    if (days > 7) return this.#dueDate;
    if (days < 2) return days ? 'Tomorrow' : 'Today';
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return `Next ${weekday[dueDate.getDay()]}`;
  }

  #createTaskElement() {
    this.taskEl = document.createElement('div');
    this.taskEl.setAttribute('id', `task${this.id}`);
    this.taskEl.classList.add('task');
    // Top section
    this.#titleEl = document.createElement('input');
    this.#titleEl.setAttribute('type', 'text');
    this.#titleEl.setAttribute('readonly', true);
    this.#titleEl.setAttribute('spellcheck', false);
    this.#titleEl.setAttribute('data-ms-editor', true);
    this.#titleEl.setAttribute('value', this.#title);
    this.#titleEl.classList.add('task-title');
    this.#titleEl.classList.add('checkbox-text');
    const top = document.createElement('div');
    top.classList.add('drop-down-top');
    top.innerHTML = `<div class="checkbox-before">
                      <input class="main-checkbox" type="checkbox" name="task1" id="task1" />
                      <span></span>
                    </div>
                    <p class="related-project">${this.#relation}</p>
                    <div class="caret"></div>`;
    top.firstElementChild.appendChild(this.#titleEl);
    // Bottom section
    const bottom = document.createElement('div');
    bottom.classList.add('task-details');
    bottom.classList.add('dropdown-menu');
    top.addEventListener('click', (event) => {
      if (event.target.hasAttribute('type', 'checkbox'))  return;
      bottom.classList.toggle('menu-open');
      top.querySelector('.caret').classList.toggle('caret-rotate');
    })
    this.#createSubTasksSection();
    bottom.appendChild(this.#subTasksEl);
    bottom.appendChild(this.#createPropertySection());

    // Edit And Delete Buttons
    const btnSection = document.createElement('div');
    btnSection.classList.add('btn-section');
    const editBtn = document.createElement('button');
    editBtn.classList.add('btn-color-1');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      editBtn.textContent = 'Save';
      if (editBtn.classList.contains('edit')) {
        editBtn.textContent = 'Edit';
        this.#closeMenus();
      }
      editBtn.classList.toggle('edit');
      this.#editTask();
      this.#updateTask();
    });
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn-color-2');
    deleteBtn.classList.add('delete-task');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      this.deleteTask();
    });
    btnSection.appendChild(editBtn);
    btnSection.appendChild(deleteBtn);
    bottom.appendChild(btnSection);
    this.taskEl.appendChild(top);
    this.taskEl.appendChild(bottom);
  }

  #createPropertySection() {
    const properties = document.createElement('div');
    properties.classList.add('properties');
    this.#dateEl = document.createElement('div');
    this.#dateEl.innerHTML = `
    <input type="date" name="due-date">
    <p>${this.#getDateString()}</p>`;
    this.#dateEl.classList.add('date');
    this.#dateEl.classList.add('property');
    this.#dateEl.classList.add('disabled');
    this.#dateEl.querySelector('input[type="date"]').addEventListener('change', () => {
      this.#updateDate();
    });
    this.#priorityEl = document.createElement('div');
    this.#priorityEl.innerHTML = `
      <div class="select disabled">
        <span class="selected">${this.#priority}</span>
        <div class="caret"></div>
      </div>
      <ul class="menu down">
        <li>Hard</li>
        <li>Medium</li>
        <li>Low</li>
      </ul>`;
    this.#priorityEl.classList.add('dropdown');
    this.#repetitionEl = document.createElement('div');
    this.#repetitionEl.innerHTML = `
    <div class="select disabled">
      <span class="selected">${this.#repetition}</span>
      <div class="caret"></div>
    </div>
    <ul class="menu down">
      <li>Once</li>
      <li>Daily</li>
      <li>Weekly</li>
      <li>Monthly</li>
      <li>Yearly</li>
    </ul>`;
    this.#repetitionEl.classList.add('dropdown');
    properties.appendChild(this.#dateEl);
    properties.appendChild(this.#priorityEl);
    properties.appendChild(this.#repetitionEl);
    for (const li of this.#priorityEl.children) {
      console.log(li.textContent);
      if (li.textContent === this.#priority)
        li.classList.add('active');
    }

    for (const li of this.#repetitionEl.children) {
      console.log(li.textContent);
      if (li.textContent === this.#repetition)
        li.classList.add('active');
    }

    const dropDowns = properties.querySelectorAll('.dropdown');
    dropDowns.forEach(dropDown => {
      const select = dropDown.querySelector('.select');
      const selected = dropDown.querySelector('.selected');
      const caret = dropDown.querySelector('.caret');
      const menu = dropDown.querySelector('.menu');
      const options = dropDown.querySelectorAll('.menu li');
      
      select.addEventListener('click', () => {
        if (select.classList.contains('disabled'))  return;
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
      });
    
      options.forEach(option => {
        option.addEventListener('click', () => {
          selected.textContent = option.textContent;
          select.classList.remove('select-clicked');
          caret.classList.remove('caret-rotate');
          menu.classList.remove('menu-open');
          options.forEach(option => {
            option.classList.remove('active');
          });
          option.classList.add('active');
        });
      })
    });

    return properties;
  }

  #closeMenus() {
    const dropDowns = this.taskEl.querySelectorAll('.dropdown');
    dropDowns.forEach(dropDown => {
      const select = dropDown.querySelector('.select');
      const caret = dropDown.querySelector('.caret');
      const menu = dropDown.querySelector('.menu');
      select.classList.remove('select-clicked');
      caret.classList.remove('caret-rotate');
      menu.classList.remove('menu-open');
    });
  }

  #createSubTasksSection() {
    this.#subTasksEl = document.createElement('ul');
    this.#subTasksEl.classList.add('sub-tasks-list')
    this.#subTasksEl.innerHTML = `
    <li class="add icon-before" id="add-project">
      <i class="fa-solid fa-plus fa-lg icon-useable"></i>
      <input class="add" type="text" placeholder="Add Sub Task" minlength="1"/>
    </li>`;
    this.#subTasksEl.querySelector('.add i').addEventListener('click', () => {
      this.addSubTask();
    });
    this.#subTasksEl.querySelector('input.add').addEventListener('keyup', (event) => {
      if (event.key === 'Enter')  this.addSubTask();
    });
  }

  #editTask(button) {
    this.#titleEl.toggleAttribute('readonly');
    this.#dateEl.classList.toggle('disabled');
    this.#priorityEl.firstElementChild.classList.toggle('disabled');
    this.#repetitionEl.firstElementChild.classList.toggle('disabled');
  }

  #updateDatePickerValue() {
    const dateArray = this.#dueDate.split('-');
    this.#dateEl.firstElementChild.value = (this.#dueDate === 'None') ? '' : `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
  }

  #updateDate() {
    this.#setDate(new Date(this.#dateEl.firstElementChild.value), this.#repetition);
    this.#dateEl.lastElementChild.textContent = this.#getDateString();
  }

  #updateTask() {
    this.#title = this.#titleEl.value;
    this.#priority = this.#priorityEl.querySelector('.selected').textContent;
    this.#repetition = this.#repetitionEl.querySelector('.selected').textContent;
    this.#updateDate();
    console.log(`${this.#titleEl} ${this.#priority} ${this.#repetition} ${this.#dueDate}`);
  }

  addSubTask() {
    const addSubTaskInput = this.#subTasksEl.querySelector('input.add');
    const subTaskTitle = addSubTaskInput.value[0].toUpperCase() + addSubTaskInput.value.slice(1);
    addSubTaskInput.value = "";
    const subTask = document.createElement('li');
    subTask.classList.add('sub-task');
    subTask.innerHTML = `
    <div class="checkbox-before">
      <input type="checkbox" name="task1" id="task1" />
      <span></span>
      <p class="checkbox-text">${subTaskTitle}</p>
    </div>
    <i class="fa-solid fa-trash delete"></i>`;
    subTask.lastChild.addEventListener('click', this.deleteSubTask);
    this.#subTaskArray.push(subTask);
    this.#subTasksEl.insertBefore(subTask, this.#subTasksEl.children[this.#subTasksEl.children.length - 1]);
  }

  deleteSubTask(event) {
    event.target.parentNode.parentNode.removeChild(event.target.parentNode);
  }

  deleteTask() {
    this.deleted = true;
    console.log(this.taskEl);
    this.taskEl.parentNode.removeChild(this.taskEl);
  }

  handleChecked() {
    const checkbox = this.taskEl.querySelector('.main-checkbox');
    if (!checkbox.checked) return true;
    if (this.#repetition === 'Once') {
      this.deleteTask();
      return false;
    }
    this.#handleTaskRepetition();
    checkbox.checked = false;
    return true;
  }

  #handleTaskRepetition() {
    console.log(`Past task date: ${this.#dueDate}`);
    const dateArray = this.#dueDate.split('-');
    const dueDate = new Date(`${dateArray[1]}-${dateArray[0]}-${dateArray[2]}`);
    switch (this.#repetition) {
      case 'Daily': dueDate.setDate(dueDate.getDate() + 1); break;
      case 'Weekly': dueDate.setDate(dueDate.getDate() + 7); break;
      case 'Monthly': dueDate.setMonth(dueDate.getMonth() + 1); break;
      case 'Yearly': dueDate.setFullYear(dueDate.getFullYear() + 1); break;
    }
    this.#setDate(dueDate, this.#repetition);
    this.#updateDatePickerValue();
    this.#dateEl.lastElementChild.textContent = this.#getDateString();
    console.log(`Current task date: ${this.#dueDate}`);
  }
}