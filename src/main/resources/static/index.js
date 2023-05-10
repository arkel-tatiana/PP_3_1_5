const userButton = document.querySelector('.button-user');
const adminButton = document.querySelector('.button-admin');
const titleUser = document.querySelector('.title-user');
const allButton = document.querySelector('.button-all');
const addButton = document.querySelector('.button-add');
const allPanel = document.querySelector('.panel-all');
const addPanel = document.querySelector('.panel-add');
const editForm = document.querySelector('.form-edit');
const deleteForm = document.querySelector('.form-delete');
const addForm = document.querySelector('.form-add');
let deleteUser;
let editUser;


// класс Api для запросов к базе данных
class Api {
    constructor(options) {
        this._baseUrl = options.baseUrl;
        this._headers = options.headers
    }

    getAllUsers() {
        return fetch(this._baseUrl + '/', {
            headers: this._headers
        })
            .then(this._getResponseData)
    }

    addUser(dataValue) {
        return fetch(this._baseUrl + '/user', {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                firstName: dataValue.firstName,
                lastName: dataValue.lastName,
                age: dataValue.age,
                password: dataValue.password,
                roles: dataValue.roles,
                username: dataValue.username
            })
        })
            .then(this._getResponseData)
    };

    deletedUser(idUser) {
        return fetch(this._baseUrl + '/user/' + idUser, {
            method: 'DELETE',
            headers: this._headers
        })
            .then((res)=>{
                if (!res.ok) {
                    return Promise.reject(`Ошибка: ${res.status}`);
                }
            })
    };

    getUserAuth() {
        return fetch(this._baseUrl + '/auth', {
            headers: this._headers
        })
            .then(this._getResponseData)
    }

    editUserData(formData) {
        console.log(formData)
        return fetch(this._baseUrl + '/user/', {
            method: 'PUT',
            headers: this._headers,
            body: JSON.stringify({
                id: formData.id,
                firstName: formData.firstName,
                lastName: formData.lastName,
                age: formData.age,
                password: formData.password,
                roles: formData.roles,
                username: formData.username
            })
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

// обработки данных по юзеру
class UserTab {
    constructor({data, userSelector, handleDeleteClick, handleEditClick}) {
        this._username = data.username;
        this._id = data.id;
        this._firstName = data.firstName;
        this._lastName = data.lastName;
        this._age = data.age;
        this._password = data.password;
        this._roles = data.roles;
        this._userSelector = userSelector;
        this._handleDeleteClick = handleDeleteClick.bind(this);
        this._handleEditClick = handleEditClick.bind(this);
    }
    _getTemplate() {
        let userElements;
        userElements = document
            .querySelector(this._userSelector)
            .content
            .querySelector('.user__item')
            .cloneNode(true);
        return userElements;
    }
    generateUser() {
        this._element = this._getTemplate();
        this._element.querySelector('.user__id').textContent = this._id;
        this._element.querySelector('.user__firstName').textContent = this._firstName;
        this._element.querySelector('.user__lastName').textContent = this._lastName;
        this._element.querySelector('.user__age').textContent = this._age;
        this._element.querySelector('.user__userName').textContent = this._username;
        this._element.querySelector('.user__role').textContent = this._getRolesUser(this._roles);
        this._setEventListeners();
        return this._element;
    }
    showEditUser(value) {
        this._element.querySelector('.user__id').textContent = value.id;
        this._element.querySelector('.user__firstName').textContent = value.firstName;
        this._element.querySelector('.user__lastName').textContent = value.lastName;
        this._element.querySelector('.user__age').textContent = value.age;
        this._element.querySelector('.user__userName').textContent = value.username;
        this._element.querySelector('.user__role').textContent = this._getRolesUser(value.roles);
    }
    _getRolesUser(roleUser) {
        let textRole="";
        if (roleUser.some(role => role.id === 1)) {
            textRole = textRole + "ADMIN "
        }
        if (roleUser.some(role => role.id === 2)) {
            textRole = textRole + "USER "
        }
        return textRole
    }
    deleteUser(){
        this._element.remove();
    }
    _setEventListeners(){
        this._element.querySelector('.button-edit').addEventListener('click', () => {
            this._handleEditClick(this);
        });
        this._element.querySelector('.button-delete').addEventListener('click', () => {
            this._handleDeleteClick(this)
        });
    }
}

// класс контейнер для юзеров
class TableUsers {
    constructor({renderer, containerSelector}) {
        this._renderer = renderer;
        this._container = document.querySelector(containerSelector);
    }
    addItem (element) {
        this._container.append(element);
    };
    renderItems(renderedItems) {
         renderedItems.forEach(item => {
            this._renderer(item);
        });
    }
}



const api = new Api({
    baseUrl: 'http://localhost:8080/admin/rest',
    headers: {
        'Content-Type': 'application/json'
    }
});

allButton.addEventListener('click', function() {
    allPanel.setAttribute("style","display: block");
    addPanel.setAttribute("style","display: none");
    allButton.classList.add('active', 'bg-white', 'text-primary');
    addButton.classList.remove('active', 'bg-white', 'text-primary');
});
addButton.addEventListener('click', function() {
    addPanel.setAttribute("style","display: block");
    allPanel.setAttribute("style","display: none");
    addButton.classList.add('active', 'bg-white', 'text-primary');
    allButton.classList.remove('active', 'bg-white', 'text-primary');
});
addForm.addEventListener('submit', handlerSubmitFormAdd);
function handlerSubmitFormAdd (evt) {
    evt.preventDefault();
    let dataValue = getValueField(addForm)
     api.addUser(dataValue)
        .then((value)=>{
            let errors = value.bd;
            errors.forEach((error) => {
                if (error.field == "firstName") {
                    document.querySelector('.error-firstname').setAttribute("style", "color:red; font-size: 12px; display: block");
                    document.querySelector('.error-firstname').textContent = error.defaultMessage;
                }
                if (error.field == "lastName") {
                    document.querySelector('.error-lastname').setAttribute("style", "color:red; font-size: 12px; display: block");
                    document.querySelector('.error-lastname').textContent = error.defaultMessage;
                }
                if (error.field == "username") {
                    document.querySelector('.error-username').setAttribute("style", "color:red; font-size: 12px; display: block");
                    document.querySelector('.error-username').textContent = error.defaultMessage;
                }
                if (error.field == "age") {
                    document.querySelector('.error-age').setAttribute("style", "color:red; font-size: 12px; display: block");
                    document.querySelector('.error-age').textContent = error.defaultMessage;
                }
                if (error.field == "password") {
                    document.querySelector('.error-password').setAttribute("style", "color:red; font-size: 12px; display: block");
                    document.querySelector('.error-password').textContent = error.defaultMessage;
                }
                if (error.field == "roles") {
                    document.querySelector('.error-roles').setAttribute("style", "color:red; font-size: 12px; display: block");
                    document.querySelector('.error-roles').textContent = error.defaultMessage;
                }
            });
            if (errors.length === 0) {
                addForm.reset();
                const errorElements = addPanel.querySelectorAll('.errors')
                errorElements.forEach((errorElement) => errorElement.setAttribute("style", "color:red; font-size: 12px; display: none"));
                tableUsers.addItem(createUser(value.user));
            }
        })
        .catch((err)=>{
            console.log(`ошибка ${err}`);
        })
}

editForm.addEventListener('submit', handlerSubmitFormEdit);
function handlerSubmitFormEdit (evt) {
    evt.preventDefault();
    let dataValue = getValueField(editForm)
    console.log(dataValue)
    api.editUserData(dataValue)
        .then((value)=>{
            console.log(value)
            console.log(editUser);
            editUser.showEditUser(value);
        })
        .catch((err)=>{
            console.log(`ошибка ${err}`);
        })
}

deleteForm.addEventListener('submit', handlerSubmitFormDelete);
function handlerSubmitFormDelete (evt) {
    evt.preventDefault();
    api.deletedUser(deleteForm.querySelector('.user__id').value)
    .then(()=>{
            console.log(deleteUser);
            deleteUser.deleteUser()
    })
    .catch((err)=>{
          console.log(`ошибка ${err}`);
    })
}

const tableUsers = new TableUsers({
    renderer: (item) => {
        tableUsers.addItem(createUser(item));
    },
    containerSelector: '.users__container'
});

Promise.all([api.getUserAuth(), api.getAllUsers()])
    .then((value)=>{
        let textAllRoles=getCurrentUser(value[0]["principal"].roles);
        titleUser.textContent = value[0]["principal"].username + " with roles: " + textAllRoles;
        if (textAllRoles.includes("ADMIN")) {
            adminButton.setAttribute("style","display: block");
        }
        if (textAllRoles.includes("USER")) {
            userButton.setAttribute("style","display: block");
        }
        tableUsers.renderItems(value[1]);
    })
    .catch((err)=>{
        console.log(`ошибка ${err}`);
    })

function getCurrentUser(roleUser) {
    let textRole="";
    if (roleUser.some(role => role.name === "ROLE_ADMIN")) {
        textRole = textRole + "ADMIN "
    }
    if (roleUser.some(role => role.name === "ROLE_USER")) {
        textRole = textRole + "USER "
    }
    return textRole
}

function getValueField(selectorForms) {
    let fff = Array.from(selectorForms.querySelector('.user__roles').selectedOptions)
    let arrayRole = [];
    if (fff.some(role => role.className === "user__roles-admin")) {
        arrayRole.push({id:1})
    }
    if (fff.some(role => role.className === "user__roles-user")) {
        arrayRole.push({id:2})
    }
    const dataValue = {
        firstName: selectorForms.querySelector('.user__firstname').value,
        lastName: selectorForms.querySelector('.user__lastname').value,
        age: selectorForms.querySelector('.user__age').value,
        username: selectorForms.querySelector('.user__username').value,
        roles: arrayRole,
        password: selectorForms.querySelector('.user__password').value,
    };
    if (selectorForms == editForm) {
        dataValue.id = selectorForms.querySelector('.user__id').value;
    }
    return dataValue
}

function addValueField(user, selectorForm) {
    selectorForm.querySelector('.user__id').value = user._id;
    selectorForm.querySelector('.user__firstname').value = user._firstName;
    selectorForm.querySelector('.user__lastname').value = user._lastName;
    selectorForm.querySelector('.user__age').value = user._age;
    selectorForm.querySelector('.user__password').value = user._password;
    selectorForm.querySelector('.user__username').value = user._username;
    selectorForm.querySelector('.user__roles-admin').removeAttribute('selected');
    selectorForm.querySelector('.user__roles-user').removeAttribute('selected');
    if (user._roles.some(role => role.name === "ROLE_ADMIN")) {
        console.log("adm")
        selectorForm.querySelector('.user__roles-admin').setAttribute('selected', true);
    }
    if (user._roles.some(role => role.name === "ROLE_USER")) {
        console.log("usr")
        selectorForm.querySelector('.user__roles-user').setAttribute('selected', true);
    }
}
function createUser(item) {
    const userTab = new UserTab({
        data: item,
        userSelector: '#users-template',
        handleEditClick: (userThis) => {
            console.log("нажата кнопка EDIT  " + userThis)
            editUser = userThis;
            console.log(userThis)
            console.log(userThis._roles);
            addValueField(userThis, editForm)
         },
        handleDeleteClick: (userThis) => {
            deleteUser=userThis;
            addValueField(userThis, deleteForm);
        }
    });
    let userElement;
    userElement = userTab.generateUser();
    return userElement;
}
