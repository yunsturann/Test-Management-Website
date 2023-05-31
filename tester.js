
const todoContainer = document.getElementById("todo");
const doneContainer = document.getElementById("done");
const toDeveloper = document.getElementById("dev-page-btn");

const lightbox = document.querySelector(".lightbox");
var tasks = []
var task = { id: 0, name: "", purpose: "", language: "", role: "", date: new Date(), container: "", codeinput: "", currentState: "" }
var xmlData;
var checkButton = document.getElementById("checkButton");
var testcompletion = document.getElementById("testcompletion");
checkButton.children[0].addEventListener("click", function () {
    // checkNfa("Success");
    alert("Code syntax checked.");
    task.container = "doneContainer";

    if (task.currentState == "CheckSyntax") {
        btnSyntax.style.display = "none";
        btnTestCases.style.display = "block"
        testcompletion.style.display = "none"
    }
    if (task.currentState == "CheckTestCase") {
        btnSyntax.style.display = "none";
        btnTestCases.style.display = "none"
        testcompletion.style.display = "block"

    }
    if (task.currentState == "TestCompletion") {

        btnSyntax.style.display = "none";
        btnTestCases.style.display = "none"
        testcompletion.style.display = "none"
        addTask(task, doneContainer);
        task.container = "done";
        alert("Task fully completed!")
        location.reload();

    }
    checkNfa("Success");
    changeLocal();
    document.getElementById("state-info").value = task.currentState;


});
checkButton.children[1].addEventListener("click", function () {
    if (task.currentState === "TestCompletion") {
        checkNfa("Error");
        checkButton.style.display = "block";
        btnSyntax.style.display = "none";
        btnTestCases.style.display = "block";
        testcompletion.style.display = "none"
        changeLocal();

    }
    else {
        checkNfa("Error");
        task.container = "todoContainer"
        changeLocal();
        alert("Task being sent back to developer screen.");
        location.reload();
    }



});


document.getElementById("chira").addEventListener("click", () => { if (confirm("Are you sure to go to signin.html")) window.location.assign("signin.html"); });
document.querySelector(".lightbox .uil-times").addEventListener("click", closeTestScreen);

let testerTasks = [];
//Tasks 

const showTestScreen = (e) => {
    //console.log(e.target.parentElement.id)
    lightbox.classList.add("show");
    // 
    getTask(e.target.parentElement.id);
    if (task.currentState == "CheckSyntax") {
        console.log("a")
        btnSyntax.style.display = "block";
        btnTestCases.style.display = "none";
        testcompletion.style.display = "none"
        checkButton.style.display = "block";


    }
    if (task.currentState === "CheckTestCase") {
        console.log("a")
        checkButton.style.display = "block";
        btnSyntax.style.display = "none";
        btnTestCases.style.display = "block";
        testcompletion.style.display = "none"

    }
    if (task.currentState === "TestCompletion") {
        console.log("a")
        btnSyntax.style.display = "none";
        btnTestCases.style.display = "none";
        testcompletion.style.display = "block"
        checkButton.style.display = "block";


    }
    if (task.currentState === "ProjectDelivery") {
        console.log("a")
        btnSyntax.style.display = "none";
        btnTestCases.style.display = "none";
        testcompletion.style.display = "none"
        checkButton.style.display = "none";

    }
    tasks.forEach(element => {
        if (element.id == e.target.parentElement.id) {
            document.getElementById("name-info").value = element.name;
            document.getElementById("purpose-info").value = element.purpose;
            document.getElementById("language-info").value = element.language;
            document.getElementById("role-info").value = element.role;
            document.getElementById("date-info").value = element.date;
            document.getElementById("code").value = element.codeinput;
            document.getElementById("state-info").value = element.currentState;

        }
    });

}

function closeTestScreen() {
    lightbox.classList.remove("show");
}

const removeTask = (e) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user.role != "Manager") {
        alert("Only Manager Can Remove Tasks!");
        return;
    }

    if (!confirm("Are u sure to delete task!")) return;

    const id = e.target.parentElement.id;

    e.target.parentElement.remove();

    for (let i = 0; i < testerTasks.length; i++) {
        if (testerTasks[i].id == id) {
            testerTasks.splice(i, 1);
            localStorage.setItem("testerTask", JSON.stringify(testerTasks));
            return;
        }
    }

}

const moveTask = (e) => {

    if (e.target.parentElement.parentElement.id == "done") {
        alert("This task is done completely!");
        e.target.parentElement.classList.add("task-done");
        const id = e.target.parentElement.id;
        e.target.remove();

        for (let i = 0; i < testerTasks.length; i++) {
            if (testerTasks[i].id == id) {
                testerTasks[i].container = "done";
                localStorage.setItem("testerTask", JSON.stringify(testerTasks));
                return;
            }
        }
        return;
    }

    doneContainer.appendChild(e.target.parentElement);

}

