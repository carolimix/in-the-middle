import { SearchBox } from "@mapbox/search-js-react";
import { useState } from "react";
const tokenMapBox = import.meta.env.VITE_ACCESS_TOKEN

// eslint-disable-next-line react/prop-types
export default function Search({ addMarkersOnMap }) {
  const [value, setValue] = useState("");
  function handleSearch(e) {
    //get the coordanates of the adreess typed
    setValue((prevState) => e.features[0].properties.full_address);
    addMarkersOnMap(e.features[0].geometry.coordinates,value);
  }

  return (
    <form>
      <SearchBox
        value={value}
        onRetrieve={handleSearch}
        accessToken={tokenMapBox}
      />
    </form>
  );
}
