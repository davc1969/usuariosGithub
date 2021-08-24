
const baseUrl = "https://api.github.com/users/";

// Funcion request, recibe un url y devuelve un json.  Se encarga de llamar a la API
async function request(url) {
    console.log(">> ", url);
    try {
        const response = await fetch(url);
        if (response.ok) {
            data = await response.json();
            if (data) {
                console.log("Lectura de url exitosa, retornando json correspondiente");
                return data;
            }
        }
    }
    catch (err){
        alert("request " + err);
    }
}

const getUser = async (user) => {
    const urlUser = baseUrl + user;
    return request(urlUser)
}

const getRepositories = async (user, page, repos) => {
    const urlRepos = `${baseUrl}${user}/repos?page=${page}&per_page=${repos}`
    return request(urlRepos);
}

function renderUser(userData) {
    let userAvatar   = document.getElementById("userAvatar");
    let userName     = document.getElementById("userName");
    let userLogin    = document.getElementById("userLogin");
    let userRepos    = document.getElementById("userRepos");
    let userLocation = document.getElementById("userLocation");
    let userType     = document.getElementById("userType");

    userAvatar.src         = userData.avatar_url;
    userName.innerHTML     = `<strong>Nombre de usuario: </strong> ${userData.name}`;
    userLogin.innerHTML    = `<strong>Nombre de login: </strong> ${userData.login}`;
    userRepos.innerHTML    = `<strong>Cantidad de repositorios: </strong> ${userData.public_repos}`;
    userLocation.innerHTML = `<strong>Localidad: </strong> ${userData.location}`;
    userType.innerHTML     = `<strong>Tipo de Usuario: </strong> ${userData.type}`;

}

function renderRepos(userRepos){
    let repoList   = document.getElementById("repos_list");
    repoList.innerHTML = "";

    userRepos.forEach(element => {
        repoList.innerHTML += `<a href="${element.html_url}" class="my-2 d-block" target="_blank">${element.name}</a>`;
    });
}


function callPromises (user, page, repPage) {
    console.log("Call Promise: ", user, page, repPage);
    Promise.all([getUser(user), getRepositories(user, page, repPage)])
        .then(
            data => {
                renderUser(data[0]);
                renderRepos(data[1]);
            }
        )
        .catch ( err => alert(err));
}


const submitButton = document.getElementById("submitBtn");
submitButton.addEventListener("click", async event => {
    event.preventDefault;

    
    let userLogin     = document.getElementById("nombre").value;
    let userReposPage = parseInt(document.getElementById("pagina").value);
    let userReposList = parseInt(document.getElementById("repoPagina").value);

    if (userLogin != "" && userReposPage > 0 && userReposList > 0) {
        await callPromises("davc1969", 1, 10);
    }
    else {
        alert("Datos incompletos. Por favor llene todos los campos")
    }
    
})


//callPromises("davc1969", 1, 5);