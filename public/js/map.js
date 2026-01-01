// Initialize the map with a default view
const map = L.map("map").setView([17.6868, 83.2185], 12);

// Add Geoapify tile layer
L.tileLayer(
    `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${mapToken}`, {
        attribution: "© OpenStreetMap contributors, © Geoapify",
        maxZoom: 20,
    }
).addTo(map);

// Build full address
const fullAddress = `${listingLocation}, ${listingCountry}`;

// Forward geocode the listing location
async function showListingOnMap() {
    try {
        const res = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(fullAddress)}&format=geojson&apiKey=${mapToken}`
        );
        const data = await res.json();

        if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            const [lon, lat] = feature.geometry.coordinates;

            // Center the map on the location
            map.setView([lat, lon], 13);

            // Add marker with popup
            const marker = L.marker([lat, lon]).addTo(map);
            marker.bindPopup(`<b>${listingTitle}</b><br>${feature.properties.formatted}`);

            console.log("GeoJSON result:", feature);
        } else {
            console.error("No results found for", fullAddress);
        }
    } catch (error) {
        console.error("Error fetching geocode:", error);
    }
}

// Run function
showListingOnMap();

// Fix initial render issues
setTimeout(() => {
    map.invalidateSize();
}, 200);

// Resize on screen change
window.addEventListener("resize", () => {
    map.invalidateSize();
});

// Resize when navbar opens (mobile)
const navbarToggler = document.querySelector(".navbar-toggler");
if (navbarToggler) {
    navbarToggler.addEventListener("click", () => {
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    });
}

map.on("click", function(e) {
    const { lat, lng } = e.latlng;
    L.popup()
        .setLatLng(e.latlng)
        .setContent(`You clicked at:<br><b>${lat.toFixed(4)}, ${lng.toFixed(4)}</b>`)
        .openOn(map);
});