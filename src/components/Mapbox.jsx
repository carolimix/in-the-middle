import mapboxgl from "mapbox-gl";
import { geojson } from "../../data.js"; // mocked data
import { useRef, useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../mapBoxConstants.js";
import Search from "./Search.jsx";
import createMarker from "../utils/createMarker.js";

const tokenMapBox = ACCESS_TOKEN;
mapboxgl.accessToken = tokenMapBox;

function Mapbox() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(13.3885);
  const [lat, setLat] = useState(52.5144);
  const [spatis, setSpatis] = useState(geojson.features);
  // const [filteredSpatis, setFilteredSpatis] = useState();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 12,
    });
    const markers = spatis.map((n) => createMarker(n));
    setMarkers(markers);
  }, [lat, lng]);

  useEffect(() => {
    if (!map.current) return;
    map.current.jumpTo({
      center: [lng, lat],
      zoom: 12,
    });
  }, [lng, lat]);

  useEffect(() => {
    markers.forEach((m) => {
      m.addTo(map.current);
    });

    return () => {
      markers.forEach((m) => {
        m.remove();
      });
    };
  }, [markers]);

  function addMarkersOnMap(e) {
    const currentAddress = new mapboxgl.LngLat(e[0], e[1]);
    setLat(e[1]);
    setLng(e[0]);
    //create markers in the map based on the mocked data
    const markers = spatis
      .filter((n) => {
        let newMarker = new mapboxgl.LngLat(
          n.geometry.coordinates[0],
          n.geometry.coordinates[1]
        );
        return currentAddress.distanceTo(newMarker) < 3000;
      })
      .map((n) => createMarker(n));
    setMarkers(markers);
  }

  return (
    <div style={{ margin: "50px 50px 0 50px" }}>
      <Search addMarkersOnMap={addMarkersOnMap} />
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default Mapbox;
