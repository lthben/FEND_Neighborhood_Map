


function initMap() {

	var map;

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 1.2864682, lng:103.8539404},
		zoom: 15, 
	});

	var i; 
	var markers = [];

	var infoWindow = new google.maps.InfoWindow();
	// var bounds = new google.maps.LatLngBounds();


	//To get geocode (replace with address to get latlon of place):-
	//https://maps.googleapis.com/maps/api/geocode/json?address=9+Empress+Pl,+Singapore+179556&key=AIzaSyBGgwQyTBh-NZLm0qAuumS9M5K1zU0Qvos

	var places = [
	{title: 'Art Science Museum', location: {lat: 1.2862737, lng:103.8592661}},
	{title: 'Victoria Theatre & Concert Hall', location: {lat: 1.2883579, lng: 103.8512779}}
	];

	var defaultIcon = makeMarkerIcon('f1183c');

	var highlightedIcon = makeMarkerIcon('1852f1');

	for (i=0; i<places.length; i++) {
		var marker = new google.maps.Marker({
			position: places[i].location,
			map: map,
			title: places[i].title,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			id: i
		});
		markers.push(marker);

		marker.addListener('click', function() {
			bounceMarker(this, markers);
			populateInfoWindow(this, infoWindow);
		});

		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});
		// bounds.extend(markers[i].position);
	}

	// map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow) {

	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
		infowindow.open(map, marker);

		infowindow.addListener('closeclick', function() {
			marker.setAnimation(null);
			infowindow.marker = null;
		});
	} 
}

function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2',
	    new google.maps.Size(21, 34),
	    new google.maps.Point(0, 0),
	    new google.maps.Point(10, 34),
	    new google.maps.Size(21,34));
    return markerImage;
}

function bounceMarker(marker, markers) {
		markers.forEach(function(element) {
		if (element != marker) {
			element.setAnimation(null);
		} else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
		}
	});
}

//ko.applyBindings(new neighborhoodMapViewModel());
