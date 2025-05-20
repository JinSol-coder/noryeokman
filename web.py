from flask import Flask, render_template, request, redirect, url_for
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/performance')
def performance():
    return render_template('performance.html')

@app.route('/academy')
def academy():
    return render_template('academy.html')

@app.route('/reservation')
def reservation():
    return render_template('reservation.html')

if __name__ == '__main__':
    app.run(debug=True)
