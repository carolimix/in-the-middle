import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Mapbox from "./components/Mapbox";
import AddForm from "./components/AddForm";



function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Mapbox />} />
          <Route path='/add' element={<AddForm />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
