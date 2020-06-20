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
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def newSpotAPI():
    lat_receive = request.form['lat_give']
    lon_receive = request.form['lon_give']
    pullUp_receive = request.form['pullUp_give']
    parallel_receive = request.form['parallel_give']
    etc_receive = request.form['etc_give']

    spot = {
        'lat': lat_receive,
        'lon': lon_receive,
        'pullUp': pullUp_receive,
        'parallel': parallel_receive,
        'etc': etc_receive,
        'valid_count': 1,
        'delete_count': 0,
        'status': 'pending'
    }

    print(spot)

    db.trainyourself.insert_one(spot)

    return jsonify({'result': 'success', 'msg': '등록되었습니다.'})


@app.route('/spots', methods=['GET'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def findSpotAPI():
    spots = list(db.trainyourself.find({}, {'_id': 0}))

    return jsonify({'result': 'success', 'spots': spots})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
