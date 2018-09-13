const body = document.querySelector('body')
const enterBtn = document.querySelector('#enter')
let circleWebSocket
let userWebSocket
const login_div = document.getElementById("login-div")
const canvas = document.getElementById("myCanvas")
const login_form = document.getElementById("login-form")
const chat = document.getElementById("chat")
const username_canvas = document.getElementById("username")

login_form.addEventListener('submit', (event) => {
  event.preventDefault()
  let login_input = document.getElementById('login-input')
  let submit = document.getElementById("submit")
  login_input.classList.add('hidden')
  submit.classList.add('hidden')
  let username = login_input.value
  let username_div = document.createElement('div')
  username_div.innerHTML = `welcome ${username}`

  enterBtn.classList.remove('hidden')
  login_div.prepend(username_div)
  username_canvas.innerText = username
})

enterBtn.addEventListener('click', () => {
    const canvas = document.querySelector('#myCanvas')

    enterBtn.parentElement.parentNode.remove()
    body.append(createSidebar())
    loadCanvas()
    set_current_user()

    circleWebSocket = openConnection()
    circleWebSocket.onopen = event => {
        const subscribeMsg = {"command":"subscribe","identifier":"{\"channel\":\"CirclesChannel\"}"}
        circleWebSocket.send(JSON.stringify(subscribeMsg))
    }

    messageWebSocket = openConnection()
    messageWebSocket.onopen = e => {
        const subscribeUser = { "command": "subscribe", "identifier": "{\"channel\":\"MessagesChannel\"}" }
        messageWebSocket.send(JSON.stringify(subscribeUser))
    }

    const brushWidth = document.querySelector('#brush-width')
    var color_form = document.getElementById("color-form")
    // let context = canvas.getContext('2d')
    const palette = document.querySelector('#palette')
    const eraser = document.querySelector('#eraser')
    const brush_size_slider = document.getElementById("brush-size-slider")

    paper.install(window);
    paper.setup(canvas);

    var tool = new Tool();
    let path = new Path();
    let color = "black";
    let strokeWidth = 1
    path.strokeColor = color

    tool.onMouseDown = function (event) {
        path = new Path();
        path.strokeColor = color
        path.strokeWidth = strokeWidth

        const msg = {
            "command": "message",
            "identifier": "{\"channel\":\"CirclesChannel\"}",
            "data": `{\"action\": \"send_circle\",\"x\": \"${event.point.x}\",\"y\": \"${event.point.y}\",\"strokeColor\": \"${color}\",\"strokeWidth\": \"${strokeWidth}\",\"username\": \"${username_canvas.innerText}\"}`
        }
        // console.log(msg)
        circleWebSocket.send(JSON.stringify(msg))

    }
        tool.maxDistance = 2
        tool.onMouseDrag = function (event) {
            var circle = new Path.Circle({
                center: event.middlePoint,
                radius: strokeWidth
            });
            circle.fillColor = color;

            const msg = {
            "command":"message",
            "identifier":"{\"channel\":\"CirclesChannel\"}",
            "data":`{
            \"action\": \"send_circle\",
            \"x\": \"${event.point.x}\",
            \"y\": \"${event.point.y}\",
            \"strokeColor\": \"${color}\",
            \"strokeWidth\": \"${strokeWidth}\",
            \"username\": \"${username_canvas.innerText}\"
            }`
        }
        // console.log(msg)
        circleWebSocket.send(JSON.stringify(msg))
        }//end mouseDrag


      liveCircleSocket(circleWebSocket)

      function liveCircleSocket(circleWebSocket) {
          circleWebSocket.onmessage = event => {
              let result = JSON.parse(event.data)
              if (result['message']['username'] !== username_canvas.innerText){
              if (result['message']['x']) {
                  var circle = new Path.Circle(new Point(parseInt(result['message']['x']), parseInt(result['message']['y'])), result['message']['strokeWidth'])
                  circle.fillColor = result['message']['strokeColor'];
              }
            }
          }//end liveCircleSocket function
      }

    palette.addEventListener('click', (e) => {
        if (e.target.className === "color") {
            color = e.target.id
            path.strokeColor = color
        }
    })

    eraser.addEventListener('click', () => {
        strokeWidth = 10;
        color = "white";
        brushWidth.innerText = strokeWidth
    })

    brush_size_slider.addEventListener('input', () => {
        strokeWidth = brush_size_slider.value
        brushWidth.innerText = `Brush size ${strokeWidth}:`
    })

    const message_form = document.getElementById("new-message-form")
    message_form.addEventListener('submit', (event) => {
      event.preventDefault();
      let chat_input = document.getElementById("chat-input")
      let chat_li = document.createElement("li")
      chat_li.innerText = chat_input.value
      chat.append(chat_li)

      console.log(username_canvas.innerText);
      const msg = {
          "command": "message",
          "identifier": "{\"channel\":\"MessagesChannel\"}",
          "data": `{\"action\": \"send_message\",\"content\": \"${chat_input.value}\",\"username\": \"${username_canvas.innerText}\"}`
      }
      // console.log(msg)
      messageWebSocket.send(JSON.stringify(msg))

      message_form.reset()
    })//end message_form event listener

liveMessageSocket(messageWebSocket)

    function liveMessageSocket(messageWebSocket) {
        messageWebSocket.onmessage = event => {
            let result = JSON.parse(event.data)

          if(result['message']['content']){
            if (result['message']['username'] !== username_canvas.innerText) {
                let message = document.createElement('li')
                message.innerText = result['message']['content']
                chat.append(message)
            }
          }
        }//end liveMessageSocket function
    }


})

function openConnection() {
    return new WebSocket('ws://localhost:3000/cable')
}

function set_current_user() {

}

function loadCanvas() {
  const canvas = document.querySelector('#myCanvas')
  canvas.classList.remove('hidden')
}

function createSidebar() {
    const sidebar = document.createElement('div')
    sidebar.className = "side-bar"
    sidebar.innerHTML = `
    <div id="palette">
        <div class="color" id="red"></div>
        <div class="color" id="orange"></div>
        <div class="color" id="yellow"></div>
        <div class="color" id="green"></div>
        <div class="color" id="blue"></div>
        <div class="color" id="indigo"></div>
        <div class="color" id="violet"></div>
        <div class="color" id="black"></div>
        <button id="eraser">Eraser!</button>
    </div>

    <div class="slidecontainer">
        <p id="brush-width">Brush size 1:</p>
        <input type="range" min="1" max="25" value="1" class="slider" id="brush-size-slider">
    </div>
`
    return sidebar
}
