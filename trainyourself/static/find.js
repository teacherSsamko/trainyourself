// find spot JS
function listing() {

    $.ajax({
        tytpe: "GET",
        url: "https://34.64.213.249:5000/spots",
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
                    var etc = spots[i]['etc']
                    title += '<br>' + etc;
                    tmp += title + '<br>'
                    $('#spots_list').prepend(tmp)

                    positions.push({
                        title: `${title}`,
                        latlng: new kakao.maps.LatLng(spots[i]['lat'], spots[i]['lon']),
                        status: spots[i]['status']
                    })
                    console.log(spots[i]['status'])
                }
                marker_display()

            }
        }
    })
}

function marker_display() {
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
        // 확인버튼
        msg += '<br><button type="button" class="btn btn-success">확인</button>'
        // 거짓버튼
        msg += ' <button type="button" class="btn btn-danger">거짓</button>'
        msg += '</div>'

        console.log('a marker added on markers')

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
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
    console.log('markers set up complete')

}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
function makeOverListener(map, marker, infowindow) {
    return function () {
        infowindow.open(map, marker);
    };
}