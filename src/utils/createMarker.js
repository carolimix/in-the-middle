import mapboxgl from "mapbox-gl";
import Mapbox from "../components/Mapbox";

export default function createMarker(n) {

  // n are the spatis and el are the divs
 
  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    `</br>
  <b style="color: black">
    ${n.properties.description}
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
    marker.getElement().addEventListener('click', () => {
      console.log("Marker clicked");
      //call a mapbox function
      //call a function to show the spati clicked on the sidebar!
    });
  return marker;
}
