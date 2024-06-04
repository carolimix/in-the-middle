import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Mapbox from "./components/Mapbox";
import Map from "./Map";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Map />} />
          {/* <Route path="/map" element={<Map />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
