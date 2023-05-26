
const lightbox = document.querySelector(".lightbox");

//Tasks

const rocket = document.querySelector(".uil-rocket");
const closeLigthbox = document.querySelector(".lightbox .uil-times");

rocket.addEventListener("click",ShowTest);
closeLigthbox.addEventListener("click",CloseTest);

function ShowTest(e){
    lightbox.classList.add("show");
}

function CloseTest(){
    lightbox.classList.remove("show");
}



// Lightbox and chatlog 

const chatList = document.querySelector(".chat-list");
const chatForm = document.getElementById("chat-form");
const inputForm = document.getElementById("input-form");

chatForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const messageText = inputForm.value;
    inputForm.value = "";

    const messageElement = document.createElement("li");
    messageElement.classList.add('message');
    messageElement.classList.add('message--sent');
    messageElement.textContent = messageText;

    chatList.appendChild(messageElement);
    chatList.scrollTop = chatList.scrollHeight;

    fetch('http://localhost:3000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: messageText
        })
    })
    .then(res => res.json())
    .then(data =>{
        const messageElement= document.createElement('li');
        messageElement.classList.add('message');
        messageElement.classList.add('message--received');
        messageElement.textContent = data.completion.content;
        chatList.appendChild(messageElement);
        chatList.scrollTop = chatList.scrollHeight;
    });

});




