/*****************************
		The MODEL 
******************************/

var map;

var markers = [];

var infoWindow;

var bounds;

var displayedMarkers = []; //will be updated dynamically in the Knockout view model 

var placesJSON = [
	{
		name: 'Asian Civilisations Museum', type: 'Museums', location: {lat: 1.2874969, lng: 103.8513861}, imageURL: 'images/acm.jpg', marker: ''},
	{
		name: 'ArtScience Museum', type: 'Museums', location: {lat: 1.2862737, lng:103.8592661}, imageURL: 'images/asm.jpg', marker: ''},
	{
		name: 'Chinatown, Singapore', type: 'Shopping', location: {lat: 1.2837749, lng: 103.8437092}, imageURL: 'images/chinatown.jpg', marker: ''},
	{
		name: 'Clarke Quay', type: 'Night Life', location: {lat: 1.2906024, lng: 103.8464742}, imageURL: 'images/cq.jpg', marker: ''},
	{
		name: 'Esplanade, Singapore', type: 'Cultural Entertainment', location: {lat: 1.2899261, lng: 103.8556013}, imageURL: 'images/esplanade.jpg', marker: ''},
	{
		name: 'Fort Canning', type: 'Parks', location: {lat: 1.2938985, lng: 103.8466701}, imageURL: 'images/fc.jpg', marker: ''},
	{
		name: 'Gardens by the Bay', type: 'Parks', location: {lat: 1.2813536, lng: 103.8644179}, imageURL: 'images/gardens.jpg', marker: ''},
	{
		name: 'Hai Di Lao hot pot', type: 'Food', location: {lat: 1.2898692, lng: 103.8455851}, imageURL: 'images/haidilao.jpg', marker: ''},
	{
		name: 'Jumbo Seafood', type: 'Food', location: {lat: 1.2888328, lng: 103.8485596}, imageURL: 'images/jumbo.jpg', marker: ''},
	{
		name: 'Marina Bay Sands', type: 'Shopping', location: {lat: 1.2833964, lng: 103.8592773}, imageURL: 'images/mbs.jpg', marker: ''},
	{
		name: 'National Gallery Singapore', type: 'Museums', location: {lat: 1.289704, lng:103.851285}, imageURL: 'images/gallery.jpg', marker: ''},
	{
		name: 'National Museum of Singapore', type: 'Museums', location: {lat: 1.2968899, lng: 103.8488268}, imageURL: 'images/nsm.jpg', marker: ''},
	{
		name: 'Telok Ayer Street', type: 'Night Life', location: {lat: 1.2812376, lng: 103.8468268}, imageURL: 'images/telokayer.jpg', marker: ''},
	{
		name: 'Victoria Theatre and Concert Hall', type: 'Cultural Entertainment', location: {lat: 1.2883579, lng: 103.8518779}, imageURL: 'images/victoria.jpg', marker: ''}
	];


/*****************************
	The Google API functions
******************************/

/**
 * Error callback for GMap API request
 */
function mapError() {
  alert("Google Maps could not be loaded. Check your internet connection.");
}

