
if (typeof mapCoordinates !== 'undefined' && document.getElementById('map')) {
    mapboxgl.accessToken = map_token;
    
    const coordinates = mapCoordinates;
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        projection: 'globe',
        zoom: 10,
        center: coordinates
    });
    

    // Add marker at the location
    const marker = new mapboxgl.Marker({ color: '#FF0000' })
        .setLngLat(coordinates)
        .addTo(map);

    // Add popup to the marker
    const popup = new mapboxgl.Popup({ offset: 25 })
        .setText('Location')
        .addTo(map);
    
    marker.setPopup(popup);

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    map.on('style.load', () => {
        map.setFog({});
    });
}
