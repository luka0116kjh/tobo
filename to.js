const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const taskCount = document.getElementById("taskCount");
const modeToggle = document.getElementById("modeToggle");
const todoForm = document.getElementById("todoForm");

const STORAGE_KEY = "todoapp-tasks";
const MODE_KEY = "todoapp-darkmode";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let darkMode = localStorage.getItem(MODE_KEY) === "true";


function updateMode() {
  document.body.classList.toggle("dark", darkMode);
  modeToggle.textContent = darkMode ? "☀" : "◑";
}
updateMode();

function addTask(text) {
  if (!text.trim()) return;
  tasks.push({
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
    important: false
  });
  saveAndRender();
}


function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
}


function toggleComplete(id) {
  tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
  saveAndRender();
}


function toggleImportant(id) {
  tasks = tasks.map(t => t.id === id ? {...t, important: !t.important} : t);
  saveAndRender();
}


function render() {
  todoList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "todo-item" + (task.completed ? " completed" : "");

    const leftDiv = document.createElement("div");
    leftDiv.className = "left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleComplete(task.id));
    leftDiv.appendChild(checkbox);

    const span = document.createElement("span");
    span.textContent = task.text;
    leftDiv.appendChild(span);

    const impBtn = document.createElement("button");
    impBtn.className = "important-btn";
    impBtn.textContent = task.important ? "★" : "☆";
    impBtn.title = "중요 표시";
    impBtn.addEventListener("click", () => toggleImportant(task.id));
    leftDiv.appendChild(impBtn);

    li.appendChild(leftDiv);


    const delBtn = document.createElement("button");
    delBtn.className = "del-btn";
    delBtn.textContent = "삭제";
    delBtn.title = "삭제";
    delBtn.addEventListener("click", () => deleteTask(task.id));
    li.appendChild(delBtn);

    todoList.appendChild(li);
  });
  taskCount.textContent = `할 일: ${tasks.length}`;
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  render();
}


todoForm.addEventListener("submit", e => {
  e.preventDefault();
  addTask(todoInput.value);
  todoInput.value = "";
});


modeToggle.addEventListener("click", () => {
  darkMode = !darkMode;
  localStorage.setItem(MODE_KEY, darkMode);
  updateMode();
});


render();
