document.addEventListener('DOMContentLoaded', () => {

  function openConnection() {
    // return new WebSocket("ws://localhost:3000/cable")
    // return new WebSocket("ws://10.39.104.225:3000/cable")
    return new WebSocket(`ws://localhost:3000/cable`)
    //url is from live-server frontend
  }

    let circleWebSocket = openConnection()
    circleWebSocket.onopen = event => {
        const subscribeMsg = {"command":"subscribe","identifier":"{\"channel\":\"CirclesChannel\"}"}
        circleWebSocket.send(JSON.stringify(subscribeMsg))
    }

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
        let color = "black";
        let strokeWidth = 5
        path.strokeColor = color
        brushWidth.innerText = `Change brush size ${path.strokeWidth}:`

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
          // console.log(msg)
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
