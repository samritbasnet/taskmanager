const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = [];

function init() {
  console.log("Task Manager initialized!");
}

document.addEventListener("DOMContentLoaded", init);

const taskCounter = document.querySelector(".task-counter");

taskForm.addEventListener("submit", handleTaskSubmit);

function handleTaskSubmit(e) {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please Enter a task!");
    return;
  }
  console.log("Adding task:", taskText);
  taskInput.value = "";
}
