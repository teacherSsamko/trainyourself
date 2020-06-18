// find spot JS
function listing() {

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
}

function marker_display() {
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
    }

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
}