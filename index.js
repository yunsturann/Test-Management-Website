var user;
var tasks = []
var task = { id: 0, name: "", purpose: "", language: "", role: "", date: new Date(), container: "", codeinput: "", currentState: "" }
var xmlData;


const todoContainer = document.getElementById("todo");
const inProcessContainer = document.getElementById("in-process");
const doneContainer = document.getElementById("done");
const btnSubmit = document.getElementById("assign-task");
const toTesterBtn = document.getElementById("test-page-btn");

toTesterBtn.addEventListener("click", () => window.location.assign("tester.html"));
document.getElementById("chira").addEventListener("click", () => { if (confirm("Are you sure to go to signin.html")) window.location.assign("signin.html"); });

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
        document.getElementById("mid-header").style.display = "block";
    }
    setcontainer();
});

const DeleteTask = (e) => {

    if (user.role != "Manager") {
        alert("Only Manager Can Remove Tasks!");
        return;
    }

    if (confirm("Are you sure to delete to task ?")) {
        getLocal();

        tasks.forEach(function (task, index, arr) {
            if (e.target.parentElement.id == task.id) {
                arr.splice(index, 1);
                return;
            }
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
        e.target.parentElement.remove();

    }
}

// add todo

const doneTask = (e) => {

    const parentContainer = e.target.parentElement.parentElement;
    getTask(task.id)

    console.log(parentContainer.id);
    console.log("a")
    if (parentContainer.id == "todo") {
        console.log("a")

        if (task.codeinput == "") {
            alert("No code written");
            checkNfa("Error");
        }
        else {
            checkNfa("Success");
            changeLocal(task.id, 1);
            addTask(e.target.parentElement.children[0].textContent, parentContainer.parentElement.nextElementSibling.lastElementChild);
            e.target.parentElement.remove();
        }
    }

    else if (parentContainer.id === "in-process") {

        if (confirm("Your code will be redirected to the tester screen. Are you sure you checked your code?") == true) {
            checkNfa("Success");
            e.target.parentElement.classList.add("bg-success");
            e.target.parentElement.children[3].style.display = "none";

            changeLocal(e.target.parentElement.id, parentContainer.parentElement.nextElementSibling.lastElementChild);
            addTask(e.target.parentElement.children[0].textContent, parentContainer.parentElement.nextElementSibling.lastElementChild);
           // setTesterTask(e.target.parentElement.id);

            e.target.parentElement.remove();
            alert("The task done completely");

        } else {
            checkNfa("Error");
        }
       

    }
  
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
            document.getElementById("state-info").value = task.currentState;

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
    console.log(item);
    if (item.parentElement.id == "done") {
        item.children[3].style.display = "none";
        item.classList.add("bg-success");
    }
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
    task.currentState = xmlData.getElementsByTagName("initialState")[0].textContent;


    if (task.name == "" || task.purpose == "" || !task.date) {
        alert("Please fill in all the blanks!")
        checkNfa("Error")
        return;
    }
    checkNfa("Success");

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


function setLocal() {
    getLocal();

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function getLocal() {
    if (localStorage.getItem('tasks') == null) {
        return;
    }
    tasks = JSON.parse(localStorage.getItem('tasks'));
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
                element.currentState = task.currentState;
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

var xhr = new XMLHttpRequest();
xhr.open("GET", "nfa.xml", true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        xmlData = xhr.responseXML; // XML yanıtını alın
        console.log(xmlData);
        currentState = xmlData.getElementsByTagName("initialState")[0].textContent;
        // XML içeriğini işleyin
        /* var elements = xmlData.getElementsByTagName("element");
         for (var i = 0; i < elements.length; i++) {
             var element = elements[i];
             var text = element.textContent;
             console.log(text);
         }*/
    }
};
xhr.send();

function checkNfa(input) {
    getTask(task.id);
    for (let index = 0; index < xmlData.getElementsByTagName("transitions")[0].children.length; index++) {
        if (xmlData.getElementsByTagName("transitions")[0].children[index].children[0].textContent == task.currentState && xmlData.getElementsByTagName("transitions")[0].children[index].children[2].textContent == input) {
            task.currentState = xmlData.getElementsByTagName("transitions")[0].children[index].children[1].textContent;
            console.log(currentState);
            return;
        }
    }
}

function getTask(id) {
    tasks.forEach(element => {
        if (element.id == id) {
            task.id = element.id;
            task.name = element.name;
            task.purpose = element.purpose;
            task.language = element.language;
            task.date = element.date;
            task.codeinput = element.codeinput;
            task.currentState = element.currentState;
            console.log(task);
        }
    });
}