const coords = mapData.coordinates;

const map = L.map('map').setView([coords[1], coords[0]], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([coords[1], coords[0]])
  .addTo(map)
  .bindPopup(`<b>${mapData.title}</b>`)
  .openPopup();