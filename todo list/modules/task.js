import { newTaskTemplate } from "./ui.js";
import { getLastTaskID, getTasks } from "../get.js";
import { getLastChosenCollection } from "../scripts.js";

const taskDiv = document.getElementById("tasks");
const newTaskButton = document.getElementById("addTask");

async function addTasks(tasks) {
  taskDiv.innerHTML = "";

  for (let task of tasks) {
    let list = newTaskTemplate(task.title, task.done);

    list[0].addEventListener("change", () =>
      taskDoneButton(task.id, task.done)
    );
    list[1].addEventListener("click", () => taskDeleteButton(task.id));
  }
}

async function taskDeleteButton(id) {
  await fetch(`http://localhost:3000/tasks/${id}`, {
    method: "DELETE",
  });
  const tasks = await getTasks(parseInt(getLastChosenCollection()));
  addTasks(tasks);
}

async function taskDoneButton(id, D) {
  await fetch(`http://localhost:3000/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      done: !D,
    }),
  });
}

async function taskPlus() {
  if (getLastChosenCollection() === null) {
    alert("choose a collection first");
    return;
  }

  await appendTasks();

  document.getElementById("input").value = "";

  const tasks = await getTasks(parseInt(getLastChosenCollection()));
  addTasks(tasks);
}

async function appendTasks() {
  const newTitle = document.getElementById("input").value.trim();
  if (newTitle === "") return;

  const ID = (await getLastTaskID()) + 1;

  await fetch("http://localhost:3000/tasks", {
    method: "POST",
    body: JSON.stringify({
      id: `${ID}`,
      title: `${newTitle}`,
      done: false,
      collectionID: parseInt(getLastChosenCollection()),
    }),
  });
}

function newTaskWithEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    newTaskButton.click();
  }
}

export { newTaskWithEnter, taskPlus, addTasks };
