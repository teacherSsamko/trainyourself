// find spot JS
var uni_marker;
var map;
var currentPosition;

// 현재 위치 가져오기
// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
if (navigator.geolocation) {
    console.log('geolocation works')
        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {

        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도

        var locPosition = new kakao.maps.LatLng(lat, lon) // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다 

        // 마커와 인포윈도우를 표시합니다
        // displayMarker(locPosition, message);
        console.log("현재위치", lat, lon)
        var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
            mapOption = {
                center: locPosition, // 지도의 중심좌표
                draggable: true, // 지도 이동 제한
                level: 2 // 지도의 확대 레벨
            };

        var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
        listing(map)



    });


} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    console.log('geolocation unavailable')

    var locPosition = new kakao.maps.LatLng(33.450701, 126.570667)

    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = {
            center: locPosition, // 지도의 중심좌표
            draggable: true, // 지도 이동 제한
            level: 2 // 지도의 확대 레벨
        };

    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
    listing(map)

}


function listing(map) {

    $.ajax({
        tytpe: "GET",
        url: "https://trainyourself.co.kr/api/spots",
        data: {},
        success: function(response) {
            if (response['result'] == 'success') {
                let spots = response['spots']
                for (let i = 0; i < spots.length; i++) {
                    var tmp = `${spots[i]['lat']} ${spots[i]['lon']}`
                    var latlng = new kakao.maps.LatLng(spots[i]['lat'], spots[i]['lon']);


                    var title = ''
                    if (spots[i]['pullUp'] == 'true') {
                        title += '철봉 '
                    }
                    if (spots[i]['parallel'] == 'true') {
                        title += '평행봉'
                    }
                    var etc = spots[i]['etc']
                    title += '<br>' + etc;
                    tmp += title + '<br>'
                    $('#spots_list').prepend(tmp)

                    positions.push({
                            title: `${title}`,
                            latlng: latlng,
                            status: spots[i]['status']
                        })
                        // console.log(spots[i]['status'])
                }
                marker_display(map)

            }
        }
    })
}

function marker_display(map) {
    // marker set을 표시하는 코드
    var markers = []

    for (var i = 0; i < positions.length; i++) {

        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다    
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage, // 마커 이미지 
            clickable: true
        });

        var msg = `<div class='iw'>${positions[i].title}`
            //     // 확인버튼
            // msg += '<br><button type="button" class="btn btn-success">확인</button>'
            //     // 거짓버튼
            // msg += ' <button type="button" class="btn btn-danger">거짓</button>'
        msg += '</div>'

        console.log(`${i} marker added on markers`)

        var iwContent = msg, // 인포윈도우에 표시할 내용
            iwRemoveable = true;

        // 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: iwContent,
            removable: iwRemoveable
        });



        // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow));
        markers.push(marker)
    }

    // 마커가 지도 위에 표시되도록 설정합니다
    console.log(map)
    for (var i = 0; i < markers.length; i++) {

        markers[i].setMap(map);
    }
    console.log('markers set up complete')

}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
function makeOverListener(map, marker, infowindow) {
    return function() {
        infowindow.open(map, marker);
    };
}