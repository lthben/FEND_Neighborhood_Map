/*********************************************************************************************************
Developer notes:

Code structure:
	Three main parts in the following order:
		1. The 'Model' in MVVM which is the data structure consisting of global variables such as map and displayedMarkers
		2. The google API functions such as initMap and hideAllListings 
		3. The 'ViewModel' in MVVM for Knockout which binds the 'View' in MVVM (the HTML), to the 'Model' and google API behaviour

Geocoding:
	To get geocode (replace with address to get latlon of place):-
			https://maps.googleapis.com/maps/api/geocode/json?address=9+Empress+Pl,+Singapore+179556&key=AIzaSyBGgwQyTBh-NZLm0qAuumS9M5K1zU0Qvos

Image for the marker pop up infowindow:
	Note: I was not able to get the wikipedia main image programmatically via the mediawiki api, so I found the image URL manually instead. 

	As background info only, to search for an image URL for a location:
	1. Get the name of the image file first. Go to the location's wikipedia page and the image name will appear on mouse hover or by clicking on it.
	2. Once you have the image file name, use another query to find its url. E.g.
		https://en.wikipedia.org/w/api.php?action=query&titles=Image:ArtScience%20Museum,%20Marina%20Bay%20Sands,%20Singapore%20-%2020110226-08.jpg&prop=imageinfo&iiprop=url

	Note: The image files from Wikipedia are too big ~10MB and took too long to load. So I found smaller images of < 100kb size from Google and downloaded manually

The location listings: 
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

Creating a hamburger menu: 
	https://codepen.io/g13nn/pen/eHGEF
**********************************************************************************************************/

/*****************************
		The MODEL 
******************************/

var map;

var markers = [];

var displayedMarkers = []; //will be updated dynamically in the Knockout view model 

var places = [
	{
		title: 'Asian Civilisations Museum', location: {lat: 1.2874969, lng: 103.8513861}, imageURL: 'images/acm.jpg'},
	{
		title: 'ArtScience Museum', location: {lat: 1.2862737, lng:103.8592661}, imageURL: 'images/asm.jpg'},
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


/*****************************
	The Google API functions
******************************/

//download map and all markers
function initMap() { 

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 1.2864682, lng:103.8539404},
		zoom: 15, 
	});

	var infoWindow = new google.maps.InfoWindow({maxWidth:200});
	var bounds = new google.maps.LatLngBounds();

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

	document.getElementById('select-cat').addEventListener('change', function(ev){

		infoWindow.close();

		showListings(displayedMarkers); //the displayedMarkers are changed by the  Knockout viewmodel

	}, false);

	/* 

	//Developer notes: these inelegant code chunks are left here to remind you how knockout's two way data-binding makes all these unecessary

	//the category selector
	var catSelector = document.getElementById('select-cat');

	catSelector.addEventListener('change', function(ev) {

		infoWindow.close();

		hideMarkers(markers);

		var displayedMarkers = [];

		var selected = ev.target.value;

		if (selected == '0') { //show all since unfiltered

			resetToStartingState(infoWindow); 
			
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

	*/

	document.getElementById('select-loc').addEventListener('change', function(ev){

		infoWindow.close();

		bounceMarker(displayedMarkers, markers); //displayedMarkers will be updated when user selects a location from the list
		
		populateInfoWindow(displayedMarkers, infoWindow);
		
		showListings(displayedMarkers); 

	}, false);

	/*

	//Developer notes: these inelegant code chunks are left here to remind you how knockout's two way data-binding makes all these unecessary

	//the location selector
	var locSelector = document.getElementById('select-loc');

	locSelector.addEventListener('change', function(ev) { //causes the marker for the selected location to become active

		// console.log("selected loc: " + ev.target.value);

		var selectedMarkerIndex = parseInt(ev.target.value);

		bounceMarker(markers[selectedMarkerIndex], markers);
		populateInfoWindow(markers[selectedMarkerIndex], infoWindow);

	}, false);

	*/

	//for the show all button
	document.getElementById('show-listings').addEventListener('click', function() {

		infoWindow.close();
		$('#select-cat').show();
		$('#select-loc').show();
		$('#select-loc').prop("selectedIndex", -1);
	});

	//for the hide all button
	document.getElementById('hide-listings').addEventListener('click', function() {

		infoWindow.close();
		$('#select-cat').hide();
		$('#select-loc').hide();
	});


	/*

	//Developer notes: these inelegant code chunks are left here to remind you how knockout's two way data-binding makes all these unecessary

	//for the show all button
	document.getElementById('show-listings').addEventListener('click', function() {

		infoWindow.close();
		catSelector.value = '0'; 
		resetToStartingState();
		$('#select-cat').show();
		$('#select-loc').show();
	});

	//for the hide all button
	document.getElementById('hide-listings').addEventListener('click', function() {

		infoWindow.close();
		hideMarkers(markers);
		$('#select-cat').hide();
		$('#select-loc').hide();
	});

//default starting state with all markers and listings displayed 
function resetToStartingState() {
	
	showListings(markers);
		
	$('#select-loc').find('option').remove().end().append('<option value="0">Asian Civilisations Museum</option><option value="1">Art Science Museum</option><option value="2">Chinatown</option><option value="3">Clarke Quay</option><option value="4">Esplanade - Theatres by the Bay</option><option value="5">Fort Canning Park</option><option value="6">Gardens by the Bay</option><option value="7">Hai Di Lao Hotpot</option><option value="8">Jumbo Seafood</option><option value="9">Marina Bay Sands</option><option value="10">National Gallery</option><option value="11">National Museum</option><option value="12">Telok Ayer Street</option><option value="13">Victoria Concert Hall</option>');
}
*/
} //closing bracket for initMap

