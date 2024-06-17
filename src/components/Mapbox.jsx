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
  const [isSpecificSpatiClicked, setisSpecificSpatiClicked] = useState(false);
  

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
    console.log("use effect renderizando")
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
    console.log("distance")
    console.log(distance)
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

    console.log(sortedSpatisNear)

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

  function closeMapSideBar(e) {
    setSidebarOpen(false);
  }

  function approximateSpationMap(a, b) {

    setisSpecificSpatiClicked(true);

    map.current.flyTo({
      center: [a, b],
      zoom:16,
    });


  }


  return (
    <div>
      <Search
        addMarkersOnMap={addMarkersOnMap}
        handleCheckBox={handleCheckBox}
      />


      <div ref={mapContainer} className="map-container">

      {threeClosestSpatis === "" || !isSidebarOpen ? null : (
      <div id="sidebar">
        <div id="closeMapSideBar" onClick={closeMapSideBar}>X</div>
          <div id="results">
          
          <div className="eachSpatiSideBar" onClick={() => approximateSpationMap(threeClosestSpatis[0].geometry.coordinates[0],threeClosestSpatis[0].geometry.coordinates[1])}>
             <h3>{threeClosestSpatis[0].properties.description.toUpperCase()}</h3>
             <p>{threeClosestSpatis[0].properties.sternburg_price} a Sterni</p>
             <p>{threeClosestSpatis[0].properties.address}</p>
             <p>{threeClosestSpatis[0].properties.benches == true ? "Has benches" : false}</p>
             <p> {threeClosestSpatis[0].properties.toilette == true ? "Has toilet" : false}</p>
             <p> {threeClosestSpatis[0].properties.card == true ? "Accept card" : false} </p>

             <p>Today:
              {date.getDay() == 0 ? 
             threeClosestSpatis[0].properties.opening_hours.sunday : 
             (date.getDay() == 1 ?
             threeClosestSpatis[0].properties.opening_hours.monday :
             (date.getDay == 2 ?
             threeClosestSpatis[0].properties.opening_hours.tuesday :
             (date.getDay == 3 ?
             threeClosestSpatis[0].properties.opening_hours.wednesday :
             (date.getDay == 4 ?
             threeClosestSpatis[0].properties.opening_hours.thursday :
             (date.getDay == 5 ?
             threeClosestSpatis[0].properties.opening_hours.friday :
             (date.getDay == 6 ?
             threeClosestSpatis[0].properties.opening_hours.saturday : "no information found"
            )
          )))))
          }</p>

          {!isSpecificSpatiClicked ? false : (
            <p>extra!</p>
          )
          }
          </div>

          <div className="eachSpatiSideBar" onClick={() => approximateSpationMap(threeClosestSpatis[1].geometry.coordinates[0],threeClosestSpatis[1].geometry.coordinates[1])}>
             <h3>{threeClosestSpatis[1].properties.description.toUpperCase()}</h3>
             <p>{threeClosestSpatis[1].properties.sternburg_price} a Sterni</p>
             <p>{threeClosestSpatis[1].properties.address} a Sterni</p>
             <p>{threeClosestSpatis[1].properties.benches == true ? "Has benches" : false}</p>
             <p> {threeClosestSpatis[1].properties.toilette == true ? "Has toilet" : false}</p>
             <p> {threeClosestSpatis[1].properties.card == true ? "Accept card" : false} </p>
             <p>Today:
              {date.getDay() == 0 ? 
             threeClosestSpatis[0].properties.opening_hours.sunday : 
             (date.getDay() == 1 ?
             threeClosestSpatis[0].properties.opening_hours.monday :
             (date.getDay == 2 ?
             threeClosestSpatis[0].properties.opening_hours.tuesday :
             (date.getDay == 3 ?
             threeClosestSpatis[0].properties.opening_hours.wednesday :
             (date.getDay == 4 ?
             threeClosestSpatis[0].properties.opening_hours.thursday :
             (date.getDay == 5 ?
             threeClosestSpatis[0].properties.opening_hours.friday :
             (date.getDay == 6 ?
             threeClosestSpatis[0].properties.opening_hours.saturday : ""
            )
          )))))
          }</p>
          </div>

          <div className="eachSpatiSideBar" onClick={() => approximateSpationMap(threeClosestSpatis[2].geometry.coordinates[0],threeClosestSpatis[2].geometry.coordinates[1])}>
             <h3>{threeClosestSpatis[2].properties.description.toUpperCase()}</h3>
             <p>{threeClosestSpatis[2].properties.sternburg_price} a Sterni</p>
             <p>{threeClosestSpatis[2].properties.address}</p>
             <p>{threeClosestSpatis[2].properties.benches == true ? "Has benches" : false}</p>
             <p> {threeClosestSpatis[2].properties.toilette == true ? "Has toilet" : false}</p>
             <p> {threeClosestSpatis[2].properties.card == true ? "Accept card" : false} </p>
             <p>Today:
              {date.getDay() == 0 ? 
             threeClosestSpatis[0].properties.opening_hours.sunday : 
             (date.getDay() == 1 ?
             threeClosestSpatis[0].properties.opening_hours.monday :
             (date.getDay == 2 ?
             threeClosestSpatis[0].properties.opening_hours.tuesday :
             (date.getDay == 3 ?
             threeClosestSpatis[0].properties.opening_hours.wednesday :
             (date.getDay == 4 ?
             threeClosestSpatis[0].properties.opening_hours.thursday :
             (date.getDay == 5 ?
             threeClosestSpatis[0].properties.opening_hours.friday :
             (date.getDay == 6 ?
             threeClosestSpatis[0].properties.opening_hours.saturday : ""
            )
          )))))
          }</p>
          </div>
          </div>
      </div>
      )}

</div>


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
