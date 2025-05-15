import { showCollections, collectionPlus } from "./modules/collection.js";
import { newTaskWithEnter, taskPlus } from "/modules/task.js";

let lastChosenCollection = null;
const newCollectionButton = document.getElementById("addCollection");
const newTaskButton = document.getElementById("addTask");
const taskInput = document.getElementById("input");

showCollections();

newTaskButton.addEventListener("click", taskPlus);
newCollectionButton.addEventListener("click", collectionPlus);
taskInput.addEventListener("keydown", newTaskWithEnter);

function getLastChosenCollection() {
  return lastChosenCollection;
}
function setLastChosenCollection(id) {
  lastChosenCollection = id;
}

export { getLastChosenCollection, setLastChosenCollection };
