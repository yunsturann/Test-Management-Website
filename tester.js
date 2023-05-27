
const todoContainer = document.getElementById("todo");
const doneContainer = document.getElementById("done");

const lightbox = document.querySelector(".lightbox");
document.querySelector(".lightbox .uil-times").addEventListener("click", closeTestScreen);

let testerTasks = [];
//Tasks 

const showTestScreen = (e) => {
    console.log(e.target.parentElement.id)
    lightbox.classList.add("show");
    //
    testerTasks.forEach(element => {
        if (element.id == e.target.parentElement.id) {
            document.getElementById("name-info").value = element.name;
            document.getElementById("purpose-info").value = element.purpose;
            document.getElementById("language-info").value = element.language;
            document.getElementById("role-info").value = element.role;
            document.getElementById("date-info").value = element.role;
            document.getElementById("date-info").value = element.date;
            document.getElementById("code").value = element.codeinput;

        }
    });

}

function closeTestScreen() {
    lightbox.classList.remove("show");
}

const addTask = (task, parentContainer) => {
    let element = document.createElement("li");
    element.classList.add("item");
    element.id = task.id;
    element.innerHTML = `<p></p> <i class="uil uil-rocket"></i><i class="uil uil-times"></i><i class="uil uil-check"></i>`;
    element.querySelector("p").textContent = task.name;

    element.querySelector(".uil-rocket").addEventListener("click", showTestScreen);
    console.log(element)
    console.log(parentContainer)

    parentContainer.appendChild(element);
}

const loadContent = () => {
    if (localStorage.getItem("testerTask") == null) {
        testerTasks = [];
    } else {
        testerTasks = JSON.parse(localStorage.getItem("testerTask"));
        testerTasks.forEach(task => addTask(task, todoContainer));
    }
}

document.addEventListener("DOMContentLoaded", loadContent);

// Lightbox and chatlog 

const chatContainer = document.querySelector(".chat-container");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const codeCopyBtn = document.querySelector(".header-code i");
const codeText = document.getElementById("code");

const btnTestCases = document.getElementById("btn-test-cases");
const btnSyntax = document.getElementById("btn-syntax");


function copyCode(e) {
    e.preventDefault();
    navigator.clipboard.writeText(codeText.value);
    alert("Code copied succesfully!");
}

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

    if (userText == "Produce Test Cases") {
        userText += ` for the code.The code is = ${codeText.value}`;
    }
    else if (userText == "Check syntax of Code") {
        userText += ` for the code. The code is =  ${codeText.value}`;
    }

    console.log(userText);

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




