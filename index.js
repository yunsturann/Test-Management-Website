var user;
const todoContainer = document.getElementById("todo");
const inProcessContainer = document.getElementById("in-process");
const doneContainer = document.getElementById("done");

window.addEventListener("load", (event) => {
    user = JSON.parse(localStorage.getItem("user"));
    if (user.role == "Manager") {
        document.getElementById("btn-add-task").style.display = "block";
    }
});

const DeleteTask = (e) =>{
    if(confirm("Are you sure to delete to task ?")){
        e.target.parentElement.remove();
    }
}

// add todo
const btnSubmit = document.getElementById("assign-task");
const inputText = document.getElementById("input-task");

const doneTask = (e) => {
    console.log(e.target.parentElement);
    const parentContainer = e.target.parentElement.parentElement;
    if (parentContainer.id === "done") {
        alert("The task done completely");
        e.target.parentElement.classList.add("bg-success");
        return;
    }
    addTask(e.target.previousElementSibling.previousElementSibling.textContent,
         parentContainer.parentElement.nextElementSibling.lastElementChild);
    e.target.parentElement.remove();
}
const viewInfo = (e) => {
    var lightbox2 = document.getElementById("lightbox2");
    lightbox2.style.display = "block";
    var closeLightbox2 = document.getElementById("lightbox2");
    
    closeLightbox2.addEventListener("click", () => {
        lightbox2.style.display = "none";
    });
}
const addTask = (text, parentContainer) => {
    //console.log(text, parentContainer);
    let item = document.createElement("li");
    item.classList.add("item");
    item.innerHTML = `<p>${text}</p> <i class="uil uil-info"></i><i class="uil uil-times"></i><i class="uil uil-check"></i>`;
    item.draggable = true;
    parentContainer.appendChild(item);

    // done click event
    item.querySelector(".uil-check").addEventListener("click", doneTask);
    // delete button event
    item.querySelector(".uil-times").addEventListener("click",DeleteTask);
    //info click event
    item.querySelector(".uil-info").addEventListener("click",viewInfo);
    
    // add dragging events
    item.addEventListener("dragstart", () => {
        // Adding dragging class to item after a delay
        setTimeout(() => item.classList.add("dragging"), 0);
    });
    // Removing dragging class from item on dragend event
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
}

const submitTodo = (e, parentContainer) => {
    e.preventDefault();
    if (inputText.value == "") return;
    addTask(inputText.value, parentContainer);
    inputText.value = "";
}

btnSubmit.addEventListener("click", (e) => submitTodo(e, todoContainer));

const initTodoContainer = (e, parentContainer) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    // Getting all items except currently dragging and making array of them
    let siblings = [...parentContainer.querySelectorAll(".item:not(.dragging)")];

    // Finding the sibling after which the dragging item should be placed
    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });

    // Inserting the dragging item before the found sibling
    parentContainer.insertBefore(draggingItem, nextSibling);
}

todoContainer.addEventListener("dragover", e => initTodoContainer(e, todoContainer));
todoContainer.addEventListener("dragenter", e => e.preventDefault());

inProcessContainer.addEventListener("dragover", e => initTodoContainer(e, inProcessContainer));
inProcessContainer.addEventListener("dragenter", e => e.preventDefault());

doneContainer.addEventListener("dragover", e => initTodoContainer(e, doneContainer));
doneContainer.addEventListener("dragenter", e => e.preventDefault());

//LightBox
const btnAddTask = document.getElementById("btn-add-task");
const lightbox = document.querySelector(".lightbox");
const closeLightbox = document.querySelector(".uil-times");

closeLightbox.addEventListener("click", () => {
    lightbox.classList.remove("show");
})

btnAddTask.addEventListener("click", () => {
    lightbox.classList.add("show");
});


