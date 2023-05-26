var person = { name: "", surname: "", username: "", password: "", role: "" };
var persons;
var usernameCheck = false;
const passwordInput = document.querySelector("#password1");
const requirementList = document.querySelectorAll(".requirement-list li");

const requirements = [
    {regex: /.{8,}/, index: 0},
    {regex: /[0-9]/, index: 1},
    {regex: /[a-z]/, index: 2},
    {regex: /[^A-Za-z0-9]/, index: 3},
    {regex: /[A-Z]/, index: 4},
];
passwordInput.addEventListener("keyup", (e) => {
    requirements.forEach(item => {
        const isValid = item.regex.test(e.target.value);
        
        const requirementItem = requirementList[item.index];
        if(isValid) {
            requirementItem.firstElementChild.className="fa-solid fa-check";
            requirementItem.classList.add("valid");
        }else{
          
            requirementItem.firstElementChild.className = "fa-solid fa-circle";
            requirementItem.classList.remove("valid");
        }
    })
})
if (localStorage.getItem('persons') === null) {
    getJSONFile()
}
else {
    persons = JSON.parse(localStorage.getItem('persons'));
}

var signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener("submit", signUp);

function signUp(e) {
    person.username = document.getElementById("username1").value;
    person.name = document.getElementById("name").value;
    person.surname = document.getElementById("surName").value;
    person.password = document.getElementById("password1").value;
    person.role = document.querySelector('input[name="role"]:checked').value;
    e.preventDefault(); // Sayfanın yeniden yüklenmesini önlemek için kullanılır
    persons.forEach(data => {
        if (data.username == person.username) {
            alert("This username is already in use!")
            usernameCheck = true;
        }

    });
    if (usernameCheck) {
        usernameCheck = false;
        return;
    }
    if (person.password != document.getElementById("passwordC").value) {
        alert("Your passwords do not match, please try again!!")
        return;
    }

    persons.push(person);
    localStorage.setItem('persons', JSON.stringify(persons));
    alert("Your registration has been successfully received. You are being redirected to the Sign in page...");
    window.location.href = "signIn.html";

    // Diğer işlemleri burada gerçekleştirebilirsiniz
    // Örneğin, bu verileri bir API'ye gönderme veya depolama işlemleri gibi

}
function getJSONFile() {
    fetch("persons.json").then(function (response) {
        return response.json()
    }).then(function (datas) {
        persons = datas;


    }).catch(function (err) {
        console.log(err);
    })
}