//download map and all markers
function initMap() { 

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 1.2864682, lng:103.8539404},
		zoom: 15, 
	});

	infoWindow = new google.maps.InfoWindow({maxWidth:200});

	bounds = new google.maps.LatLngBounds();

	var defaultIcon = makeMarkerIcon('f1183c'); //red

	var highlightedIcon = makeMarkerIcon('1852f1'); //blue

	for (var i=0; i<placesJSON.length; i++) {

		var marker = new google.maps.Marker({
			position: placesJSON[i].location,
			map: map,
			name: placesJSON[i].name,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			id: i,
			imageURL: placesJSON[i].imageURL
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
	} //.for loop

	map.fitBounds(bounds);

	//ask for recalculation of bounds upon window resize
	google.maps.event.addDomListener(window, 'resize', function() {
		map.fitBounds(bounds);
	});

} //.initMap

//populate the content of the infowindow with an AJAX call to wikimedia API for a short wikipedia description and link
function populateInfoWindow(marker, infowindow) {

	if (infowindow.marker != marker) {
		infowindow.marker = marker;

		var myAPIurl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.name + "&format=json&callback=wikiCallback"; //use 'format=jsonfm' for pretty print when testing on the browser

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
				infowindow.setContent('<div>' + marker.name + '</div>' + '<p>' + myExtract + '</p>' + '<div>' + '<img src="' + marker.imageURL + '" alt="' + marker.name + '" style="height:150px">' + '</div>' + '<a href=' + myWikiURL + '>' + 'wikipedia' + '</a>');
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

	// infoWindow.close();

	hideAllListings();

	for (var i = 0; i < myMarkers.length; i++) {
		  myMarkers[i].setMap(map);
		  bounds.extend(myMarkers[i].position);
	}

	map.fitBounds(bounds);

	if (myMarkers.length == 1) {//just a single selection from the list

		bounceMarker(myMarkers[0], markers); //displayedMarkers will be updated when user selects a location from the list
		
		populateInfoWindow(myMarkers[0], infoWindow);
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

var NeighborhoodMapViewModel = function() {

	// displayed markers
	
	this.myDisplayedMarkers = ko.observableArray(displayedMarkers);

	this.showDisplayedMarkers = ko.computed( function() {

		showListings(this.myDisplayedMarkers()); //triggers whenever displayedMarkers changes

	}, this);

	// the category selection
	
	var categoryList = [];

	placesJSON.map(function(place) { //dynamically create the category list
		if (!categoryList.includes(place.type))
			categoryList.push(place.type);
		categoryList.sort();
	});

	this.categories = ko.observableArray(categoryList); //initialised 

	this.selectedCategory = ko.observable();

	// setting up the list of category names done once only

	var placesList = [];

	placesJSON.map(function(place) { //dynamically create the list of names of the places
		if (!placesList.includes(place.name))
			placesList.push(place.name);
		placesList.sort();
	});

	this.filteredPlaces = ko.computed(function() { 

		if (!this.selectedCategory()) {
			return(placesList);
		} else {

			var myPlaces = [];

			for (placeIndex in placesJSON) {
				if (this.selectedCategory() === placesJSON[placeIndex].type) {
					myPlaces.push(placesJSON[placeIndex].name);				
				}
			}
			return myPlaces;
		}
	}, this);

	//debugging

	this.printSelectedCat = function() {
		console.log(this.selectedCategory());
	};

	this.printSelectedLoc = function() { 
		console.log(this.selectedLocation());
	};
	
	// the list of place markers according to category

	this.selectListSize = ko.observable(placesJSON.length); //set to max size of list

	this.generatePlaceList = ko.computed( function() { 

		switch (this.selectedCategory()) {

			case ('- select a category -'): 
				this.myDisplayedMarkers(markers);
				break;
			case ('Cultural Entertainment'): 
				this.myDisplayedMarkers([markers[4],markers[13]]);
				break;
			case('Food'):
				this.myDisplayedMarkers([markers[7],markers[8]]);
				break;
			case('Museums'):
				this.myDisplayedMarkers([markers[0],markers[1],markers[10],markers[11]]);
				break;
			case('Night Life'):
				this.myDisplayedMarkers([markers[3],markers[12]]);
				break;
			case('Parks'):
				this.myDisplayedMarkers([markers[5],markers[6]]);
				break;
			case('Shopping'):
				this.myDisplayedMarkers([markers[2],markers[9]]);
				break;
			default: 
				this.myDisplayedMarkers(markers);
				break;
		}

		return; //need to add this return statement cos its a ko computed function

	}, this); //.locationList

	//the single place selection from the list
	
	this.selectedLocation = ko.observable(''); //selected by user

	this.activateLocation = ko.computed(function() {

		switch(this.selectedLocation()) {

			case('Asian Civilisations Museum'):
				this.myDisplayedMarkers([markers[0]]);
				break;
			case('ArtScience Museum'):
				this.myDisplayedMarkers([markers[1]]);
				return;
			case('Chinatown, Singapore'):
				this.myDisplayedMarkers([markers[2]]);
				break;
			case('Clarke Quay'):
				this.myDisplayedMarkers([markers[3]]);
				break;
			case('Esplanade, Singapore'):
				this.myDisplayedMarkers([markers[4]]);
				break;
			case('Fort Canning'):
				this.myDisplayedMarkers([markers[5]]);
				break;
			case('Gardens by the Bay'):
				this.myDisplayedMarkers([markers[6]]);
				break;
			case('Hai Di Lao hot pot'):
				this.myDisplayedMarkers([markers[7]]);
				break;
			case('Jumbo Seafood'):
				this.myDisplayedMarkers([markers[8]]);
				break;
			case('Marina Bay Sands'):
				this.myDisplayedMarkers([markers[9]]);
				break;
			case('National Gallery Singapore'):
				this.myDisplayedMarkers([markers[10]]);
				break;
			case('National Museum of Singapore'):
				this.myDisplayedMarkers([markers[11]]);
				break;
			case('Telok Ayer Street'):
				this.myDisplayedMarkers([markers[12]]);
				break;
			case('Victoria Theatre and Concert Hall'):
				this.myDisplayedMarkers([markers[13]]);
				break;
			default:
				this.myDisplayedMarkers([]);
				break;
		};

		return; //need to add this return statement cos its a ko computed function

	}, this); //.activateLocation

	this.showAllListings = function() {
		this.myDisplayedMarkers(markers);
		this.selectedCategory('');//reset to default category
		$('#select-cat').show();
		$('#select-loc').show();
		infoWindow.close();
	};

	this.hideAllListings = function() {
		hideAllListings();
		$('#select-cat').hide();
		$('#select-loc').hide();
	};

}; //.NeighbourhoodMapViewModel


$(window).on('load', function() { //let the google maps initialise first before ko binding so that the map and bounds global variables are defined when ko calls them
	ko.applyBindings(new NeighborhoodMapViewModel());
	showListings(markers);
});




















