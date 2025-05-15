import { getLastChosenCollection, setLastChosenCollection } from "../scripts.js";

const collectionSection = document.getElementById("appendable");
const taskDiv = document.getElementById("tasks");

function changeHeader(title) {
  const name = document.getElementById("collection");
  name.textContent = title;
}

function resetHeader(id) {
  if (getLastChosenCollection() == id) {
    setLastChosenCollection(null)
    document.getElementById("collection").textContent = "Choose a collection";
    taskDiv.innerHTML = "";
  }
}

function newTaskTemplate(title, done) {
  const section = document.createElement("section");
  section.setAttribute("class", "task");

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");

  const div = document.createElement("div");
  div.textContent = title;

  const button = document.createElement("button");
  button.textContent = "remove";

  if (done) {
    checkbox.setAttribute("checked", true);
  }

  section.appendChild(checkbox);
  section.appendChild(div);
  section.appendChild(button);
  taskDiv.appendChild(section);

  const list = [checkbox, button];
  return list;
}

function newCollectionTemplate(title) {
  const container = document.createElement("div");
  container.className = "collection-container";

  const titleBtn = document.createElement("button");
  titleBtn.textContent = title;
  titleBtn.setAttribute("class", "collection");

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "✕";
  removeBtn.className = "remove-collection";

  container.appendChild(titleBtn);
  container.appendChild(removeBtn);
  collectionSection.appendChild(container);

  const list = [titleBtn, removeBtn];
  return list;
}

export { changeHeader, newCollectionTemplate, newTaskTemplate, resetHeader };
