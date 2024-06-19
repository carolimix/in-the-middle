import mapboxgl from "mapbox-gl";
import { geojson } from "../../data.js"; // mocked data
import { useRef, useEffect, useState } from "react";
import Search from "./Search.jsx";
import createMarker from "../utils/createMarker.js";
import { useNavigate } from "react-router-dom";
import geolib from "geolib";
import { findNearest } from "geolib";

const tokenMapBox = import.meta.env.VITE_ACCESS_TOKEN;
mapboxgl.accessToken = tokenMapBox;

function Mapbox() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(13.3885);
  const [lat, setLat] = useState(52.5144);
  const [spatis, setSpatis] = useState(geojson.features);
  // const [filteredSpatis, setFilteredSpatis] = useState();
  const [markers, setMarkers] = useState([]);
  const [benches, setBenches] = useState();
  const [toilet, setToilet] = useState();
  const [card, setCard] = useState();
  const [adressTyped, setAdressTyped] = useState(false);
  const [threeClosestSpatis, setThreeClosestSpatis] = useState(false);

  const handleCheckBox = (benches, toilet, card) => {
    setBenches(benches);
    setToilet(toilet);
    setCard(card);

    console.log(
      "Benches: " + benches + " Toilet: " + toilet + " Card: " + card
    );
    if (benches == true || toilet == true || card == true) {
      console.log("entrou no primeiro if");

      const filteredSpatis = spatis.filter((spati) => {
        console.log(spati.properties.toilette);
        return (
          (benches ? spati.properties.bench == benches : null) ||
          (toilet ? spati.properties.toilette == toilet : null) ||
          (card ? spati.properties.card == card : null)
        );
      });

      setSpatis(filteredSpatis);
      const markerss = spatis.map((n) => createMarker(n));
      setMarkers(markerss);
    }
    if (benches == false && toilet == false && card == false) {
      console.log("ENTROU");
      setSpatis(geojson.features);
      const markerss = spatis.map((n) => createMarker(n));
      setMarkers(markerss);
    }
  };

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

  useEffect(() => {
    handleCheckBox(benches, toilet, card);
  }, [benches, toilet, card]);

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
  }, [lat, lng, spatis, markers]);

  useEffect(() => {
    if (!map.current) return;

    map.current.flyTo({
      center: [lng, lat],
      zoom: adressTyped ? 15 : 12,
    });
  }, [lng, lat, adressTyped]);

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  function addMarkersOnMap(e) {
    setAdressTyped(true);

    const currentAddress = new mapboxgl.LngLat(e[0], e[1]);

    // Ensure userLocation and establishments are populated

    // Find the closest establishment
   /* let closest = null;
    let closestDistance = Number.MAX_VALUE;

    //get the 3 nearest spatis
    const sortedSpatis = spatis
      .map((est) => ({
        ...est,
        distance: calculateDistance(
          currentAddress.lat,
          currentAddress.lng,
          est.geometry.coordinates[1],
          est.geometry.coordinates[0]
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    // Pegar os três mais próximos
    const sortesSpatisNear = sortedSpatis.slice(0, 3);
    setThreeClosestSpatis(sortesSpatisNear);*/

    let closest = null;
    let closestDistance = Number.MAX_VALUE;

    spatis.forEach((est) => {
      const distance = calculateDistance(
        currentAddress.lat,
        currentAddress.lng,
        est.geometry.coordinates[1],
        est.geometry.coordinates[0]
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = est;
      }
    });

    setLng(closest.geometry.coordinates[0]);
    setLat(closest.geometry.coordinates[1]);

    //   console.log(closest.geometry.coordinates);

    // console.log(currentAddress);
    // console.log(spatis);

    //   console.log("lat")
    //  console.log(currentAddress.lat)
    //  setAdressTyped(true);
    //  setLat(e[1]);
    //   setLng(e[0]);

    //create markers in the map based on the mocked data
    const markers = spatis.filter((n) => {
      let newMarker = new mapboxgl.LngLat(
        n.geometry.coordinates[0],
        n.geometry.coordinates[1]
      );

      return currentAddress.distanceTo(newMarker) < 3000;
    });

    // setLat(newMarker[0])
    // setLng(newMarker[1])
    //     .map((n) => createMarker(n));
    //  setMarkers(markers);
  }

  const navigate = useNavigate();

  const handleAddSpatiClick = () => {
    navigate("/add");
  };

  return (
    <div>
      <Search
        addMarkersOnMap={addMarkersOnMap}
        handleCheckBox={handleCheckBox}
      />


      <div ref={mapContainer} className="map-container"></div>

      <div className="addSpati">
      <h3>Can't find your favorite one?</h3>
      <button onClick={handleAddSpatiClick}>+ add new spati</button>
      </div>
      <footer>
      <p> <a href="">About Us</a> </p> <p>|  </p> 
      <p><a href="">Contact</a> </p>
      </footer>
    </div>
  );
}

export default Mapbox;
