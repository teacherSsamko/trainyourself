// find spot JS
// 마커를 표시할 위치와 title 객체 배열입니다 
var positions = [];

var uni_marker;
var currentPosition;
var latlongs = [];
var locPosition = new kakao.maps.LatLng(36.29746481647284, 127.56879367588002)
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: locPosition, // 지도의 중심좌표
        draggable: true, // 지도 이동 제한
        level: 2 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption)
var overlay_list = [];
var markers = []
var provinces = [];

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
        mapContainer = document.getElementById('map'), // 지도를 표시할 div 
            mapOption = {
                center: locPosition, // 지도의 중심좌표
                draggable: true, // 지도 이동 제한
                level: 2 // 지도의 확대 레벨
            };

        map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
        listing(map)



    });


} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    console.log('geolocation unavailable')

    var locPosition = new kakao.maps.LatLng(33.450701, 126.570667)

    mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = {
            center: locPosition, // 지도의 중심좌표
            draggable: true, // 지도 이동 제한
            level: 2 // 지도의 확대 레벨
        };

    map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
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
                $('#spots_button').empty()
                for (let i = 0; i < spots.length; i++) {

                    var latlng = new kakao.maps.LatLng(spots[i]['lat'], spots[i]['lon']);
                    var addr = `${spots[i]['address_dong']}`
                    var address = addr.split(' ')
                    addr = ''
                    for (let i = 0; i < address.length; i++) {
                        addr += address[i] + ' '
                        if (address[i].endsWith('구')) {
                            addr += address[i + 1]
                            break;
                        } else if (address[i].endsWith('동')) {
                            break;
                        }
                    }
                    var province = address[0]
                    if (!provinces.includes(province)) {
                        if (province.includes('제주')) {
                            province = '제주'
                        }
                        provinces.push(province)
                        var tmp_btn = `<button type="button" class="btn btn-outline-primary filter">${province}</button>`
                        $('#spots_button').append(tmp_btn);

                    }

                    var equip = ''
                    if (spots[i]['pullUp'] == 'true') {
                        equip += '철봉 '
                    }
                    if (spots[i]['parallel'] == 'true') {
                        equip += '평행봉'
                    }
                    var etc = spots[i]['etc']
                    var tmp = `<div class='equip filterDiv'>`
                    if (etc != '') {
                        tmp += `${addr} - ${equip} &lt; ${etc} &gt;`
                    } else {
                        tmp += `${addr} - ${equip}`
                    }
                    tmp += ' </div>'

                    $('#spots_list').append(tmp)

                    positions.push({
                        equip: `${equip}`,
                        latlng: latlng,
                        addr: addr,
                        address_dong: spots[i]['address_dong'],
                        address_street: spots[i]['address_street'],
                        status: spots[i]['status']
                    });
                    // console.log(spots[i]['status'])
                    var filter = $('.filter').html()

                    $('.filter').click(function() {
                        var i = $(this).index()
                        var filter = $(this).text();
                        $('.btn-primary').each(function() {
                            $(this).removeClass('btn-primary')
                            $(this).addClass('btn-outline-primary')
                        })
                        $(this).removeClass('btn-outline-primary')
                        $(this).addClass('btn-primary')
                        $('.equip').each(function(index) {
                            var addr = $(this).text();
                            if (addr.startsWith(filter)) {
                                $(this).addClass("show")
                            } else {
                                $(this).removeClass("show")
                            }

                        })

                    })



                }


                marker_display(map)

            }
        }
    }).done(function(response) {
        let spots = response['spots']
        for (let i = 0; i < spots.length; i++) {
            var latlng = new kakao.maps.LatLng(spots[i]['lat'], spots[i]['lon']);
            latlongs.push(latlng)
        }
        $('.equip').click(function() {
            var index = $(this).index('.equip')
            panTo(index)
            overlay_list[index].setMap(map)
                // overylay 여기
        })
    })
}

function marker_display(map) {
    // marker set을 표시하는 코드
    // var markers = []

    for (var i = 0; i < positions.length; i++) {

        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다    
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            // map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            equip: positions[i].equip, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage, // 마커 이미지 
            clickable: true
        });

        var msg = `<div class='iw'>${positions[i].equip}`
            //     // 확인버튼
            // msg += '<br><button type="button" class="btn btn-success">확인</button>'
            //     // 거짓버튼
            // msg += ' <button type="button" class="btn btn-danger">거짓</button>'
        msg += '</div>'


        var iwContent = msg, // 인포윈도우에 표시할 내용
            iwRemoveable = true;

        // 인포윈도우를 생성합니다
        // var infowindow = new kakao.maps.InfoWindow({
        //     content: iwContent,
        //     removable: iwRemoveable
        // });
        var overlay_content = '<div class="wrap">' +
            '    <div class="info">' +
            '        <div class="title">' +
            `            ${positions[i].equip}` +
            `            <div class="close" onclick="closeOverlay(${i})" title="닫기"></div>` +
            '        </div>' +
            '        <div class="body">' +
            '            <div class="img">' +
            '                <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png" width="73" height="70">' +
            '           </div>' +
            '            <div class="desc">' +
            `                <div class="ellipsis">${positions[i].address_street}</div>` +
            `                <div class="jibun ellipsis">${positions[i].address_dong}</div>` +
            // '                <div><a href="https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a></div>' + 
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>'

        var overlay = new kakao.maps.CustomOverlay({
            content: overlay_content,
            // map: map,
            position: marker.getPosition()
        });


        overlay_list.push(overlay)


        markers.push(marker)
    }

    // 마커가 지도 위에 표시되도록 설정합니다
    // 마커마다 클릭이벤트를 지정합니다.



    // 마커 클러스터링
    var clusterer = new kakao.maps.MarkerClusterer({
        map: map,
        markers: markers,
        // gridSize: 35,
        averageCenter: true,
        minLevel: 4,
        // disableClickZoom: true,
        styles: [{
            width: '53px',
            height: '52px',
            background: 'aquamarine',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '54px'
        }]
    });

    clusterer.addMarkers(markers)

    // console.log(markers)


    addClickEventOnMarkers()
    kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
        for (let i = 0; i < overlay_list.length; i++) {
            overlay_list[i].setMap(null)
        }
    });


}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
function makeOverListener(map, marker, infowindow) {
    return function() {
        infowindow.open(map, marker);
    };
}

// 마커 클릭시 해당 위치로 이동하게 하는 함수
function panTo(i) {
    // var latlongs = positions
    if (i == -1) { i = 0 }
    // console.log(latlongs)
    // console.log(latlongs.length)
    // console.log(i)
    if (latlongs.length == 0) {
        destination = new kakao.maps.LatLng(33.450580, 126.574942)
    } else {
        destination = latlongs[i]

    }
    // 이동할 위도 경도 위치를 생성합니다 
    // var moveLatLon = new kakao.maps.LatLng(33.450580, 126.574942);

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    // var thisMap = map
    // thisMap.panTo(destination);
    map.panTo(destination);
}



// 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
function closeOverlay(i) {
    var overlay = overlay_list[i]
    overlay.setMap(null);
}

// 마커에 클릭이벤트를 등록합니다. > 오버레이 띄우기
function addClickEventOnMarkers() {
    for (let i = 0; i < markers.length; i++) {
        kakao.maps.event.addListener(markers[i], 'click', function() {
            overlay_list[i].setMap(map)
        });

    }
}

// 버튼 클릭으로 list item filtering