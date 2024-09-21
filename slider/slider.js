document.addEventListener('DOMContentLoaded', async (event) => {
    const slider = document.getElementById('slider');
    let dragging = false;

    let socket = new WebSocket("ws://192.168.1.21:80/update_servo");

    socket.addEventListener("open", (event) => {
        socket.send("Hello Server! 2");
    });

    slider.addEventListener('touchstart', async (e) => {
        dragging = true;
    });

    document.addEventListener('touchend', (e) => {
        dragging = false;
    });

    document.addEventListener('touchmove', async (e) => {
        if (dragging && socket.readyState == 1) {
            socket.send(slider.value); 
        } 
    });
});

