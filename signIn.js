var person = { name: "", surname: "", username: "", password: "", role: "" };
var persons;
var signInForm = document.getElementById("signInForm");
var usernameCheck = false;

signInForm.addEventListener("submit", signIn);

if (localStorage.getItem('persons') === null) {
    getJSONFile()
}
else {
    persons = JSON.parse(localStorage.getItem('persons'));
}



function signIn(e) {
    person.username = document.getElementById("username").value
    person.password = document.getElementById("password").value
    console.log("aa")
    e.preventDefault(); // Sayfanın yeniden yüklenmesini önlemek için kullanılır
    persons.forEach(data => {
        if (person.username == data.username) {
            usernameCheck = true;
            if (person.password == data.password) {
                person.name = data.name;
                person.surname = data.surname;
                person.role = data.role;
                localStorage.setItem('user', JSON.stringify(person));
                if (data.role == "Developer") {
                    window.location.href = "index.html";
                }
                else if (data.role == "Tester") {
                    window.location.href = "tester.html";
                }
            }
            else {
                alert("Invalid password!!");
            }
        }

    });
    if (!usernameCheck) {
        usernameCheck = false;
        alert("Username not found!! If you do not have an account, you can create a new account.")
        return;
    }
    // Formdaki değerleri almak


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

