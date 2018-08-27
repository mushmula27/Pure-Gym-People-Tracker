# API script

# import Flaks which is the package allowing to create the API
# jsonify is a package allowing to convert python objects into
# json format (js object)
from flask import Flask, jsonify
# dotenv is package allowing to create a temporary os environment variable
# with the location of the data
from dotenv import load_dotenv
load_dotenv()
import os # os is default python package giving access to os commands
import csv
# reach into os and pull out env variable set in .env
PUREGYM_DATA_LOCATION = os.getenv("PUREGYM_DATA_CSV_LOCATION")

app = Flask(__name__) # make new flask instance

# this calls the function to run when /hello/name is requested
# <name> is dynamic and can be user-specified, eg /hello/bob
# <name> gets passed to var name
@app.route('/hello/<name>')
def something(name):
    return 'Hello {}!'.format(name)

@app.route('/hello')
def HelloWorld():
    return 'Hello World!'

@app.route('/data')
def CallData():
    # opens the file in .env and assigns it to data
    with open(PUREGYM_DATA_LOCATION) as data:
        # reading data as csv into python dictionary
        # dictionary in python is an object (format key: value)
        csvdata = csv.DictReader(data)
        datalist = list(csvdata) # make into list (puts it into memory)
    return jsonify(datalist) # make into json
