var user;
var tasks = []
var task = { id: 0, name: "", purpose: "", language: "", role: "", date: new Date(), container: "", codeinput: "" }

const todoContainer = document.getElementById("todo");
const inProcessContainer = document.getElementById("in-process");
const doneContainer = document.getElementById("done");
const btnSubmit = document.getElementById("assign-task");

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

//load function
window.addEventListener("load", (event) => {
    user = JSON.parse(localStorage.getItem("user"));
    if (user.role == "Manager") {
        document.getElementById("btn-add-task").style.display = "block";
    }
    setcontainer();
});

const DeleteTask = (e) => {
    if (confirm("Are you sure to delete to task ?")) {
        getLocal();

        tasks.forEach(function (task, index, arr) {
            if (e.target.parentElement.id == task.id) {
                arr.splice(index, 1);
                return;
            }
        });
        console.log(tasks)
        localStorage.setItem('tasks', JSON.stringify(tasks));

        console.log(e.target.parentElement.children[0].innerHTML);
        e.target.parentElement.remove();

    }
}


// add todo

const doneTask = (e) => {
    console.log()
    const parentContainer = e.target.parentElement.parentElement;
    if (parentContainer.id === "done") {
        alert("The task done completely");
        e.target.parentElement.classList.add("bg-success");
        setTesterTask(e.target.parentElement.id);
        return;

    }
    //console.log(e.target.parentElement.children[0].textContent)
    console.log(e.target.parentElement.id);
    changeLocal(e.target.parentElement.id, parentContainer);
    addTask(e.target.parentElement.children[0].textContent, parentContainer);
    e.target.parentElement.remove();
}
const viewInfo = (e) => {
    var lightbox2 = document.getElementById("lightbox2");
    document.getElementById("saveInfo").addEventListener("click", () => {
        task.codeinput = document.getElementById("code-info").value;
        changeLocal(e.target.parentElement.id, "1")
    })
    lightbox2.style.display = "block";
    var closeLightbox2 = document.getElementById("lightbox2").children[0].children[0].children[1];
    tasks.forEach(task => {
        if (e.target.parentElement.id == task.id) {
            //console.log(task);
            document.getElementById("name-info").value = task.name;
            document.getElementById("purpose-info").value = task.purpose;
            document.getElementById("language-info").value = task.language;
            document.getElementById("role-info").value = task.role;
            document.getElementById("date-info").value = task.date;
            if (task.language == "none") {
                document.getElementById("codeInput").style.display = "none";
            }
            else {
                document.getElementById("codeInput").style.display = "";
                document.getElementById("code-info").value = task.codeinput;


            }


        }
    });
    closeLightbox2.addEventListener("click", () => {
        lightbox2.style.display = "none";
    });
}
const addTask = (text, parentContainer) => {
    let item = document.createElement("li");
    item.classList.add("item");
    item.innerHTML = `<p>${text}</p> <i class="uil uil-info"></i><i class="uil uil-times"></i><i class="uil uil-check"></i>`; item.draggable = true;
    item.id = task.id;
    parentContainer.appendChild(item);

    // done click event
    item.querySelector(".uil-check").addEventListener("click", doneTask);
    // delete button event
    item.querySelector(".uil-times").addEventListener("click", DeleteTask);
    //info click event
    item.querySelector(".uil-info").addEventListener("click", viewInfo);
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
    task.id = Date.now();
    task.name = document.getElementById("input-task").value;
    task.purpose = document.getElementById("purpose-task").value;;
    task.language = document.getElementById('language-task').options[document.getElementById('language-task').selectedIndex].value
    task.role = document.getElementById('role-task').options[document.getElementById('role-task').selectedIndex].value
    task.date = document.getElementById("date-task").value;
    task.container = "todoContainer";


    if (task.name == "" || task.purpose == "" || !task.date) {
        alert("Please fill in all the blanks!")
        return;
    }
    addTask(task.name, parentContainer);
    document.getElementById("input-task").value = "";
    document.getElementById("purpose-task").value = "";
    setLocal();

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
    console.log(draggingItem);

    changeLocal(draggingItem.id, parentContainer);
    // Inserting the dragging item before the found sibling
    parentContainer.insertBefore(draggingItem, nextSibling);
}

todoContainer.addEventListener("dragover", e => initTodoContainer(e, todoContainer));
todoContainer.addEventListener("dragenter", e => e.preventDefault());

inProcessContainer.addEventListener("dragover", e => initTodoContainer(e, inProcessContainer));
inProcessContainer.addEventListener("dragenter", e => e.preventDefault());

doneContainer.addEventListener("dragover", e => initTodoContainer(e, doneContainer));
doneContainer.addEventListener("dragenter", e => e.preventDefault());


function setLocal() {
    getLocal();

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function getLocal() {
    if (localStorage.getItem('tasks') == null) {
        return;
    }
    tasks = JSON.parse(localStorage.getItem('tasks'))
}
function setcontainer() {
    getLocal()
    console.log(tasks);

    tasks.forEach(element => {
        if (element.container == "todoContainer") {
            task.id = element.id;
            addTask(element.name, todoContainer);
        }
        if (element.container == "inProcessContainer") {
            task.id = element.id;
            addTask(element.name, inProcessContainer)

        }
        if (element.container == "doneContainer") {
            task.id = element.id;
            addTask(element.name, doneContainer)

        }

    });
}
function changeLocal(id, parentContainer) {
    //console.log("2")
    if (parentContainer == "1") {
        tasks.forEach(element => {
            if (element.id == id) {
                element.codeinput = task.codeinput;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                return;
            }
        });
    }
    else {
        tasks.forEach(element => {
            if (element.id == id) {
                element.container =
                    parentContainer.id == "todo"
                        ? 'todoContainer'
                        : parentContainer.id == "in-process"
                            ? 'inProcessContainer'
                            : 'doneContainer';
                //console.log("2")
                localStorage.setItem('tasks', JSON.stringify(tasks));
                return;

            }
        });
    }

}
function setTesterTask(id) {
    tasks.forEach(element => {
        if (element.id == id) {
            /*    task.id = element.id;
                task.name = element.name;
                task.purpose = element.purpose;
                task.language = element.language;
                task.role = element.role;
                task.date = element.date;
                task.container = element.container;
                task.codeinput = element.code;
    */
            if (localStorage.getItem('testerTask') == null) {
                var testerTask = [];
                testerTask.push(element);
                localStorage.setItem('testerTask', JSON.stringify(testerTask));
            }
            else {
                var testerTask = localStorage.getItem('testerTask');
                testerTask.push(element);
                localStorage.setItem('testerTask', JSON.stringify(testerTask));
            }
        }
    });
}

