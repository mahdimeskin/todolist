const collectionSection = document.getElementById("appendable");
const taskDiv = document.getElementById("tasks");
let lastChosenCollection = null;
let collectionButtons = document.getElementsByClassName("collection");
const newCollectionButton = document.getElementById("addCollection");
const newTaskButton = document.getElementById("addTask");
const taskInput = document.getElementById("input");

async function getCollections() {
  let response = await fetch("http://localhost:3000/collections");
  let collections = await response.json();
  return collections;
}

async function showCollections() {
  const all = document.getElementsByClassName("collection-container");
  while (all.length > 0) {
    all[0].remove();
  }

  const collections = await getCollections();
  for (const collection of collections) {

    const list = newCollectionTemplate(collection.title)
    list[0].addEventListener("click", async () => {
      lastChosenCollection = collection.id;

      changeHeader(collection.title)

      const tasks = await getTasks(parseInt(collection.id));
      addTasks(tasks);

      let collections = document.getElementsByClassName("collection");
      for (let c of collections) {
        c.classList.remove("selected");
      }
      list[0].classList.add("selected");
    });

    list[1].addEventListener("click", async (event) => {
      event.stopPropagation();
      const confirmed = confirm(`Delete collection "${collection.title}"?`);
      if (!confirmed) return;

      await fetch(`http://localhost:3000/collections/${collection.id}`, {
        method: "DELETE",
      });

      const tasks = await getTasks(parseInt(collection.id))
      console.log()
      for(const task of tasks){
        await fetch(`http://localhost:3000/tasks/${task.id}`, {
          method: "DELETE",
        })
      }

      if (lastChosenCollection == collection.id) {
        lastChosenCollection = null;
        document.getElementById("collection").textContent = "Choose a collection";
        taskDiv.innerHTML = "";
      }

      showCollections();
    });

    
  }
}

showCollections();

async function appendCollection(newTitle) {
  let response = await fetch("http://localhost:3000/collections", {
    method: "POST",
    body: JSON.stringify({
      id: `${(await getLastCollectionID()) + 1}`,
      title: newTitle,
    }),
  });
}

async function getLastCollectionID() {
  const response = await fetch("http://localhost:3000/collections");
  const collections = await response.json();
  if(collections.length == 0){
    return 1
  }
  let last = parseInt(collections[collections.length - 1].id);
  return last;
}

async function getTasks(id) {
  const response = await fetch("http://localhost:3000/tasks");
  const tasks = await response.json();

  
  const all = document.getElementsByClassName("task");
  const requestedTasks = [];

  for (let task of tasks) {
    if (task.collectionID === id) {
      requestedTasks.push(task);
    }
  }

  while (all.length > 0) {
    all[0].remove();
  }

  return requestedTasks;
}

async function getLastTaskID() {
  const response = await fetch("http://localhost:3000/tasks");
  const tasks = await response.json();
  if (tasks.length === 0) {
    return 0;
  }

  let last = parseInt(tasks[tasks.length - 1].id);
  return last;
}

async function addTasks(tasks) {
  for (const task of tasks) {
    const list = newTaskTemplate(task.title, task.done)

    list[0].addEventListener("change", async () => {
      await fetch(`http://localhost:3000/tasks/${await task.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          done: !task.done,
        }),
      });
    });

    list[1].addEventListener("click", async () => {
      await fetch(`http://localhost:3000/tasks/${await task.id}`, {
        method: "DELETE",
      });

      const tasks = await getTasks(parseInt(lastChosenCollection));
      addTasks(tasks);
    });


  }
}

newTaskButton.addEventListener("click", async () => {
  if (lastChosenCollection === null) {
    alert("choose a collection first");
    return;
  }

  const newTitle = document.getElementById("input").value.trim();
  if (newTitle === "") return;

  const ID = (await getLastTaskID()) + 1;

  await fetch("http://localhost:3000/tasks", {
    method: "POST",
    body: JSON.stringify({
      id: `${ID}`,
      title: `${newTitle}`,
      done: false,
      collectionID: parseInt(lastChosenCollection),
    }),
  });
  document.getElementById("input").value = "";

  const tasks = await getTasks(parseInt(lastChosenCollection));
  addTasks(tasks);
});

newCollectionButton.addEventListener("click", async () => {
  const titleInput = prompt("Enter collection title");
  const title = titleInput?.trim();
  if (!title) return;

  const newID = (await getLastCollectionID()) + 1;

  await appendCollection(title);

  await showCollections();

  lastChosenCollection = newID;
  const name = document.getElementById("collection");
  name.textContent = title;

  const tasks = await getTasks(newID);
  addTasks(tasks);

  const all = document.getElementsByClassName("collection");
  all[all.length-1].classList.add("selected")

  for(let i=0; i<all.length-1; i++){
    if (btn.textContent === title) {
      all[i].classList.remove("selected");
    }
  }
});

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    newTaskButton.click();
  }
});

function changeHeader(title){
  const name = document.getElementById("collection")
  name.textContent = title
}

function newTaskTemplate(title, done){
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

    const list = [checkbox,button]
    return list
}

function newCollectionTemplate(title){
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

    const list = [titleBtn, removeBtn]
    return list
}