from quart import Quart
from quart_cors import cors

app = Quart(__name__)
CORS = cors(app)

@app.get('/')
async def hello():
    return {"status": "ok"}

if __name__ == '__main__':
    app.run()