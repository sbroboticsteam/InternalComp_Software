from microdot import Microdot
from microdot.websocket import with_websocket
from microdot.cors import CORS
import asyncio 
import network
import secrets
import time

# Connect to Wi-Fi
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(secrets.SSID, secrets.PASSWORD)
time.sleep(5)

# Wait for connection
max_attempts = 10
attempt = 0

while not wlan.isconnected() and attempt < max_attempts:
    print(f"Trying to connect to {secrets.SSID} (Attempt {attempt + 1}/{max_attempts})...")
    time.sleep(10)
    attempt += 1

if wlan.isconnected():
    print("Connected to IP:", wlan.ifconfig()[0])
else:
    print("Failed to connect to Wi-Fi. Please check your SSID and password.")


app = Microdot()
CORS(app, allowed_origins = '*', allow_credentials = True)

@app.get('/')
@with_websocket
async def index(request, ws):
    try: 
        while True:
            data = await ws.receive()
            if not data:
                break
            print(data)
            await ws.send('hello world')
            
    except OSError as msg:
        print(msg)

@app.get('/update_servo')
@with_websocket
async def index(request, ws):
    while True:
        data = await ws.receive()
        if not data:
            break
        print(data)
        await ws.send('good bye')


app.run(port=80)
