document.addEventListener('DOMContentLoaded', async (event) => {
    const joystick = document.getElementById('joystick');
    const stick = document.getElementById('stick');
    let dragging = false;

    let socket = new WebSocket("ws://192.168.1.21:80");

    socket.addEventListener("open", (event) => {
        socket.send("Hello Server!");
    });

    stick.addEventListener('touchstart', async (e) => {
        dragging = true;
        console.log(dragging)
    });

    document.addEventListener('touchend', (e) => {
        dragging = false;
        stick.style.top = '75px';
        stick.style.left = '75px';
        console.log(dragging)
    });

document.addEventListener('touchmove', async (e) => {
        if (dragging && socket.readyState == 1) {
            const rect = joystick.getBoundingClientRect();
            var touch = e.touches[0]; // Get the first touch point
            var x = touch.clientX - rect.left - 25;
            var y = touch.clientY- rect.top - 25;
    
            x = Math.max(0, Math.min(x, 150));
            y = Math.max(0, Math.min(y, 150));
    
            stick.style.top = `${y}px`;
            stick.style.left = `${x}px`;


            socket.send([x, y]); 
        } 
    });
});


/*<script>        
    var socket = io.connect("http://192.168.1.21:80", {reconnection: false, timeout: 20000});

    console.log("YO");
    console.log(socket);

    socket.on('connect', () => {
        console.log('YOOOO???????');
    });

    socket.on('disconnect', function(reason) {
        console.log('Disconnected from server:', reason);
    });

    socket.on("connect_error", (err) => {
        // the reason of the error, for example "xhr poll error"
        console.log(err.message);
        // some additional description, for example the status code of the initial HTTP response
        console.log(err.description);
        // some additional context, for example the XMLHttpRequest object
        console.log(err.context);
    });
</script>



    <script>        
        const socket = new WebSocket("ws://192.168.1.21:80");

        socket.addEventListener("open", (event) => {
            socket.send("Hello Server!");
        });

        // Listen for messages
        socket.addEventListener("message", (event) => {
            console.log("Message from server ", event.data);
        });
    </script>
*/