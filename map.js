mapboxgl.accessToken = 'pk.eyJ1Ijoia3lzY2huaXQiLCJhIjoiY2t4ZzljdW5hNWg0ajJwcW92eXNjanV6ZCJ9.efendaFBujHtSKSEA5SwRA';

// Default longitude and latitude
var userLocation = new mapboxgl.LngLat(-73.935242, 40.730610);

function success(pos) {
	userLocation = new mapboxgl.LngLat(pos.coords.longitude, pos.coords.latitude);
	map.setCenter(userLocation);

}

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(success);
}

const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v11', // style URL
	center: userLocation.toArray(), // starting position [lng, lat]
	zoom: 6 // starting zoom
	// NYC Coords: [-73.935242, 40.730610]
});

map.addControl(
	new MapboxGeocoder({
		accessToken: mapboxgl.accessToken,
		mapboxgl: mapboxgl
	})
);
map.addControl(new mapboxgl.NavigationControl());
// const layerList = document.getElementById('menu');
// const inputs = layerList.getElementsByTagName('input');

map.addControl(
	new mapboxgl.GeolocateControl({
		positionOptions: {
			enableHighAccuracy: true
		},
		// When active the map will receive updates to the device's location as it changes.
		trackUserLocation: true,
		// Draw an arrow next to the location dot to indicate which direction the device is heading.
		showUserHeading: true
	})
);

async function reverseGeocode() {
	const urlBase = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
	const lngLat = userMarker.getLngLat();
	const query = await fetch(
		`${urlBase}${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`, {
			method: 'GET'
		}
	);
	const data = await query.json();
	document.getElementById("address").classList.toggle("opacity0");
	console.log(data);
}

// for (const input of inputs) {
// 	input.onclick = (layer) => {
// 		const layerId = layer.target.id;
// 		map.setStyle('mapbox://styles/mapbox/' + layerId);
// 	};
// }