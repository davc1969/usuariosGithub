// URL base del API de hithub para leer la información de los usuarios
const baseUrl = "https://api.github.com/users/";

// Funcion request, recibe un url y devuelve un json.  Se encarga de llamar a la API de GitHub
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


// Función para obtener la información del usuario, recibe el nombre del usuario 
// y lo pasa a la función request que retorna el json correspondiente
const getUser = async (user) => {
    const urlUser = baseUrl + user;
    return request(urlUser)
}


// Función para obtener la información de los repositorios del usuario, 
// recibe el nombre del usuario, el número de página y cuántos repositorios se desa ver
// y lo pasa a la función request que retorna el json correspondiente
const getRepo = async (user, page, repos) => {
    const urlRepos = `${baseUrl}${user}/repos?page=${page}&per_page=${repos}`
    return request(urlRepos);
}


// Función que se encarga de escribir en el html la información obtenida del usuario
// a través de la función getUser.  REcibe el json con la información del usuario y lo
// pone en el html en donde corresponde
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


// Función que se encarga de escribir en el html la lista de lso repositorios del usuario
// recibida mediante la función getRepositories.  REcibe el json con la información del usuario y lo
// pone en el html en donde corresponde, creando links a cada repositorio listado
function renderRepos(userRepos){
    let repoList   = document.getElementById("repos_list");
    repoList.innerHTML = "";

    userRepos.forEach(element => {
        repoList.innerHTML += `<a href="${element.html_url}" class="my-2 d-block" target="_blank">${element.name}</a>`;
    });
}


// Función que se encarga de llamar simultánemente a las dos promesas necesarias para leer
// toda la información del usuario.  Llama a getUser y getRepo pasando los parámetros necesarios en cada caso
// si recibe bien la respuesta, llama a las funciones render para escribor la data
function callPromises (user, page, repPage) {
    console.log("Call Promise: ", user, page, repPage);
    Promise.all([getUser(user), getRepo(user, page, repPage)])
        .then(
            data => {
                renderUser(data[0]);
                renderRepos(data[1]);
            }
        )
        .catch ( err => alert(err));
}


// definición del escuchador del evento click sobre el boton del formulario
// revisa que estén todos los campos llenos y hace el llamado a callpromises con los parámetros necesarios
const submitButton = document.getElementById("submitBtn");
submitButton.addEventListener("click", async event => {
    event.preventDefault();

    
    let userLogin     = document.getElementById("nombre").value;
    let userReposPage = parseInt(document.getElementById("pagina").value);
    let userReposList = parseInt(document.getElementById("repoPagina").value);

    if (userLogin != "" && userReposPage > 0 && userReposList > 0) {
        await callPromises(userLogin, userReposPage, userReposList);
    }
    else {
        alert("Datos incompletos. Por favor llene todos los campos")
    }
    
})

