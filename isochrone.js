// Create constants to use in getIso()
const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
var profile = 'cycling'; // Set the default routing profile
var minutes = 10; // Set the default duration

// Create a function that sets up the Isochrone API query then makes an fetch call
async function getIso() {
	const lngLat = userMarker.getLngLat();
	const query = await fetch(
		`${urlBase}${profile}/${lngLat.lng},${lngLat.lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`, {
			method: 'GET'
		}
	);
	const data = await query.json();
	map.getSource('iso').setData(data);
	reverseGeocode();
}

const userLocationPopup = new mapboxgl.Popup()
	.setText('Your Location');

const userMarker = new mapboxgl.Marker({
		draggable: true
	})
	.setPopup(userLocationPopup);

map.on('load', () => {
	// When the map loads, add the source and layer
	map.addSource('iso', {
		type: 'geojson',
		data: {
			type: 'FeatureCollection',
			features: []
		}
	});

	map.addLayer({
			id: 'isoLayer',
			type: 'fill',
			// Use "iso" as the data source for this layer
			source: 'iso',
			layout: {},
			paint: {
				// The fill color for the layer is set to a light purple
				'fill-color': '#5a3fc0',
				'fill-opacity': 0.3
			}
		},
		'poi-label'
	);

	userMarker.setLngLat(userLocation)
		.addTo(map);

	// Make the API call
	getIso();
});

// Target the "params" form in the HTML portion of your code
const params = document.getElementById('params');

// When a user changes the value of profile or duration by clicking a button, change the parameter's value and make the API query again
params.addEventListener('change', (event) => {
	if (event.target.name === 'profile') {
		profile = event.target.value;
	} else if (event.target.name === 'duration') {
		minutes = event.target.value;
	}
	getIso();
});

userMarker.on('dragend', getIso);