from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from pymongo import MongoClient


app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# client = MongoClient('localhost', 27017)  # mongoDB는 27017 포트로 돌아갑니다.
client = MongoClient('mongodb://ssamko:dmstjq@34.64.213.249', 27017,
                     connect=False)
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
    address_dong = request.form['address_dong']
    address_street = request.form['address_street']
    reg_date = datetime.now()

    spot = {
        'lat': lat_receive,
        'lon': lon_receive,
        'pullUp': pullUp_receive,
        'parallel': parallel_receive,
        'etc': etc_receive,
        'valid_count': 1,
        'delete_count': 0,
        'status': 'pending',
        'address_dong': address_dong,
        'address_street': address_street,
        'reg_date': reg_date
    }

    print(spot)

    db.trainyourself.insert_one(spot)

    return jsonify({'result': 'success', 'msg': '등록되었습니다.'})


# 동이 없는 데이터들 찾아서 동 입력
# doesn't work
@app.route('/get_dong', methods=['GET'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def get_dong_addr():
    no_dong = list(db.trainyourself.find({'address_dong': ''}, {'_id': 0}))


@app.route('/spots', methods=['GET'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def findSpotAPI():
    spots = list(db.trainyourself.find({}, {'_id': 0}))

    return jsonify({'result': 'success', 'spots': spots})


@app.errorhandler(404)
def page_not_found(error):
    return 'This route does not exist {}'.format(request.url), 404


if __name__ == '__main__':
    # app.run('0.0.0.0', port=5000, debug=True)
    app.run()
