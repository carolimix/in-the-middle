import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Mapbox from "./components/Mapbox";
import Mapbox from "../src/components/Mapbox";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Mapbox />} />
          {/* <Route path="/map" element={<Map />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
