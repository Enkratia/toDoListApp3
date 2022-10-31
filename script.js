const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".controls .clear-btn"),
  taskBox = document.querySelector(".task-box");

let todos = JSON.parse(localStorage.getItem("todo-list"));
let editId;
let isEditedTask = false;

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showToDo(btn.id);
  });
});

clearAll.addEventListener("click", () => {
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showToDo();
});

function showToDo(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let isCompleted = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        li += `<li class="task">
              <label for="${id}">
                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}> 
                <p class="${isCompleted}">${todo.name}</p>
              </label>
              <div class="settings">
                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                <ul class="task-menu">
                  <li onclick="editTask(${id}, '${todo.name}')"><i class="uil uil-pen"></i>Edit</li>
                  <li onclick="deleteTask(${id}, '${filter}')"><i class="uil uil-trash"></i>Delete</li>
                </ul>
              </div>
            </li>`;
      }
    });
    taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
  }
};

showToDo("all");

function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
}

function deleteTask(deleteId, filter) {
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showToDo(filter);
}

function showMenu(selectedTask) {
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", e => {
    if (e.target.tagName !== "I" || e.target !== selectedTask) {
      taskMenu.classList.remove("show");
    }
  })
}

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}


taskInput.addEventListener("keyup", e => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditedTask) {
      if (!todos) {
        todos = [];
      }
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo);
    } else {
      todos[editId].name = userTask;
      isEditedTask = false;
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showToDo(document.querySelector(".filters span.active").id);
    taskInput.value = "";
  }
});