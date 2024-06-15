import mapboxgl from "mapbox-gl";
import { geojson } from "../../data.js"; // mocked data
import { useRef, useEffect, useState } from "react";
import Search from "./Search.jsx";
import createMarker from "../utils/createMarker.js";
import { useNavigate } from "react-router-dom";

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

 
  const handleCheckBox = (benches, toilet, card) => {
    setBenches(benches)
    setToilet(toilet)
    setCard(card)

    console.log("Benches: " + benches + " Toilet: " + toilet + " Card: " + card)
    if (benches == true || toilet == true || card == true) {
    console.log("entrou no primeiro if")
    
   
     const filteredSpatis = spatis.filter((spati) => {
      console.log(spati.properties.toilette)
    return (benches ? spati.properties.bench == benches : null) || (toilet ? spati.properties.toilette == toilet : null) || (card ? spati.properties.card == card : null);
  });

    setSpatis(filteredSpatis);
    const markerss = spatis.map((n) => createMarker(n));
    setMarkers(markerss);
  
  }
    if (benches == false && toilet == false && card == false) {
      console.log("ENTROU")
      setSpatis(geojson.features)
      const markerss = spatis.map((n) => createMarker(n));
      setMarkers(markerss);
      
  }
  
}

useEffect(()=> {
  markers.forEach((m) => {
    m.addTo(map.current);
  });

  return () => {
    markers.forEach((m) => {
      m.remove();
    });
  };

}, [markers])

useEffect(()=> {

  handleCheckBox(benches, toilet, card)

}, [benches, toilet, card])

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
    map.current.jumpTo({
      center: [lng, lat],
      zoom: 12,
    });
  }, [lng, lat]);

 


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

  const navigate = useNavigate();

  const handleAddSpatiClick = () => {
    navigate("/add");
  };

  return (
    <div style={{ margin: "50px 50px 0 50px" }}>
      <Search addMarkersOnMap={addMarkersOnMap} handleCheckBox={handleCheckBox}/>
      <div ref={mapContainer} className='map-container' />
      <h1>Cant find your favorite one? Add it here:</h1>
      <button onClick={handleAddSpatiClick}>Add New Späti</button>
    </div>
  );
}

export default Mapbox;
