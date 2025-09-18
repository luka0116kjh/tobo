const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const taskCount = document.getElementById("taskCount");
const modeToggle = document.getElementById("modeToggle");

const STORAGE_KEY = "todoapp-tasks";
const MODE_KEY = "todoapp-darkmode";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let darkMode = localStorage.getItem(MODE_KEY) === "true";


function updateMode() {
  if (darkMode) {
    document.body.classList.add("dark");
    modeToggle.textContent = "화이트 모드";
  } else {
    document.body.classList.remove("dark");
    modeToggle.textContent = "다크 모드";
  }
}
updateMode();


function addTask(text) {
  if (!text.trim()) return;
  tasks.push({
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
    important: false,
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
    li.className = "todo-item";
    if (task.completed) li.classList.add("completed");
    if (task.important) li.classList.add("important");
    li.draggable = true;
    li.dataset.id = task.id;


    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleComplete(task.id));
    li.appendChild(checkbox);


    const span = document.createElement("span");
    span.textContent = task.text;
    li.appendChild(span);


    const impBtn = document.createElement("button");
    impBtn.textContent = task.important ? "★" : "☆";
    impBtn.title = "중요 표시 토글";
    impBtn.addEventListener("click", () => toggleImportant(task.id));
    li.appendChild(impBtn);


    const delBtn = document.createElement("button");
    delBtn.textContent = "삭제";
    delBtn.title = "삭제";
    delBtn.addEventListener("click", () => deleteTask(task.id));
    li.appendChild(delBtn);

    todoList.appendChild(li);
  });

  taskCount.textContent = `총 할 일: ${tasks.length}개`;
}


function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  render();
}


modeToggle.addEventListener("click", () => {
  darkMode = !darkMode;
  localStorage.setItem(MODE_KEY, darkMode);
  updateMode();
});


addBtn.addEventListener("click", () => {
  addTask(todoInput.value);
  todoInput.value = "";
  todoInput.focus();
});
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(todoInput.value);
    todoInput.value = "";
  }
});


let dragSrcEl = null;

function handleDragStart(e) {
  dragSrcEl = e.target;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", e.target.outerHTML);
  e.target.classList.add("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  return false;
}

function handleDrop(e) {
  e.stopPropagation();
  if (dragSrcEl !== e.target && e.target.classList.contains("todo-item")) {
    const fromId = dragSrcEl.dataset.id;
    const toId = e.target.dataset.id;

  
    const fromIndex = tasks.findIndex(t => t.id === fromId);
    const toIndex = tasks.findIndex(t => t.id === toId);
    tasks.splice(toIndex, 0, tasks.splice(fromIndex,1)[0]);
    saveAndRender();
  }
  return false;
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging");
}

todoList.addEventListener("dragstart", handleDragStart);
todoList.addEventListener("dragover", handleDragOver);
todoList.addEventListener("drop", handleDrop);
todoList.addEventListener("dragend", handleDragEnd);


render();
