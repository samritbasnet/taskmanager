const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = [];
let currentFilter = "all"; // Track current filter
let currentTheme = localStorage.getItem("theme") || "light"; // Track current theme

const taskCounter = document.querySelector(".task-counter");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.querySelector(".clear-completed-btn");
const themeToggle = document.getElementById("theme-toggle");

renderTasks();
updateTaskCounter();
taskForm.addEventListener("submit", handleTaskSubmit);

// Add filter event listeners
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");
    setFilter(filter);
  });
});

// Add clear completed event listener
clearCompletedBtn.addEventListener("click", clearCompletedTasks);

// Add theme toggle event listener
themeToggle.addEventListener("click", toggleTheme);

// Initialize theme
initializeTheme();

function handleTaskSubmit(e) {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please Enter a task!");
    return;
  }

  // Create task object
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  // Add to tasks array
  tasks.push(newTask);
  renderTasks();
  updateTaskCounter();
  console.log("Adding task:", taskText);
  console.log("Task object:", newTask);
  console.log("All tasks:", tasks);

  taskInput.value = "";
}
function displayTask(task) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.setAttribute("data-task-id", task.id);

  taskItem.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${
        task.completed ? "checked" : ""
      }>
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <button class="edit-btn" title="Edit task">✏️</button>
        <button class="delete-btn" title="Delete task">🗑️</button>
      </div>
  `;
  const checkbox = taskItem.querySelector(".task-checkbox");
  const editBtn = taskItem.querySelector(".edit-btn");
  const deleteBtn = taskItem.querySelector(".delete-btn");
  taskList.appendChild(taskItem);
  checkbox.addEventListener("change", () => toggleTask(task.id));
  editBtn.addEventListener("click", () => editTask(task.id));
  deleteBtn.addEventListener("click", () => deleteTask(task.id));
}
function toggleTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);

  if (task) {
    task.completed = !task.completed;

    const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
    const taskText = taskItem.querySelector(".task-text");

    if (task.completed) {
      taskText.style.textDecoration = "line-through";
      taskText.style.color = "#888";
    } else {
      taskText.style.textDecoration = "none";
      taskText.style.color = "#000";
    }

    console.log("Task toggled:", task);
  }
  renderTasks();
  updateTaskCounter();
}
function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
  if (taskItem) {
    taskItem.remove();
  }

  console.log("Task deleted:", taskId);
  console.log("Remaining tasks:", tasks);
  renderTasks();
  updateTaskCounter();
}
function updateTaskCounter() {
  const remainingTasks = tasks.filter((task) => !task.completed).length;
  console.log("Tasks array:", tasks);
  console.log("Remaining tasks:", remainingTasks);
  taskCounter.textContent = `${remainingTasks} task${
    remainingTasks !== 1 ? "s" : ""
  } remaining`;
}

function editTask(taskId) {
  const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
  const taskText = taskItem.querySelector(".task-text");
  const currentText = taskText.textContent;

  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.classList.add("edit-input");

  taskText.style.display = "none";
  taskText.parentElement.appendChild(input);
  input.focus();
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveEdit(taskId, input.value);
    }
  });

  input.addEventListener("blur", () => {
    saveEdit(taskId, input.value);
  });
}
function saveEdit(taskId, newText) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.text = newText;

    // Update the UI
    const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
    const taskText = taskItem.querySelector(".task-text");
    const input = taskItem.querySelector(".edit-input");

    taskText.textContent = newText;
    taskText.style.display = "inline";
    input.remove();
  }
}

// Filter functions
function setFilter(filter) {
  currentFilter = filter;

  // Update active button
  filterButtons.forEach((btn) => {
    btn.classList.remove("active");
    btn.setAttribute("aria-pressed", "false");
  });

  const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
  activeBtn.classList.add("active");
  activeBtn.setAttribute("aria-pressed", "true");

  // Re-render tasks with filter
  renderTasks();
}

function renderTasks() {
  // Clear current list
  taskList.innerHTML = "";

  // Filter tasks based on current filter
  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  // Display filtered tasks
  filteredTasks.forEach((task) => {
    displayTask(task);
  });

  // Show/hide empty state
  const emptyState = document.getElementById("emptyState");
  if (filteredTasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}

function clearCompletedTasks() {
  // Remove completed tasks from array
  tasks = tasks.filter((task) => !task.completed);

  // Re-render tasks
  renderTasks();
  updateTaskCounter();

  console.log("Cleared completed tasks");
}

// Theme functions
function initializeTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon();
}

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  themeToggle.textContent = currentTheme === "light" ? "🌙" : "☀️";
}
