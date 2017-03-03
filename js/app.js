var map;

var markers = [];

function initMap() { //download map and all markers

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 1.2864682, lng:103.8539404},
		zoom: 15, 
	});

	var infoWindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();

	/*To get geocode (replace with address to get latlon of place):-
		https://maps.googleapis.com/maps/api/geocode/json?address=9+Empress+Pl,+Singapore+179556&key=AIzaSyBGgwQyTBh-NZLm0qAuumS9M5K1zU0Qvos
	*/

	/*
	Note: I was not able to get the wikipedia main image programmatically via the mediawiki api, so I found the image URL manually instead. 

	To search for an image URL for a location:
	1. Get the name of the image file first. Go to the location's wikipedia page and the image name will appear on mouse hover or by clicking on it.
	2. Once you have the image file name, use another query to find its url. E.g.
		https://en.wikipedia.org/w/api.php?action=query&titles=Image:ArtScience%20Museum,%20Marina%20Bay%20Sands,%20Singapore%20-%2020110226-08.jpg&prop=imageinfo&iiprop=url

	Update: The image files from Wikipedia are too big ~10MB and took too long to load. So I found smaller images of < 100kb size from Google manually
	*/

	/*
	1. Cultural entertainment - Esplanade - Theatres by the Bay, Victoria Concert Hall
	2. Food - Hai Di Lao Hotpot, Jumbo Seafood
	3. Museums - Asian Civilisations Museum, Art Science Museum, National Gallery, National Museum
	4. Night Life - Clarke Quay, Telok Ayer Street
	5. Parks - Fort Canning, Gardens by the Bay
	6. Shopping - Chinatown, Marina Bay Sands

	In alphabetical order:-
		Asian Civilisations Museum
		Art Science Museum
		Chinatown
		Clarke Quay
		Esplanade - Theatres by the Bay
		Fort Canning
		Gardens by the Bay
		Hai Di Lao Hotpot
		Jumbo Seafood
		Marina Bay Sands
		National Gallery
		National Museum
		Telok Ayer Street
		Victoria Concert Hall

	Notes: 
		Esplanade - Theatres on the Bay wikipedia page has a redirect. I was unable to get the redirected page so I used Esplanade Park instead. 
	*/

	var places = [
	{
		title: 'Asian Civilisations Museum', location: {lat: 1.2874969, lng: 103.8513861}, imageURL: 'images/acm.jpg'},
	{
		title: 'Art Science Museum', location: {lat: 1.2862737, lng:103.8592661}, imageURL: 'images/asm.jpg'},
	{
		title: 'Chinatown, Singapore', location: {lat: 1.2837749, lng: 103.8437092}, imageURL: 'images/chinatown.jpg'},
	{
		title: 'Clarke Quay', location: {lat: 1.2906024, lng: 103.8464742}, imageURL: 'images/cq.jpg'},
	{
		title: 'Esplanade, Singapore', location: {lat: 1.2899261, lng: 103.8556013}, imageURL: 'images/esplanade.jpg'},
	{
		title: 'Fort Canning', location: {lat: 1.2938985, lng: 103.8466701}, imageURL: 'images/fc.jpg'},
	{
		title: 'Gardens by the Bay', location: {lat: 1.2813536, lng: 103.8644179}, imageURL: 'images/gardens.jpg'},
	{
		title: 'Hai Di Lao hot pot', location: {lat: 1.2898692, lng: 103.8455851}, imageURL: 'images/haidilao.jpg'},
	{
		title: 'Jumbo Seafood', location: {lat: 1.2888328, lng: 103.8485596}, imageURL: 'images/jumbo.jpg'},
	{
		title: 'Marina Bay Sands', location: {lat: 1.2833964, lng: 103.8592773}, imageURL: 'images/mbs.jpg'},
	{
		title: 'National Gallery Singapore', location: {lat: 1.289704, lng:103.851285}, imageURL: 'images/gallery.jpg'},
	{
		title: 'National Museum of Singapore', location: {lat: 1.2968899, lng: 103.8488268}, imageURL: 'images/nsm.jpg'},
	{
		title: 'Telok Ayer Street', location: {lat: 1.2812376, lng: 103.8468268}, imageURL: 'images/telokayer.jpg'},
	{
		title: 'Victoria Theatre and Concert Hall', location: {lat: 1.2883579, lng: 103.8518779}, imageURL: 'images/victoria.jpg'}
	];


	var defaultIcon = makeMarkerIcon('f1183c'); //red

	var highlightedIcon = makeMarkerIcon('1852f1'); //blue

	for (var i=0; i<places.length; i++) {
		var marker = new google.maps.Marker({
			position: places[i].location,
			map: map,
			title: places[i].title,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			id: i,
			imageURL: places[i].imageURL
		});
		
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

		markers.push(marker);

		bounds.extend(markers[i].position);
	}

	map.fitBounds(bounds);

	//the category selector
	var catSelector = document.getElementById('select-cat');

	catSelector.addEventListener('change', function(ev) {

		infoWindow.close();

		hideMarkers(markers);

		var displayedMarkers = [];

		var selected = ev.target.value;

		if (selected == '0') { //show all since unfiltered


			resetToStartingState(infoWindow); 
/*
			infoWindow.close();
			showListings(markers);
			// displayedMarkers = markers;
			$('#select-loc').find('option').remove().end().append('<option value="0">Asian Civilisations Museum</option><option value="1">Art Science Museum</option><option value="2">Chinatown</option><option value="3">Clarke Quay</option><option value="4">Esplanade - Theatres by the Bay</option><option value="5">Fort Canning Park</option><option value="6">Gardens by the Bay</option><option value="7">Hai Di Lao Hotpot</option><option value="8">Jumbo Seafood</option><option value="9">Marina Bay Sands</option><option value="10">National Gallery</option><option value="11">National Museum</option><option value="12">Telok Ayer Street</option><option value="13">Victoria Concert Hall</option>');
			*/
			
		} else {

			switch(selected) {
				case '1':
					displayedMarkers.push(markers[4]);
					displayedMarkers.push(markers[13]);
					$('#select-loc').find('option').remove().end().append('<option value="4">Esplanade - Theatres by the Bay</option><option value="13">Victoria Concert Hall</option>');
					break;
				case '2':
					displayedMarkers.push(markers[7]);
					displayedMarkers.push(markers[8]);
					$('#select-loc').find('option').remove().end().append('<option value="7">Hai Di Lao Hotpot</option><option value="8">Jumbo Seafood</option>');
					break;
				case '3':
					displayedMarkers.push(markers[0]);
					displayedMarkers.push(markers[1]);
					displayedMarkers.push(markers[10]);
					displayedMarkers.push(markers[11]);
					$('#select-loc').find('option').remove().end().append('<option value="0">Asian Civilisations Museum</option><option value="1">Art Science Museum</option><option value="10">National Gallery</option><option value="11">National Museum</option>');
					break;
				case '4':
					displayedMarkers.push(markers[3]);
					displayedMarkers.push(markers[12]);
					$('#select-loc').find('option').remove().end().append('<option value="3">Clarke Quay</option><option value="12">Telok Ayer Street</option>');
					break;
				case '5':
					displayedMarkers.push(markers[5]);
					displayedMarkers.push(markers[6]);
					$('#select-loc').find('option').remove().end().append('<option value="5">Fort Canning Park</option><option value="6">Gardens by the Bay</option>');
					break;
				case '6':
					displayedMarkers.push(markers[2]);
					displayedMarkers.push(markers[9]);
					$('#select-loc').find('option').remove().end().append('<option value="2">Chinatown</option><option value="9">Marina Bay Sands</option>');
					break;
			}
			showListings(displayedMarkers); //show only the selected markers for that category
		}

	}, false);

	//the location selector
	var locSelector = document.getElementById('select-loc');

	locSelector.addEventListener('change', function(ev) { //causes the marker for the selected location to become active

		// console.log("selected loc: " + ev.target.value);

		var selectedMarkerIndex = parseInt(ev.target.value);

		bounceMarker(markers[selectedMarkerIndex], markers);
		populateInfoWindow(markers[selectedMarkerIndex], infoWindow);

	}, false);

	//for the show and hide all buttons
	document.getElementById('show-listings').addEventListener('click', function() {

		catSelector.value = '0';
		resetToStartingState(infoWindow);
	});

	document.getElementById('hide-listings').addEventListener('click', function() {
		hideMarkers(markers);
	});
}

