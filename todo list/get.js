async function getCollections() {
  let response = await fetch("http://localhost:3000/collections");
  let collections = await response.json();
  return collections;
}

async function getLastCollectionID() {
  const response = await fetch("http://localhost:3000/collections");
  const collections = await response.json();

  if (collections.length == 0) {
    return 1;
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

export { getCollections, getLastCollectionID, getLastTaskID, getTasks };
