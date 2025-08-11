const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = [];
const taskCounter = document.querySelector(".task-counter");
updateTaskCounter();
taskForm.addEventListener("submit", handleTaskSubmit);

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
  displayTask(newTask);
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
