const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

loadEventListeners();

function loadEventListeners() {
  // DOM load event
  document.addEventListener('DOMContentLoaded', getTasks);
  // add-task event listener
  form.addEventListener('submit', addTask);
  // remove/delete-task event listener
  taskList.addEventListener('click', removeTask);
  // clear-task event listener
  clearBtn.addEventListener('click', clearTasks);
  // filter tasks event
  filter.addEventListener('keyup', filterTasks);
}

// get tasks from LS
function getTasks() {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    clearBtn.removeAttribute('disabled');
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach(function (task) {
    const li = document.createElement('li');

    li.className = 'collection-item';

    li.appendChild(document.createTextNode(task));

    const link = document.createElement('a');

    link.className = 'delete-item secondary-content';

    link.innerHTML = '<i class="fa fa-remove"></i>';

    li.appendChild(link);

    taskList.appendChild(li);
  });
}

// add task
function addTask(e) {
  if (taskInput.value === '') {
    swal('Oops', 'Seems like you have added no task', 'error');

    e.preventDefault();
    return;
  } else {
    clearBtn.removeAttribute('disabled');

    const li = document.createElement('li');

    li.className = 'collection-item';

    li.appendChild(document.createTextNode(taskInput.value));

    const link = document.createElement('a');

    link.className = 'delete-item secondary-content';

    link.innerHTML = '<i class="fa fa-remove"></i>';

    li.appendChild(link);

    taskList.appendChild(li);

    // store task in local-storage
    storeTaskInLocalStorage(taskInput.value);

    taskInput.value = '';

    e.preventDefault();
  }
}

// store task in local-storage
function storeTaskInLocalStorage(task) {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = []; // if there is no task, then, we will initialzie an empty array where we will store the data
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks')); // getting the items stored in 'tasks' variable.
  }
  tasks.push(task); // here, inside 'task' variable, 'taskInput.value' is initialized.

  localStorage.setItem('tasks', JSON.stringify(tasks)); // storing the tasks inside the array using setItem() method.
}

// remove-task event
function removeTask(e) {
  if (e.target.parentElement.classList.contains('delete-item')) {
    swal({
      title: 'Wait..',
      text: 'Are you sure to delete this task permanently ?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        e.target.parentElement.parentElement.remove();

        // remove task from local-storage
        removeTaskFromLocalStorage(e.target.parentElement.parentElement);

        swal('task deleted successfully', {
          icon: 'success',
        });
      }
    });
  }
}

// remove local storage
function removeTaskFromLocalStorage(taskItem) {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.forEach(function (task, index) {
    if (taskItem.textContent === task) {
      tasks.splice(index, 1); // if the task which we want to remove matchh with the task during iteration, then remove the task from local-storage
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// clear-task(clearing all task at once)
function clearTasks() {
  swal({
    title: 'WARNING',
    text: 'Are you sure to delete all the list items all together at once ?',
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      taskList.textContent = '';

      // clear all task from local storage
      clearTasksFromLocalStorage();

      swal('all the tasks has been deleted successfully', {
        icon: 'success',
      });
    }
  });
}

// clearing all the tasks from local-storage
function clearTasksFromLocalStorage(){
  localStorage.clear();
}

// filter tasks
function filterTasks(e) {
  const typedtext = e.target.value.toLowerCase();
  document.querySelectorAll('.collection-item').forEach(function (task) {
    const item = task.firstChild.textContent;

    if (item.toLowerCase().indexOf(typedtext) != -1) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
}
