import { SearchBox } from "@mapbox/search-js-react";
import { useState } from "react";
const tokenMapBoxx =
  "pk.eyJ1IjoicHJpc2NpbGFmbG9yZXMiLCJhIjoiY2x3eHRzNGtwMWI0MjJ6cjFkYWpoMGlmOSJ9.jzw0SE_Rivow1QJfHCzu3g";

// eslint-disable-next-line react/prop-types
export default function Search({ addMarkersOnMap }) {
  const [value, setValue] = useState("");
  function handleSearch(e) {
    //get the coordanates of the adreess typed
    setValue(e.features[0].properties.full_address);
    addMarkersOnMap(e.features[0].geometry.coordinates);
  }
  console.log("value", value);
  return (
    <form>
      <SearchBox
        value={value}
        onRetrieve={handleSearch}
        accessToken={tokenMapBoxx}
      />
    </form>
  );
}
