import { SearchBox } from "@mapbox/search-js-react";
import { useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import Logo from "./Logo";
import "../Search.css";
const tokenMapBox = import.meta.env.VITE_ACCESS_TOKEN;

// eslint-disable-next-line react/prop-types
export default function Search({ addMarkersOnMap, handleCheckBox }) {
  const [value, setValue] = useState("");
  function handleSearch(e) {
    //get the coordanates of the adreess typed
    setValue((prevState) => e.features[0].properties.full_address);
    addMarkersOnMap(e.features[0].geometry.coordinates, null);
  }

  const handleInnerCheckBox = (benches, toilet, card) => {
    return handleCheckBox(benches, toilet, card);
  };

  return (
    <form className="mainForm">
      <div className="flex-container">
        <div className="item1">
          <Logo />
        </div>

        <div className="item2">
          <SearchBox
            className="inputSearch"
            value={value}
            onRetrieve={handleSearch}
            accessToken={tokenMapBox}
          />
        </div>

        <div className="item3">
          <Checkbox handleCheckBox={handleInnerCheckBox} />{" "}
        </div>
      </div>
    </form>
  );
}
