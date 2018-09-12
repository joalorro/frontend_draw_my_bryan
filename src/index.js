const body = document.querySelector('body')
const enterBtn = document.querySelector('#enter')

enterBtn.addEventListener('click', () => {
    const canvas = document.querySelector('#myCanvas')
    
    let ws
    enterBtn.classList.add('hidden')
    body.append(createSidebar())
    loadCanvas()

    let circleWebSocket = openConnection()
    circleWebSocket.onopen = event => {
        const subscribeMsg = {"command":"subscribe","identifier":"{\"channel\":\"CirclesChannel\"}"}
        circleWebSocket.send(JSON.stringify(subscribeMsg))
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

function loadCanvas() {
    const canvas = document.querySelector('#myCanvas')
    const brushWidth = document.querySelector('#brush-width')
    canvas.classList.remove('hidden')

    var color_form = document.getElementById("color-form")
    // let context = canvas.getContext('2d')
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
            "command":"message",
            "identifier":"{\"channel\":\"CirclesChannel\"}",
            "data":`{\"action\": \"send_circle\",\"x\": \"${event.point.x}\",\"y\": \"${event.point.y}\",\"strokeColor\": \"${color}\",\"strokeWidth\": \"${strokeWidth}\"}`
        }
        console.log(msg)
        circleWebSocket.send(JSON.stringify(msg))
    }

    tool.maxDistance = 10

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

    tool.onMouseUp = function () {
        path = null
    }

    liveCircleSocket(circleWebSocket)

    function liveCircleSocket(circleWebSocket) {
        circleWebSocket.onmessage = event => {
        console.log(event.data);

        }
    }//end liveCircleSocket function

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
    function openConnection() {
        return new WebSocket('ws://localhost:3000/cable')
    }
    }
})