const addTask = (task, parentContainer) => {
    let element = document.createElement("li");
    element.classList.add("item");
    element.id = task.id;
    element.innerHTML = `<p></p> <i class="uil uil-rocket"></i><i class="uil uil-times"></i><i class="uil uil-check"></i>`;
    element.querySelector("p").textContent = task.name;

    element.querySelector(".uil-rocket").addEventListener("click", showTestScreen);
    element.querySelector(".uil-check").addEventListener("click", moveTask);
    element.querySelector(".uil-times").addEventListener("click", removeTask);

    if (task.container == "done") {
        element.classList.add("task-done");
        element.querySelector(".uil-check").remove();
    }

    parentContainer.appendChild(element);
}

const loadContent = () => {
    /* if (localStorage.getItem("testerTask") == null) {
         testerTasks = [];
     } else {
         testerTasks = JSON.parse(localStorage.getItem("testerTask"));
         testerTasks.forEach(task => {
             if (task.container == "done") {
                 addTask(task, doneContainer);
             } else {
                 addTask(task, todoContainer);
             }
 
         });
     }*/
    getLocal();

    tasks.forEach(task => {

        if (task.container == "doneContainer") {
            addTask(task, todoContainer);
        }
        if (task.container == "done") {
            addTask(task, doneContainer);

        }

    });
}
const user = JSON.parse(localStorage.getItem("user"));

if (user.role == "Manager") {
    toDeveloper.style.display = "block";
}


toDeveloper.addEventListener("click", () => window.location.assign("index.html"));
document.addEventListener("DOMContentLoaded", loadContent);

// Lightbox and chatlog 

const chatContainer = document.querySelector(".chat-container");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const codeCopyBtn = document.querySelector(".header-code i");
const codeText = document.getElementById("code");
const clearChatBtn = document.getElementById("clear");

const btnTestCases = document.getElementById("btn-test-cases");
const btnSyntax = document.getElementById("btn-syntax");


function copyCode(e) {
    e.preventDefault();
    navigator.clipboard.writeText(codeText.value);
    alert("Code copied succesfully!");
}


clearChatBtn.addEventListener("click", () => { if (confirm("Are you sure to clear chat ?")) chatContainer.innerHTML = ""; });
codeCopyBtn.addEventListener("click", copyCode);


// 

let userText = null;

const createElement = (html, className) => {
    // create new div and apply chat, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    //console.log(chatDiv);
    return chatDiv;
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "http://localhost:3000";
    const pElement = document.createElement("p");
    const codeLanguage = document.querySelector("#language-info").value;
    //console.log(codeLanguage);

    if (userText == "Produce Test Cases") {
        userText += ` for the code.The code language is = ${codeLanguage}. The code is = ${codeText.value}`;
    }
    else if (userText == "Check syntax of Code") {
        userText += ` for the code.The code language is = ${codeLanguage}. The code is =  ${codeText.value}`;
    }

    //console.log(userText);

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: userText
        })
    }

    try {
        const response = await (await fetch(API_URL, requestOptions)).json();

        pElement.textContent = response.completion.content.trim();
    } catch (error) {
        console.log(error);
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;

}

const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.innerHTML = `<i style="color:green" class="fa-solid fa-check fa-lg"></i>`;

    setTimeout(() => {
        copyBtn.innerHTML = `<i class="fa-regular fa-copy fa-lg"></i>`;
    }, 1500);
}

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/chatbot.jpg" alt="ChatBot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style = "--delay: 0.2s"></div>
                            <div class="typing-dot" style = "--delay: 0.3s"></div>
                            <div class="typing-dot" style = "--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick = "copyResponse(this)" class="copy-icon"><i class="fa-regular fa-copy fa-lg"></i></span>
                </div>`;
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = (e) => {
    e.preventDefault();

    if (e.target.id == "btn-test-cases") {
        userText = "Produce Test Cases";
    }
    else if (e.target.id == "btn-syntax") {

        userText = "Check syntax of Code";
    } else {
        userText = chatInput.value.trim();
        chatInput.value = '';

        if (userText == null)
            return;
    }



    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/user.jpg" alt="User-img">
                        <p></p>
                    </div>
                </div>`;
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    chatContainer.appendChild(outgoingChatDiv);
    setTimeout(showTypingAnimation, 500);
}

sendBtn.addEventListener("click", handleOutgoingChat);
btnSyntax.addEventListener("click", handleOutgoingChat);
btnTestCases.addEventListener("click", handleOutgoingChat);





var xhr = new XMLHttpRequest();
xhr.open("GET", "nfa.xml", true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        xmlData = xhr.responseXML; // XML yanıtını alın
        console.log(xmlData);

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
    for (let index = 0; index < xmlData.getElementsByTagName("transitions")[0].children.length; index++) {
        if (xmlData.getElementsByTagName("transitions")[0].children[index].children[0].textContent == task.currentState && xmlData.getElementsByTagName("transitions")[0].children[index].children[2].textContent == input) {
            task.currentState = xmlData.getElementsByTagName("transitions")[0].children[index].children[1].textContent;
            return;
        }
    }

}
function getTask(id) {
    getLocal();
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
function changeLocal() {
    tasks.forEach(element => {
        if (element.id == task.id) {
            element.currentState = task.currentState;
            element.codeinput = task.codeinput;
            element.container = task.container
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));

}