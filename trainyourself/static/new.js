var uni_marker;
var map;
var currentPosition;


// 현재 위치 가져오기
// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
$(document).ready(function() {
    if (navigator.geolocation) {

        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function(position) {

            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도

            var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                message = '<div style="padding:5px;">기구가 있는 위치로 <br>이동시켜주세요 :) <br></div>'; // 인포윈도우에 표시될 내용입니다

            currentPosition = locPosition;
            // 마커와 인포윈도우를 표시합니다

            var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
                mapOption = {
                    center: locPosition, // 지도의 중심좌표
                    draggable: true, // 지도 이동 제한
                    level: 1 // 지도의 확대 레벨
                };

            map = new kakao.maps.Map(mapContainer, mapOption);
            // var promise = listing(map)
            map.setCenter(locPosition)
            displayMarker(locPosition, message, map);
            listing(map)

            // 문제 1) 
            // listing(map)이 끝나고 map.setCenter(locPosition)을 해야 함
            // listing(map)
            // map.setCenter(locPosition)

        });

    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
        console.log('geolocation unavailable')

        var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
            message = 'geolocation을 사용할수 없어요..'

        var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
            mapOption = {
                center: locPosition, // 지도의 중심좌표
                draggable: false, // 지도 이동 제한
                level: 1 // 지도의 확대 레벨
            };

        map = new kakao.maps.Map(mapContainer, mapOption);

        displayMarker(locPosition, message, map);
        listing(map)

    }
})





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

    kakao.maps.event.addListener(marker, 'dragstart', function(mouseEvent) {
        infowindow.close()
    });
    kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
        var latlng = mouseEvent.latLng;
        infowindow.close()
        marker.setPosition(latlng);
    })
}


var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png', // 마커이미지의 주소입니다    
    imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
    imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

// 마커를 표시할 위치와 title 객체 배열입니다 
var positions = [];

// 마커 이미지의 이미지 주소입니다
var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

var geocoder = new kakao.maps.services.Geocoder();


// DB에 위치등록을 요청하는 함수. 
function newSpot() {
    let marker_lat = uni_marker.getPosition().getLat(),
        marker_lon = uni_marker.getPosition().getLng();

    // call api

    // let location = `${marker_lat}, ${marker_lon}`
    let lat = `${marker_lat}`
    let lon = `${marker_lon}`
        // let pullUp = $('#pullUp').val();
    let pullUp = $('input:checkbox[id="pullUp"]').is(":checked")
        // let parallel = $('#parallel').val();
    let parallel = $('input:checkbox[id="parallel"]').is(":checked")
    let etc = $('#etc').val();
    var latlng = new kakao.maps.LatLng(marker_lat, marker_lon)



    if (pullUp == false & parallel == false) {
        alert('기구를 선택하세요');
        return;
    }
    // 문제2)
    // 좌표를 행정동 주소로 바꿔주는 함수인데, 이게 끝나고 ajax에 해당 값을 넣어서 요청하려함.

    // searchAddrFromCoords(latlng, getDetailAddrInfo)
    searchDetailAddrFromCoords(latlng, getDetailAddrInfo)





}


function searchAddrFromCoords(coords, callback) {
    // 좌표로 행정동 주소 정보를 요청합니다
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);

}

function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}


// 주소정보를 리턴하는 함수입니다
function getDetailAddrInfo(result, status) {

    if (status === kakao.maps.services.Status.OK) {
        var dongAddr = ''
        var streetAddr = ''


        var dong = result[0].address.address_name
        var street = ''
        try {
            street = result[0].road_address.address_name
        } finally {
            if (dong != null && street != '') {
                post_newspot(dong, street)
            } else if (dong != null) {
                post_newspot(dong, '')
            } else if (street != '') {
                post_newspot('', street)
            } else {
                post_newspot('주소 정보 없음니동', '')
            }
        }
    } else {
        console.log('kakao.maps not ok')
    }
}

// ajax post method
function post_newspot(dong, street) {

    let lat = `${uni_marker.getPosition().getLat()}`
    let lon = `${uni_marker.getPosition().getLng()}`
    let pullUp = $('input:checkbox[id="pullUp"]').is(":checked")
    let parallel = $('input:checkbox[id="parallel"]').is(":checked")
    let etc = $('#etc').val();
    $.ajax({
        type: "POST",
        url: "https://trainyourself.co.kr/api/spots/new",
        data: {
            lat_give: lat,
            lon_give: lon,
            pullUp_give: pullUp,
            parallel_give: parallel,
            etc_give: etc,
            address_dong: dong,
            address_street: street
        }

        // success: function(response) {
        //     if (response['result'] == 'success') {
        //         alert(response['msg']);
        //         window.location.reload();
        //     }
        // },

    }).done(function(response) {
        alert(response['msg'])
        window.location.assign('/');
    }).fail(function(response) {
        console.log('fail get address')
        alert(response['msg']);
    })
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
                    var title = ''
                    if (spots[i]['pullUp'] == 'true') {
                        title += '철봉 '
                    }
                    if (spots[i]['parallel'] == 'true') {
                        title += '평행봉'
                    }
                    tmp += title + '<br>'
                        // $('#spots_list').prepend(tmp)
                    positions.push({
                        title: `${title}`,
                        latlng: new kakao.maps.LatLng(spots[i]['lat'], spots[i]['lon'])
                    })
                }
                marker_display(map)

            }
        }
    })

}

function marker_display(map) {
    // marker set을 표시하는 코드

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

        marker.setMap(map);
    }

    var locPosition = currentPosition
    map.setCenter(locPosition)


    // 마커가 지도 위에 표시되도록 설정합니다
}