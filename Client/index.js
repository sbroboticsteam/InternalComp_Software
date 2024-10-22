document.addEventListener('DOMContentLoaded', async (event) => {
    const joystick = document.getElementsByClassName('joystick')[0];
    const stick = document.getElementsByClassName('stick')[0];
    let radius = 75;
    let dragging = false;
    let animationFrameId = null;

    // Initialize WebSocket connection
    let socket = new WebSocket("ws://[ESP32's IP Address]:[Port #]/[Route]");

    socket.addEventListener("open", () => {
        //initial connection message check
        socket.send("Hello Server!"); 
    });

    const resetStickPosition = () => {
        stick.style.top = '75px';
        stick.style.left = '75px';
    };

    const moveStick = (x, y) => {
        stick.style.top = `${y + radius}px`;
        stick.style.left = `${x + radius}px`;

        // Send coordinates via WebSocket
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ x, y }));
        }
    };

    const handleMovement = (clientX, clientY) => {
        const rect = joystick.getBoundingClientRect();
        let x = clientX - rect.left - 100; // Offset to center (range: -75 to 75)
        let y = clientY - rect.top - 100;

        // Constrain values between -75 and 75
        x = Math.max(-radius, Math.min(x, radius));
        y = Math.max(-radius, Math.min(y, radius));

        let current_radius = Math.sqrt(x*x + y*y); 
        if(current_radius <= radius){
            // Request a frame update to move the stick
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(() => {
                    moveStick(x, y);
                    animationFrameId = null; // Reset after rendering
                });
            }
        }
    };

    // What should the joystick do?
    // 1. Enable dragging of joystick when mousedown/touchdown
    // 2. Disable dragging of joystick when mousedown/touchdown
    // 3. Update joystick position when mousemove/touchmove
});