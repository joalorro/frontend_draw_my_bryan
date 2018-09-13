const loginDiv = document.querySelector('#login-layout')
const body = document.querySelector('body')
const enterBtn = document.querySelector('#enter')
const paintRoom = document.querySelector('#paintroom')
const clearBtn = document.querySelector('#clear-btn')

let ctx
let canvas
let circleWebSocket
let userWebSocket

enterBtn.addEventListener('click', () => {    
    canvas = document.querySelector('#myCanvas')
    ctx = canvas.getContext('2d')


    loginDiv.remove()
    loadPaintRoom()
    set_current_user()

    circleWebSocket = openConnection()
    circleWebSocket.onopen = event => {
        const subscribeMsg = {"command":"subscribe","identifier":"{\"channel\":\"CirclesChannel\"}"}
        circleWebSocket.send(JSON.stringify(subscribeMsg))
    }

    userWebSocket = openConnection()
    userWebSocket.onopen = e => {
        const subscribeUser = { "command": "subscribe", "identifier": "{\"channel\":\"UsersChannel\"}" }
        userWebSocket.send(JSON.stringify(subscribeUser))
    }

    const brushWidth = document.querySelector('#brush-width')
    var color_form = document.getElementById("color-form")
    const palette = document.querySelector('#palette')
    const eraser = document.querySelector('#eraser')
    const brush_size_slider = document.getElementById("brush-size-slider")

    paper.install(window);
    paper.setup(canvas);
    // Create a simple drawing tool:
    var tool = new Tool();
    let path = new Path();
    let color = "black";
    let strokeWidth = 1
    path.strokeColor = color

    // Define a mousedown and mousedrag handler


    tool.onMouseDown = function (event) {
        path = new Path();
        path.strokeColor = color
        path.strokeWidth = strokeWidth

        const msg = {
            "command": "message",
            "identifier": "{\"channel\":\"CirclesChannel\"}",
            "data": `{\"action\": \"send_circle\",\"x\": \"${event.point.x}\",\"y\": \"${event.point.y}\",\"strokeColor\": \"${color}\",\"strokeWidth\": \"${strokeWidth}\"}`
        }
        // console.log(msg)
        circleWebSocket.send(JSON.stringify(msg))
    }

        tool.maxDistance = 1

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
                \"strokeWidth\": \"${strokeWidth}\"
                }`
            }
            circleWebSocket.send(JSON.stringify(msg))
        }//end mouseDrag

    tool.maxDistance = 10

    tool.onMouseDrag = function (event) {
        var circle = new Path.Circle({
            center: event.middlePoint,
            radius: strokeWidth
        });
        circle.fillColor = color;

        const msg = {
            "command": "message",
            "identifier": "{\"channel\":\"CirclesChannel\"}",
            "data": `{
                \"action\": \"send_circle\",
                \"x\": \"${event.point.x}\",
                \"y\": \"${event.point.y}\",
                \"strokeColor\": \"${color}\",
                \"strokeWidth\": \"${strokeWidth}\"
            }`
        }
        circleWebSocket.send(JSON.stringify(msg))
    }//end mouseDrag

    function liveCircleSocket(circleWebSocket) {
        circleWebSocket.onmessage = event => {
            let result = JSON.parse(event.data)
            console.log(result['message'])
            if (result['message']['x']) {
                var circle = new Path.Circle(new Point(parseInt(result['message']['x']), parseInt(result['message']['y'])), result['message']['strokeWidth'])
                circle.fillColor = result['message']['strokeColor'];
            }
        }
    }

    palette.addEventListener('click', (e) => {
        if (e.target.className === "color") {
            color = e.target.id
            path.strokeColor = color
        }
    })

    eraser.addEventListener('click', () => {
        strokeWidth = 5;
        color = "white";
        brushWidth.innerText = strokeWidth
    })

    brush_size_slider.addEventListener('input', () => {
        strokeWidth = brush_size_slider.value
        brushWidth.innerText = `Brush size ${strokeWidth}:`
    })

    liveCircleSocket(circleWebSocket)

    clearBtn.addEventListener('click', clearCanvas)
})

function loadPaintRoom() {
    paintRoom.classList.remove('hidden')
}

function openConnection() {
    return new WebSocket('ws://localhost:3000/cable')
}

function set_current_user() {

}

function clearCanvas () {
    project.activeLayer.removeChildren()
}
