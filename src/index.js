document.addEventListener('DOMContentLoaded', () => {

    let ws = new WebSocket('ws://localhost:3000/cable')
    ws.onopen = event => {
        const subscribeMsg = {"command":"subscribed","identifier":"{\"channel\":\"ChatChannel\"}"}
        ws.send(JSON.stringify(subscribeMsg))
    }




    // // event emmited when connected
    // ws.onopen = function () {
    //     console.log('websocket is connected ...')
    //     // sending a send event to websocket server
    //     ws.send('connected')
    // }
    // // event emmited when receiving message
    // ws.onmessage = function (ev) {
    //     console.log(ev);
    // }
    var color_form = document.getElementById("color-form")
    let canvas = document.getElementById("myCanvas")
    // let context = canvas.getContext('2d')
    const palette = document.querySelector('#palette')
    const brushWidth = document.querySelector('#brush-width')
    const eraser = document.querySelector('#eraser')
    let eraseOn = false


    paper.install(window);
    window.onload = function () {
        paper.setup(canvas);
        // Create a simple drawing tool:
        var tool = new Tool();
        let path = new Path();
        let color = black;
        let strokeWidth = 1
        path.strokeColor = color
        brushWidth.innerText = `Change brush size ${path.strokeWidth}:`

        // Define a mousedown and mousedrag handler

        tool.onMouseDown = function (event) {
            path = new Path();
            path.strokeColor = color
            path.strokeWidth = strokeWidth

            path.add(event.point);
            // let circleDraw = Path.Circle(event.point.x, event.point.y, 5)
            console.log(path)
        }

        tool.onMouseDrag = function (event) {
            var circle = new Path.Circle({
                center: event.middlePoint,
                radius: strokeWidth
            });
            circle.fillColor = color;
            console.log(path);

            fetch('http://localhost:3000/circles', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    circle: {
                        x: event.point.x,
                        y: event.point.y,
                        strokeWidth: strokeWidth,
                        strokeColor: color
                    }
                })
            })//end fetch post
        }

        tool.onMouseUp = function () {
            path = null
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
            eraserOn = true
            brushWidth.innerText = strokeWidth
        })

        let brush_size_slider = document.getElementById("brush-size-slider")
        brush_size_slider.addEventListener('input', () => {
            strokeWidth = brush_size_slider.value
            brushWidth.innerText = `Change brush size ${strokeWidth}:`
        })

    }
})
