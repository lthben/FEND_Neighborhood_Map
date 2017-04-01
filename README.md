# FEND_Neighborhood_Map
A simple app using the Google Maps API to introduce Singapore's downtown area.

To run it, just download the project as a zip file and open index.html

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

The location listings: 
	1. Cultural Entertainment - Esplanade - Theatres by the Bay, Victoria Concert Hall
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

**********************************************************************************************************/
