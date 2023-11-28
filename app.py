from flask import Flask, render_template, send_from_directory
from api.pipeline import api

app = Flask(__name__, static_folder='user_interface')
app.register_blueprint(api)

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:filename>')
def serve_file(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    app.run(debug=True)
