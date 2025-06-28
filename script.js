const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumn = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let onloadValue = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArray = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragged = false;

// Get Arrays from localStorage if available, set default values if not
const getSavedColumns = function () {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
};

// Set localStorage Arrays
const updateSavedColumns = function () {
  listArray = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArray[index]));
  });
};

// filter the array to remove the null value
const filterArray = function (array) {
  const filterdArray = array.filter((item) => item !== null);
  return filterdArray;
};

// update item - delete if necessary or update the value of the item
const updateItem = function (id, column) {
  const selectedArray = listArray[column];
  const selectedColumnEl = listColumn[column].children;
  if (!dragged) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
};

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  // append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
const updateDOM = function () {
  // Check localStorage once
  if (!onloadValue) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((arrayEl, index) => {
    createItemEl(backlogList, 0, arrayEl, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((arrayEl, index) => {
    createItemEl(progressList, 1, arrayEl, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((arrayEl, index) => {
    createItemEl(completeList, 2, arrayEl, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((arrayEl, index) => {
    createItemEl(onHoldList, 3, arrayEl, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  onloadValue = true;
  updateSavedColumns();
};

// on load
updateDOM();

// add the item to the column
const addToColumn = function (column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArray[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
};

// add item in the item box
const showInputbox = function (column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
};

// hide item input box
const hideInputbox = function (column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
};

// Allows array to reflect the drag and drop items
const rebuildArrays = function () {
  backlogListArray = Array.from(backlogList.children).map((i) => i.textContent);
  progressListArray = Array.from(progressList.children).map(
    (i) => i.textContent
  );
  completeListArray = Array.from(completeList.children).map(
    (i) => i.textContent
  );
  onHoldListArray = Array.from(onHoldList.children).map((i) => i.textContent);
  updateDOM();
};

// when the drag item enter another column
const dragEnter = function (column) {
  listColumn[column].classList.add("over");
  currentColumn = column;
};

// column allows drop the item
const drop = function (e) {
  e.preventDefault();
  // remove the highliht style after drop
  listColumn.forEach((column) => {
    column.classList.remove("over");
  });
  // add the drag item
  const parent = listColumn[currentColumn];
  parent.appendChild(draggedItem);
  dragged = false;
  rebuildArrays();
};

// when item drag start
const drag = function (e) {
  draggedItem = e.target;
  dragged = true;
};

// column allow drag the item
const allowDrop = function (e) {
  e.preventDefault();
};
