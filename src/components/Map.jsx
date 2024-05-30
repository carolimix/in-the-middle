import { useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const apiKey = import.meta.env.REACT_APP_MAPTILER_API_KEY;
const Map = () => {
  const [locationA, setLocationA] = useState('');
  const [locationB, setLocationB] = useState('');
  const [middlePoint, setMiddlePoint] = useState(null);

  const fetchLocation = async (query) => {
    const apiUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?autocomplete=true&fuzzyMatch=true&key=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const center = data.features[0].center;
    console.log(`Coordinates of ${query}:`, center);
    return center;
  };

  const fetchReverseLocation = async (longitude, latitude) => {
    const apiUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(longitude + ',' + latitude)}.json?key=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const locationName = data.features[0].place_name;
    console.log(`Coordinates of ${longitude}${latitude}:`, locationName);
    return locationName;
  };

  const handleFindMiddlePoint = async () => {
    try {
      const locationACoordinates = await fetchLocation(locationA);
      const locationBCoordinates = await fetchLocation(locationB);
      const middlePointCoordinates = [
        (locationACoordinates[0] + locationBCoordinates[0]) / 2,
        (locationACoordinates[1] + locationBCoordinates[1]) / 2,
      ];

      const middlePointName = await fetchReverseLocation(middlePointCoordinates[0], middlePointCoordinates[1]);

      setMiddlePoint({
        coordinates: middlePointCoordinates,
        name: middlePointName,
      });
    } catch (error) {
      console.error('Error:', error.message);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <div id="search">
        <div id="pointA">
          <label htmlFor="inputA">Point A:</label>
          <input
            type="text"
            id="inputA"
            value={locationA}
            onChange={(e) => setLocationA(e.target.value)}
          />
        </div>
        <div id="pointB">
          <label htmlFor="inputB">Point B:</label>
          <input
            type="text"
            id="inputB"
            value={locationB}
            onChange={(e) => setLocationB(e.target.value)}
          />
        </div>
        <button onClick={handleFindMiddlePoint}>Find a middle point</button>
      </div>
      <div id="map">
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '400px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {middlePoint && (
            <Marker position={middlePoint.coordinates}>
              <Popup>
                The middle point is: <br />
                {middlePoint.name}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
