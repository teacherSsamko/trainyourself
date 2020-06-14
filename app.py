from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from pymongo import MongoClient


app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# client = MongoClient('localhost', 27017)  # mongoDB는 27017 포트로 돌아갑니다.
client = MongoClient('mongodb://ssamko:dmstjq@34.64.213.249', 27017)
db = client.DBdev 
# db = client.spots

@app.route('/')
def home():
   return 'This is Home!'

@app.route('/spots/new', methods=['POST'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def newSpotAPI():
    location_receive = request.form['location_give']
    pullUp_receive = request.form['pullUp_give']
    parallel_receive = request.form['parallel_give']
    etc_receive = request.form['etc_give']

    spot = {
        'location': location_receive,
        'pullUp': pullUp_receive,
        'parallel': parallel_receive,
        'etc': etc_receive
    }
    
    print(spot)

    db.trainyourself.insert_one(spot)
    
    return jsonify({'result': 'success', 'msg':'등록되었습니다.'})

if __name__ == '__main__':  
   app.run('0.0.0.0', port=5000, debug=True)