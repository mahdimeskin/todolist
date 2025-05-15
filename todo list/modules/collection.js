import { getCollections, getTasks, getLastCollectionID } from "../get.js";
import { changeHeader, newCollectionTemplate, resetHeader } from "./ui.js";
import {
  getLastChosenCollection,
  setLastChosenCollection,
} from "../scripts.js";
import { addTasks } from "./task.js";

async function collectionButton(collection, button) {
  setLastChosenCollection(collection.id);

  changeHeader(collection.title);

  const tasks = await getTasks(parseInt(collection.id));
  addTasks(tasks);

  let collections = document.getElementsByClassName("collection");
  for (let c of collections) {
    c.classList.remove("selected");
  }
  button.classList.add("selected");
}

export async function showCollections() {
  const all = document.getElementsByClassName("collection-container");
  while (all.length > 0) {
    all[0].remove();
  }

  const collections = await getCollections();
  for (let collection of collections) {
    let list = newCollectionTemplate(collection.title);

    list[0].addEventListener("click", () =>
      collectionButton(collection, list[0])
    );

    list[1].addEventListener("click", (event) =>
      removeCollectionButton(event, collection.title, collection.id)
    );
  }
}

async function deleteCollection(id) {
  await fetch(`http://localhost:3000/collections/${id}`, {
    method: "DELETE",
  });
}

async function deleteCollectionTasks(id) {
  const tasks = await getTasks(parseInt(id));
  for (const task of tasks) {
    await fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: "DELETE",
    });
  }
}

async function removeCollectionButton(event, title, id) {
  event.stopPropagation();

  const confirmed = confirm(`Delete collection "${title}"?`);
  if (!confirmed) return;

  await deleteCollection(id);
  await deleteCollectionTasks(id);
  resetHeader(id);

  await showCollections();
}

async function appendCollection(newTitle) {
  await fetch("http://localhost:3000/collections", {
    method: "POST",
    body: JSON.stringify({
      id: `${(await getLastCollectionID()) + 1}`,
      title: newTitle,
    }),
  });
}

export async function collectionPlus() {
  const titleInput = prompt("Enter collection title");
  const title = titleInput?.trim();
  if (!title) return;

  const newID = (await getLastCollectionID()) + 1;

  await appendCollection(title);

  await showCollections();

  setLastChosenCollection(newID);
  const name = document.getElementById("collection");
  name.textContent = title;

  const tasks = await getTasks(newID);
  addTasks(tasks);

  const all = document.getElementsByClassName("collection");
  all[all.length - 1].classList.add("selected");
}