function resetToStartingState(infowindow) {
	
	infowindow.close();
	showListings(markers);
		
	$('#select-loc').find('option').remove().end().append('<option value="0">Asian Civilisations Museum</option><option value="1">Art Science Museum</option><option value="2">Chinatown</option><option value="3">Clarke Quay</option><option value="4">Esplanade - Theatres by the Bay</option><option value="5">Fort Canning Park</option><option value="6">Gardens by the Bay</option><option value="7">Hai Di Lao Hotpot</option><option value="8">Jumbo Seafood</option><option value="9">Marina Bay Sands</option><option value="10">National Gallery</option><option value="11">National Museum</option><option value="12">Telok Ayer Street</option><option value="13">Victoria Concert Hall</option>');
}

function populateInfoWindow(marker, infowindow) {

	if (infowindow.marker != marker) {
		infowindow.marker = marker;

		var myAPIurl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.title + "&format=json&callback=wikiCallback"; //use 'format=jsonfm' for pretty print when testing on the browser

		var wikiRequestTimeout = setTimeout(function() {
			infowindow.setContent('<div>' + '<p>' + "failed to get wikipedia resources" + '</p>' + '</div>');
			infowindow.open(map, marker);
		}, 8000);

		$.ajax( myAPIurl, {
			dataType: "jsonp",
			//jsonp: "callback",
			headers: {'Api-User-Agent': 'Udacity_FEND_student_project'},
			success: function (response) {

				// console.log(response);


			//0th item: search term, 1st array item: name results, 2nd: extracts, 3th: links 
				if (response[2].length > 0) { 
					var myExtract = response[2][0]; //get only the first result which is the correct one
				} 
				// console.log("myExtract: " + myExtract);
				if (response[3].length > 0) {
					var myWikiURL = response[3][0];
				}
				infowindow.setContent('<div>' + marker.title + '</div>' + '<p>' + myExtract + '</p>' + '<div>' + '<img src="' + marker.imageURL + '" alt="' + marker.title + '" style="height:100px">' + '</div>' + '<a href=' + myWikiURL + '>' + 'wikipedia' + '</a>');
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

// function clearMarkerSelection() { //deactivate any existing selected markers
// 	markers.forEach(function(element) {
// 		element.setAnimation(null);
// 	});
// 	infowindow.marker = null;
// }

// This function will loop through the markers array and display them all.
function showListings(markers) {
	var bounds = new google.maps.LatLngBounds();
	// Extend the boundaries of the map for each marker and display the marker
	for (var i = 0; i < markers.length; i++) {
		  markers[i].setMap(map);
		  bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
}
// This function will loop through the listings and hide them all.
function hideMarkers(markers) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
}

/*
https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=2&format=json&callback=success&titles=ArtScience%20Museum

https://en.wikipedia.org/w/api.php?action=query&prop=images&imlimit=1&titles=ArtScience%20Museum

*/



//ko.applyBindings(new neighborhoodMapViewModel());




















