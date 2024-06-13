import { SearchBox } from "@mapbox/search-js-react";
import { useEffect, useState } from "react";
import Checkbox from "./Checkbox";
const tokenMapBox = import.meta.env.VITE_ACCESS_TOKEN

// eslint-disable-next-line react/prop-types
export default function Search({ addMarkersOnMap, handleCheckBox }) {
  const [value, setValue] = useState("");
  function handleSearch(e) {
    //get the coordanates of the adreess typed
    setValue((prevState) => e.features[0].properties.full_address);
    addMarkersOnMap(e.features[0].geometry.coordinates,value);
  }

  const handleInnerCheckBox = (benches, toilet, card) => {
  
    console.log("in Search we are checking if we are passing the vars to the mother: " + benches, toilet, card)
   return handleCheckBox(benches, toilet, card);
  }

  
  return (
    <form>
      <SearchBox
        value={value}
        onRetrieve={handleSearch}
        accessToken={tokenMapBox}
      />

    <Checkbox handleCheckBox={handleInnerCheckBox} />

    </form>
  );
}
