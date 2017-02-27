


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


	/*To get geocode (replace with address to get latlon of place):-
		https://maps.googleapis.com/maps/api/geocode/json?address=9+Empress+Pl,+Singapore+179556&key=AIzaSyBGgwQyTBh-NZLm0qAuumS9M5K1zU0Qvos
	*/

	/*
	To search for an image URL for a location:
	1. Get the name of the image file first. Go to the location's wikipedia page and the image name will appear on mouse hover or by clicking on it.
	2. Once you have the image file name, use another query to find its url. E.g.
		https://en.wikipedia.org/w/api.php?action=query&titles=Image:ArtScience%20Museum,%20Marina%20Bay%20Sands,%20Singapore%20-%2020110226-08.jpg&prop=imageinfo&iiprop=url
	*/

	/*
	Cultural entertainment - Victoria Concert Hall, Esplanade Theatres
	Food - Jumbo Seafood, Hai Di Lao Hotpot
	Museums - Art Science, National Gallery, National Museum, Asian Civilisations Museum
	Night Life - Clarke Quay, Telok Ayer Street
	Parks and Nature - Gardens by the Bay, Fort Canning
	Shopping - Marina Bay Sands, Chinatown

	Note: Esplanade - Theatres on the Bay wikipedia page has a redirect. I was unable to get the redirected page so I used Esplanade Park instead. 
	*/

	var places = [
	{
		title: 'Victoria Theatre and Concert Hall', location: {lat: 1.2883579, lng: 103.8518779}, imageURL: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/2016_Singapur%2C_Downtown_Core%2C_Teatr_Wiktorii_i_Hala_Koncertowa_%2802%29.jpg'},
	{
		title: 'Esplanade, Singapore', location: {lat: 1.2899261, lng: 103.8556013}, imageURL: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/The_Esplanade_%E2%80%93_Theatres_on_the_Bay.jpg'},
	{
		title: 'Jumbo Seafood', location: {lat: 1.2888328, lng: 103.8485596}, imageURL: 'http://2.bp.blogspot.com/_lctXUx9NVYw/RjSTe-Y40_I/AAAAAAAABnk/zHCplZ71WUM/s1600/1-jumbo.jpg'},
	{
		title: 'Hai Di Lao hot pot', location: {lat: 1.2898692, lng: 103.8455851}, imageURL: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Hai_Di_Lao.JPG'}, 
	{
		title: 'Art Science Museum', location: {lat: 1.2862737, lng:103.8592661}, imageURL: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Singapore_ArtScience_Museum_1.jpg'},
	{
		title: 'National Gallery Singapore', location: {lat: 1.289704, lng:103.851285}, imageURL: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/City_Hall_and_Old_Supreme_Court_Building%2C_Jan_06.JPG'},
	{
		title: 'National Museum of Singapore', location: {lat: 1.2968899, lng: 103.8488268}, imageURL: 'https://upload.wikimedia.org/wikipedia/commons/0/09/National_Museum_Singapore.jpg'},
	{
		title: 'Asian Civilisations Museum', location: {lat: 1.2874969, lng: 103.8513861}, imageURL: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Asian_civilisations_museums_singapore.jpg'},
	{
		title: 'Clarke Quay', location: {lat: 1.2906024, lng: 103.8464742}, imageURL: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Clarke_Quay%2C_Singapore%2C_at_night_-_20150308.jpg'},
	{
		title: 'Telok Ayer Street', location: {lat: 1.2812376, lng: 103.8468268}, imageURL: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Telok_Ayer_Street%2C_Dec_05.JPG'},
	{
		title: 'Gardens by the Bay', location: {lat: 1.2813536, lng: 103.8644179}, imageURL: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Cloud_Forest%2C_Gardens_by_the_Bay%2C_Singapore_-_20120617-05.jpg'},
	{
		title: 'Fort Canning', location: {lat: 1.2938985, lng: 103.8466701}, imageURL: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Fort_Canning_Park_Hill_St.JPG'},
	{
		title: 'Marina Bay Sands', location: {lat: 1.2833964, lng: 103.8592773}, imageURL: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Marina_Bay_Sands_in_the_evening_-_20101120.jpg'}, 
	{
		title: 'Chinatown, Singapore', location: {lat: 1.2837749, lng: 103.8437092}, imageURL: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Pagoda_Street%2C_Chinatown_Heritage_Centre%2C_Dec_05.JPG'}, 
	
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
			id: i,
			imageURL: places[i].imageURL
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

		var myAPIurl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.title + "&format=json&callback=wikiCallback";

		var wikiRequestTimeout = setTimeout(function() {
			infowindow.setContent('<div>' + '<p>' + "failed to get wikipedia resources" + '</p>' + '</div>');
			infowindow.open(map, marker);
		}, 8000);
		// var myAPIurl = "https://en.wikipedia.org/w/api.php?action=query&list=search&prop=images&format=json&srsearch=albert_einstein&srnamespace=0&srprop=snippet&srlimit=10&imlimit=1";

		$.ajax( myAPIurl, {
			dataType: "jsonp",
			//jsonp: "callback",
			headers: {'Api-User-Agent': 'Udacity_FEND_student_project'},
			success: function (response) {

				console.log(response);


			//0th item: search term, 1st array item: name results, 2nd: extracts, 3th: links 
				if (response[2].length > 0) { 
					var myExtract = response[2][0]; //get only the first result which is the correct one
				} 
				// console.log("myExtract: " + myExtract);
				if (response[3].length > 0) {
					var myWikiURL = response[3][0];
				}
				infowindow.setContent('<div>' + marker.title + '</div>' + '<p>' + myExtract + '</p>' + '<div>' + '<img src="' + marker.imageURL + '" alt="' + marker.title + '" style="width:200px">' + '</div>' + '<a href=' + myWikiURL + '>' + 'wikipedia' + '</a>');
				infowindow.open(map, marker);

				clearTimeout(wikiRequestTimeout);
			}
		});
	
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

/*
https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=2&format=json&callback=success&titles=ArtScience%20Museum

https://en.wikipedia.org/w/api.php?action=query&prop=images&imlimit=1&titles=ArtScience%20Museum

*/



//ko.applyBindings(new neighborhoodMapViewModel());




















