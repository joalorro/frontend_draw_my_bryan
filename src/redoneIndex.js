const contentDiv = document.querySelector("#content-div")
const loginForm = document.querySelector('#login-form')
const enterBtn = document.querySelector("#enter")

let currentUser
let pathWebSocket
let msgWebSocket

loginForm.addEventListener("submit", e => {
    e.preventDefault()
    currentUser = document.querySelector('#login-input').value 
    loginForm.remove()
    enterBtn.classList.remove("hidden")
})

enterBtn.addEventListener("click", () => {
    contentDiv.remove()
    document.querySelector("#paintroom").style.display = "grid"
    connectSockets()
})

function openConnection() {
    return new WebSocket("ws://localhost:3000/cable")
}

function connectSockets() {
    pathWebSocket = openConnection()
    pathWebSocket.onopen = e => {
        const subscribePaths = { 
            "command": "subscribe", "identifier": "{\"channel\":\"PathsChannel\"}" 
        }
        pathWebSocket.send(JSON.stringify(subscribePaths))
    }

    msgWebSocket = openConnection()
    msgWebSocket.onopen = e => {
        const subscribeMsg = { 
            "command": "subscribe", "identifier": "{\"channel\":\"MessagesChannel\"}" 
        }
        msgWebSocket.send(JSON.stringify(subscribeMsg))
    }

    userWebSocket = openConnection()
    userWebSocket.onopen = e => {
        const subscribeUser = {
            "command": "subscribe", "identifier": "{\"channel\":\"UsersChannel\"}" 
        }
        userWebSocket.send(JSON.stringify(subscribeUser))
    }
}
