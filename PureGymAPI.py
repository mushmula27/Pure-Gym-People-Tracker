from flask import Flask, jsonify
import csv

app = Flask(__name__)

@app.route('/hello/<name>')
def something(name):
    return 'Hello {}!'.format(name)

@app.route('/hello')
def HelloWorld():
    return 'Hello World!'

@app.route('/data')
def CallData():
    with open('puregym_activity_data.csv') as data:
        csvdata = csv.DictReader(data)
        datalist = list(csvdata)
    return jsonify(datalist)
