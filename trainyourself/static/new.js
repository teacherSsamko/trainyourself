var uni_marker;
var map;
// 현재 위치 가져오기
// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
if (navigator.geolocation) {

    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function (position) {

        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도

        var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            message = '<div style="padding:5px;">위치등록 <br></div>'; // 인포윈도우에 표시될 내용입니다

        // 마커와 인포윈도우를 표시합니다
        // displayMarker(locPosition, message);
        console.log("현재위치", lat, lon)
        
        console.log("map will setup")
        var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = {
            center: locPosition, // 지도의 중심좌표
            draggable: false, // 지도 이동 제한
            level: 1 // 지도의 확대 레벨
        };

        map = new kakao.maps.Map(mapContainer, mapOption);
        console.log("marker will setup")
        displayMarker(locPosition, message, map);

    });

} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    console.log('geolocation unavailable')

    var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
        message = 'geolocation을 사용할수 없어요..'
    
    console.log("map will setup")
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = {
            center: locPosition, // 지도의 중심좌표
            draggable: false, // 지도 이동 제한
            level: 1 // 지도의 확대 레벨
        };

    map = new kakao.maps.Map(mapContainer, mapOption);
    console.log("marker will setup")
    displayMarker(locPosition, message, map);

}




// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayMarker(locPosition, message, map) {

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: locPosition
    });
    marker.setDraggable(true);

    var iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

    // 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable
    });

    // 인포윈도우를 마커위에 표시합니다 
    infowindow.open(map, marker);
    marker.setMap(map);

    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);
    uni_marker = marker;
}

// function displayMap(locPosition) {
//     var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
//         mapOption = {
//             center: locPosition, // 지도의 중심좌표
//             draggable: false, // 지도 이동 제한
//             level: 1 // 지도의 확대 레벨
//         };

//     var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// }





var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png', // 마커이미지의 주소입니다    
    imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
    imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

// 마커를 표시할 위치와 title 객체 배열입니다 
var positions = [];

// 마커 이미지의 이미지 주소입니다
var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    

function newSpot() {
    let marker_lat = uni_marker.getPosition().getLat(),
        marker_lon = uni_marker.getPosition().getLng();
    console.log("current marker pos", marker_lat, marker_lon)
    // call api

    // let location = `${marker_lat}, ${marker_lon}`
    let lat = `${marker_lat}`
    let lon = `${marker_lon}`
    // let pullUp = $('#pullUp').val();
    let pullUp = $('input:checkbox[id="pullUp"]').is(":checked")
    // let parallel = $('#parallel').val();
    let parallel = $('input:checkbox[id="parallel"]').is(":checked")
    let etc = $('#etc').val();


    if (pullUp == false & parallel == false) {
        alert('기구를 선택하세요');
        return;
    }

    // 3. POST /spots/new 에 저장을 요청합니다.
    $.ajax({
        type: "POST",
        url: "http://34.64.213.249:5000/spots/new",
        data: { lat_give: lat, lon_give: lon, pullUp_give: pullUp, parallel_give: parallel, etc_give: etc },
        // xhrFields: {
        //     withCredentials: true
        // },
        // crossDomain: true,
        // contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response['result'] == 'success') {
                alert(response['msg']);
                window.location.reload();
            }
        }
    })
}
$(document).ready(function () {
    $('#spots_list').html('')
    listing()
})

function listing() {
    console.log('listing start')
    $.ajax({
        tytpe: "GET",
        url: "http://34.64.213.249:5000/spots",
        data: {},
        success: function (response) {
            if (response['result'] == 'success') {
                let spots = response['spots']
                for (let i = 0; i < spots.length; i++) {
                    var tmp = `${spots[i]['lat']} ${spots[i]['lon']}`
                    var title = ''
                    if (spots[i]['pullUp'] == 'true') {
                        title += '철봉 '
                    }
                    if (spots[i]['parallel'] == 'true') {
                        title += '평행봉'
                    }
                    tmp += title + '<br>'
                    $('#spots_list').prepend(tmp)
                    positions.push({
                        title: `${title}`,
                        latlng: new kakao.maps.LatLng(spots[i]['lat'], spots[i]['lon'])
                    })
                }
                marker_display()

            }
        }
    })
    console.log('listing finish')
}

function marker_display() {
    // marker set을 표시하는 코드
    console.log('marker_display start')
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
            image: markerImage // 마커 이미지 
        });

        var iwContent = positions[i].title, // 인포윈도우에 표시할 내용
            iwRemoveable = true;

        // 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: iwContent,
            removable: iwRemoveable
        });

        // 인포윈도우를 마커위에 표시합니다 
        infowindow.open(map, marker);
        console.log(`${i}번째 marker display`)
        marker.setMap(map);
    }
    console.log('marker_display finished')

    // 마커가 지도 위에 표시되도록 설정합니다
}
