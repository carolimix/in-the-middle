import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Mapbox from "./components/Mapbox";
import AddForm from "./components/AddForm";
import NewSpati from "./components/NewSpati";



function App() {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<Mapbox />} />
          <Route path='/add' element={<AddForm />}>
          <Route path="newspati" element={<NewSpati />} />
          </Route>
        </Routes>
        </Router>
  );
}

export default App;
