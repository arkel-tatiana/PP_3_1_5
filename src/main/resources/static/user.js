const userButton = document.querySelector('.button-user');
const adminButton = document.querySelector('.button-admin');
const titleUser = document.querySelector('.title-user')
const userContainer = document.querySelector('.user__container')

class Api {
    constructor(options) {
        this._baseUrl = options.baseUrl;
        this._headers = options.headers
    }

    getUserAuth() {
        return fetch(this._baseUrl + '/auth', {
            headers: this._headers
        })
            .then(this._getResponseData)
    }

    _getResponseData(res) {
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json();
    }
}

const api = new Api({
    baseUrl: 'http://localhost:8080/user/rest',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.getUserAuth()
    .then((value)=>{
        let textAllRoles = getRolesToString(value["principal"].roles)
        userContainer.querySelector('.user__id').textContent = value["principal"].id;
        userContainer.querySelector('.user__firstName').textContent = value["principal"].firstName;
        userContainer.querySelector('.user__lastName').textContent = value["principal"].lastName;
        userContainer.querySelector('.user__age').textContent = value["principal"].age;
        userContainer.querySelector('.user__username').textContent = value["principal"].username;
        userContainer.querySelector('.user__role').textContent = textAllRoles;
        titleUser.textContent = value["principal"].username + " with roles: " + textAllRoles;
        if (textAllRoles.includes("ADMIN")) {
            adminButton.setAttribute("style","display: block");
        }
        if (textAllRoles.includes("USER")) {
           userButton.setAttribute("style","display: block");
        }
    })
    .catch((err)=>{
        console.log(`ошибка ${err}`);
    })
function getRolesToString(rolesUser) {
    console.log(rolesUser);
    let textRole="";
    if (rolesUser.some(role => role.name === "ROLE_ADMIN")) {
         textRole = textRole + "ADMIN "
    }
    if (rolesUser.some(role => role.name === "ROLE_USER")) {
        textRole = textRole + "USER "
    }
    return textRole
}
