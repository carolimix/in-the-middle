import mapboxgl from "mapbox-gl";
import { geojson } from "../../data.js"; // mocked data
import { useRef, useEffect, useState } from "react";
import Search from "./Search.jsx";
import createMarker from "../utils/createMarker.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

const tokenMapBox = import.meta.env.VITE_ACCESS_TOKEN;
mapboxgl.accessToken = tokenMapBox;

function Mapbox() {
  const date = new Date();
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
  const [threeClosestSpatis, setThreeClosestSpatis] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [specificSpatiClicked, setSpecificSpatiClicked] = useState("");
  const [clickedSpati, setClickedSpati] = useState("");

  const handleCheckBox = (benches, toilet, card) => {
    setBenches(benches);
    setToilet(toilet);
    setCard(card);

    if (benches == true || toilet == true || card == true) {

      const filteredSpatis = geojson.features.filter((spati) => {
        const hasBenchesCondition = benches ? spati.properties.bench : true; // If hasBenches is false, always return true
        const hasToiletCondition = toilet ? spati.properties.toilette : true; // If hasToilet is false, always return true
        const acceptsCardCondition = card ? spati.properties.card : true; // If acceptsCard is false, always return true

        // Return true if all conditions are true (establishment meets all selected criteria)
        return (
          hasBenchesCondition && hasToiletCondition && acceptsCardCondition
        );
      });

      setSpatis(filteredSpatis);
      const markerss = spatis.map((n) => createMarker(n, setClickedSpati));
      setMarkers(markerss);
    }

    if (benches == false && toilet == false && card == false) {
      setSpatis(geojson.features);
      const markerss = spatis.map((n) => createMarker(n, setClickedSpati));
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

    const markers = spatis.map((n) => createMarker(n, setClickedSpati));
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
    setClickedSpati(null);
    setAdressTyped(true);

    const currentAddress = new mapboxgl.LngLat(e[0], e[1]);

    // Ensure userLocation and establishments are populated

    // Find the closest establishment

    //get the 3 nearest spatis
    const closestSpatis = spatis
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
    const sortedSpatisNear = closestSpatis.slice(0, 3);
    setThreeClosestSpatis(sortedSpatisNear);
    setSidebarOpen(true);

    console.log(sortedSpatisNear);

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

    //create markers in the map based on the mocked data
    const markers = spatis.filter((n) => {
      let newMarker = new mapboxgl.LngLat(
        n.geometry.coordinates[0],
        n.geometry.coordinates[1]
      );

      return currentAddress.distanceTo(newMarker) < 3000;
    });

  }

  const navigate = useNavigate();

  const handleAddSpatiClick = () => {
    navigate("/add");
  };

  function closeMapSideBar(e) {
    setSidebarOpen(false);
    setThreeClosestSpatis("");
    setSpecificSpatiClicked("");
    setClickedSpati(null);
  }

  function approximateSpationMap(a, b, specificSpatiClicked) {
    setSpecificSpatiClicked(specificSpatiClicked);
    map.current.flyTo({
      center: [a, b],
      zoom: 16,
    });
  }

  function backToNearestSpatis() {
    setClickedSpati("");
  }

  // Helper function to get today's opening hours
  const getTodayOpeningHours = (openingHours) => {
    const dayIndex = new Date().getDay();
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return openingHours[days[dayIndex]] || "No information found";
  };

  return (
    <div>
      <Search
        addMarkersOnMap={addMarkersOnMap}
        handleCheckBox={handleCheckBox}
      />

      <div ref={mapContainer} className="map-container">
        {clickedSpati && (
          <div className="sidebar">
            <div id="sidebarTop">
              <div
                className="closeMapSideBar closeOneSpati"
                onClick={closeMapSideBar}
              >
                X
              </div>

              {threeClosestSpatis == "" ? null : (
                <div className="backSpatiSidebar" onClick={backToNearestSpatis}>
                  ◄ back
                </div>
              )}
            </div>
            <div className="results">
              <div className="oneSpatiSideBar">
                {/* Render other information from clickedSpati */}

                <div className="firstDetailsSpatiList">
                  <h3>{clickedSpati.properties.description.toUpperCase()}</h3>
                  <p>{clickedSpati.properties.sternburg_price} a Sterni</p>
                  <p>{clickedSpati.properties.address}</p>
                  <p>
                    Today:{" "}
                    {getTodayOpeningHours(
                      clickedSpati.properties.opening_hours
                    )}
                  </p>
                </div>
                <div className="secondDetailsSpatiList">
                  <p>
                    {clickedSpati.properties.bench
                      ? "🪑 Has benches"
                      : "🪑 No benches"}
                  </p>
                  <p>
                    {clickedSpati.properties.toilette
                      ? "🚽 Has toilet"
                      : "🚽 No toilet"}
                  </p>
                  <p>
                    {clickedSpati.properties.card
                      ? "💳 Accepts card"
                      : "💳 No card"}
                  </p>
                </div>

                <div className="openHours">
                  <p>Monday: {clickedSpati.properties.opening_hours.monday}</p>
                  <p>
                    Tuesday: {clickedSpati.properties.opening_hours.tuesday}
                  </p>
                  <p>
                    Wednesday: {clickedSpati.properties.opening_hours.wednesday}
                  </p>
                  <p>
                    Thursday: {clickedSpati.properties.opening_hours.thursday}
                  </p>
                  <p>Friday: {clickedSpati.properties.opening_hours.friday}</p>
                  <p>
                    Saturday: {clickedSpati.properties.opening_hours.saturday}
                  </p>
                  <p>Sunday: {clickedSpati.properties.opening_hours.sunday}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {threeClosestSpatis === "" || !isSidebarOpen || clickedSpati ? null : (
          <div className="sidebar">
            <div id="sidebarTop">
              <div className="closeMapSideBar" onClick={closeMapSideBar}>
                X
              </div>
            </div>
            <div className="results">
              {threeClosestSpatis.map((spati, index) => (
                <div
                  key={index}
                  className="eachSpatiSideBar"
                  onClick={() =>
                    approximateSpationMap(
                      spati.geometry.coordinates[0],
                      spati.geometry.coordinates[1],
                      index
                    )
                  }
                >
                  <div className="firstDetailsSpatiList">
                    <h3>{spati.properties.description.toUpperCase()}</h3>
                    <p>{spati.properties.sternburg_price} a Sterni</p>
                    <p>{spati.properties.address}</p>
                    <p>
                      Today:{" "}
                      {getTodayOpeningHours(spati.properties.opening_hours)}
                    </p>
                  </div>
                  <div className="secondDetailsSpatiList">
                    <p>
                      {spati.properties.bench
                        ? "🪑 Has benches"
                        : "🪑 No benches"}
                    </p>
                    <p>
                      {spati.properties.toilette
                        ? "🚽 Has toilet"
                        : "🚽 No toilet"}
                    </p>
                    <p>
                      {spati.properties.card ? "💳 Accepts card" : "💳 No card"}
                    </p>
                  </div>

                  {specificSpatiClicked === index && (
                    <div className="openHours">
                      <p>Monday: {spati.properties.opening_hours.monday}</p>
                      <p>Tuesday: {spati.properties.opening_hours.tuesday}</p>
                      <p>
                        Wednesday: {spati.properties.opening_hours.wednesday}
                      </p>
                      <p>Thursday: {spati.properties.opening_hours.thursday}</p>
                      <p>Friday: {spati.properties.opening_hours.friday}</p>
                      <p>Saturday: {spati.properties.opening_hours.saturday}</p>
                      <p>Sunday: {spati.properties.opening_hours.sunday}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="addSpati">
        <h3>Can't find your favorite one?</h3>
        <button onClick={handleAddSpatiClick}>+ add new spati</button>
      </div>
      <footer>
        <p>
          {" "}
          <a href="">About Us</a>{" "}
        </p>{" "}
        <p>| </p>
        <p>
          <a href="">Contact</a>{" "}
        </p>
      </footer>
    </div>
  );
}

export default Mapbox;
