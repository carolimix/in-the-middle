import mapboxgl from "mapbox-gl";

export default function createMarker(n) {
  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    `</br>
  <b style="color: black">
    ${n.properties.description}
    </br>
   <p> Toilet: ${n.properties.toilette} </p>
    </br>
   <p> Benches: ${n.properties.bench} </p>
    </br>
   <p> Card: ${n.properties.card} </p>
  </b>
</br>`
  );
  //create marker
  const el = document.createElement("div");
  el.className = "marker";
  const marker = new mapboxgl.Marker(el);

  marker
    .setLngLat([n.geometry.coordinates[0], n.geometry.coordinates[1]])
    .setPopup(popup);
  return marker;
}