//populate the content of the infowindow with an AJAX call to wikimedia API for a short wikipedia description and link
function populateInfoWindow(marker, infowindow) {

	if (infowindow.marker != marker) {
		infowindow.marker = marker;

		var myAPIurl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.title + "&format=json&callback=wikiCallback"; //use 'format=jsonfm' for pretty print when testing on the browser

		var wikiRequestTimeout = setTimeout(function() { //use timeout in case of failure
			infowindow.setContent('<div>' + '<p>' + "failed to get wikipedia resources" + '</p>' + '</div>');
			infowindow.open(map, marker);
		}, 8000);

		//ajax request using jQuery
		$.ajax( myAPIurl, {
			dataType: "jsonp",
			headers: {'Api-User-Agent': 'Udacity_FEND_student_project'},
			success: function (response) {

				// console.log(response);

			//response[0]: search term, response[1]: name results, response[2]: first sentence extracts from all the links, response[3]: wikipedia links 
				if (response[2].length > 0) { 
					var myExtract = response[2][0]; //get only the first result which is the correct one
				} 
				// console.log("myExtract: " + myExtract);
				if (response[3].length > 0) {
					var myWikiURL = response[3][0];
				}
				infowindow.setContent('<div>' + marker.title + '</div>' + '<p>' + myExtract + '</p>' + '<div>' + '<img src="' + marker.imageURL + '" alt="' + marker.title + '" style="height:150px">' + '</div>' + '<a href=' + myWikiURL + '>' + 'wikipedia' + '</a>');
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

//make a google marker image with a specified colour
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2',
	    new google.maps.Size(21, 34),
	    new google.maps.Point(0, 0),
	    new google.maps.Point(10, 34),
	    new google.maps.Size(21,34));
    return markerImage;
}

//bounce the marker when it is selected
function bounceMarker(marker, markers) {
		markers.forEach(function(element) {
		if (element != marker) {
			element.setAnimation(null);
		} else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
		}
	});
}

//display the markers passed in as a parameter 
function showListings(myMarkers) {

	hideAllListings();

	if (myMarkers.length > 1) {

		var bounds = new google.maps.LatLngBounds();

		for (var i = 0; i < myMarkers.length; i++) {
			  myMarkers[i].setMap(map);
			  bounds.extend(myMarkers[i].position);
		}
		map.fitBounds(bounds);

	} else {

		myMarkers.setMap(map);
	}
}

//remove all existing markers from map
function hideAllListings() {

	for (var i = 0; i < markers.length; i++) { 
		markers[i].setMap(null);
	}
}


/*****************************
	Knockout's VIEWMODEL
******************************/

var neighborhoodMapViewModel = function() {

	this.selectedCategory = ko.observable('- select a category -');

	this.printSelectedCat = function() { //for debugging
		console.log(this.locationList());
	}

	this.printSelectedLoc = function() { //for debugging
		console.log(this.selectedLocation());
	}

	this.selectListSize = ko.observable('14');

	this.locationList = ko.computed(function() {

		switch (this.selectedCategory()) {
			case ('- select a category -'): 
				this.selectListSize('14');
				displayedMarkers = [markers[0],markers[1],markers[2],markers[3],markers[4],markers[5],markers[6],markers[7],markers[8],markers[9],markers[10],markers[11],markers[12],markers[13]];
				return ['Asian Civilisations Museum', 'ArtScience Museum','Chinatown, Singapore','Clarke Quay','Esplanade, Singapore','Fort Canning','Gardens by the Bay','Hai Di Lao hot pot','Jumbo Seafood','Marina Bay Sands','National Gallery Singapore','National Museum of Singapore','Telok Ayer Street','Victoria Theatre and Concert Hall'];
				break;
			case ('Cultural Entertainment'): 
				this.selectListSize('2');
				displayedMarkers = [markers[4],markers[13]];
				return ['Esplanade, Singapore','Victoria Theatre and Concert Hall'];
				break;
			case('Food'):
				this.selectListSize('2');
				displayedMarkers = [markers[7],markers[8]];
				return ['Hai Di Lao hot pot','Jumbo Seafood'];
				break;
			case('Museums'):
				this.selectListSize('4');
				displayedMarkers = [markers[0],markers[1],markers[10],markers[11]];
				return ['Asian Civilisations Museum', 'ArtScience Museum', 'National Gallery Singapore','National Museum of Singapore'];
				break;
			case('Night Life'):
				this.selectListSize('2');
				displayedMarkers = [markers[3],markers[12]];
				return ['Clarke Quay','Telok Ayer Street'];
				break;
			case('Parks'):
				this.selectListSize('2');
				displayedMarkers = [markers[5],markers[6]];
				return['Fort Canning','Gardens by the Bay'];
				break;
			case('Shopping'):
				this.selectListSize('2');
				displayedMarkers = [markers[2],markers[9]];
				return ['Chinatown, Singapore', 'Marina Bay Sands'];
				break;
		}
	}, this);
	
	this.selectedLocation = ko.observable(null);

	this.selectedMarker = ko.computed(function() { //used as a hack to update the global displayedMarkers variable

		switch(this.selectedLocation()) {
			case('Asian Civilisations Museum'):
				displayedMarkers = markers[0];
				return;
				break;
			case('ArtScience Museum'):
				displayedMarkers = markers[1];
				return;
				break;
			case('Chinatown, Singapore'):
				displayedMarkers = markers[2];
				return;
				break;
			case('Clarke Quay'):
				displayedMarkers = markers[3];
				return;
				break;
			case('Esplanade, Singapore'):
				displayedMarkers = markers[4];
				return;
				break;
			case('Fort Canning'):
				displayedMarkers = markers[5];
				return;
				break;
			case('Gardens by the Bay'):
				displayedMarkers = markers[6];
				return;
				break;
			case('Hai Di Lao hot pot'):
				displayedMarkers = markers[7];
				return;
				break;
			case('Jumbo Seafood'):
				displayedMarkers = markers[8];
				return;
				break;
			case('Marina Bay Sands'):
				displayedMarkers = markers[9];
				return;
				break;
			case('National Gallery Singapore'):
				displayedMarkers = markers[10];
				return;
				break;
			case('National Museum of Singapore'):
				displayedMarkers = markers[11];
				return;
				break;
			case('Telok Ayer Street'):
				displayedMarkers = markers[12];
				return;
				break;
			case('Victoria Theatre and Concert Hall'):
				displayedMarkers = markers[13];
				return;
				break;
		}
	}, this);

	this.showAllListings = function() {
		showListings(markers);
		this.selectedCategory('- select a category -');//reset to default category
	}

	this.hideAllListings = function() {
		hideAllListings();
	}
}

ko.applyBindings(new neighborhoodMapViewModel());




















