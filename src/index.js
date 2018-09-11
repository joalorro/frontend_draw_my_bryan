document.addEventListener('DOMContentLoaded', () => {

    // var ws = new WebSocket('ws://localhost:3000');
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
            path.add(event.point);
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
