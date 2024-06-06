import mapboxgl from "mapbox-gl";
import { geojson } from "./data.js"; // mocked data
import { useRef, useEffect, useState } from "react";

import { ACCESS_TOKEN } from "./mapBoxConstants";
import Search from "./components/Search.jsx";

const tokenMapBox = ACCESS_TOKEN;
mapboxgl.accessToken = tokenMapBox;

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(13.3885);
  const [lat, setLat] = useState(52.5144);
  const [spatis, setSpatis] = useState(geojson.features);
  const [filteredSpatis, setFilteredSpatis] = useState();
  const [value, setValue] = useState("");

  useEffect(() => {
    // if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 12,
    });
  }, []);

  function addMarkersOnMap(e) {
    const currentAddress = new mapboxgl.LngLat(e[0], e[1]);
    setLat(e[1]);
    setLng(e[0]);
    // const losAngeles = new mapboxgl.LngLat(-118.2437, 34.0522);
    //create markers in the map based on the mocked data
    spatis.map((n) => {
      let newMarker = new mapboxgl.LngLat(
        n.geometry.coordinates[0],
        n.geometry.coordinates[1]
      );
      console.log("distance", currentAddress.distanceTo(newMarker));
      // create popup to show more info about the Späti
      //pass in this order => [long, lat]

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `</br>
        <b style="color: black">
          ${n.properties.description}
          </br>
          ${n.properties.toilette}
          </br>
          ${n.properties.bench}
        </b>
      </br>`
      );
      //create marker
      const el = document.createElement("div");
      el.className = "marker";
      const marker = new mapboxgl.Marker(el);
      if (currentAddress.distanceTo(newMarker) < 3000) {
        marker
          .setLngLat([n.geometry.coordinates[0], n.geometry.coordinates[1]])
          .setPopup(popup)
          .addTo(map.current);
        return marker;
      }
      if (currentAddress.distanceTo(newMarker) > 3000) {
        marker.remove();
      }
    });
  }
  return (
    <div style={{ margin: "50px 50px 0 50px" }}>
      {/* Use useContext to pass the new lat/long? from search to Map */}
      <Search addMarkersOnMap={addMarkersOnMap} />
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default Map;
