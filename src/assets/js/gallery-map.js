// Gallery location map (Mapbox GL)
const mapEl = document.getElementById('gallery-map');

if (mapEl) {
  mapboxgl.accessToken = mapEl.dataset.token;

  const lat = parseFloat(mapEl.dataset.lat);
  const lng = parseFloat(mapEl.dataset.lng);
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const map = new mapboxgl.Map({
    container: mapEl,
    style: isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
    center: [lng, lat],
    zoom: 9,
    interactive: false,
    attributionControl: false,
  });

  map.addControl(new mapboxgl.AttributionControl({ compact: true }));

  new mapboxgl.Marker({ color: isDark ? '#c8956a' : '#5c4b3b' })
    .setLngLat([lng, lat])
    .addTo(map);
}
