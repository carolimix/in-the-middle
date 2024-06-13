import { SearchBox } from "@mapbox/search-js-react";
import { useEffect, useState } from "react";
const tokenMapBox = import.meta.env.VITE_ACCESS_TOKEN

// eslint-disable-next-line react/prop-types
export default function Search({ addMarkersOnMap }) {
  const [value, setValue] = useState("");
  function handleSearch(e) {
    //get the coordanates of the adreess typed
    setValue((prevState) => e.features[0].properties.full_address);
    addMarkersOnMap(e.features[0].geometry.coordinates,value);
  }

  const [checkedBenches, setCheckedBenches] = useState(false);
  const [checkedToilet, setCheckedToilet] = useState(false);
  const [checkedCard, setCheckedCard] = useState(false);

  const handleChangeCheckboxFilter = (inputChecked) => {

    if(inputChecked.target.name === "benches") {
      setCheckedBenches(!checkedBenches);
    }

    if(inputChecked.target.name === "toilet") {
    setCheckedToilet(!checkedToilet);
    }
    
    if(inputChecked.target.name === "card") {
      setCheckedCard(!checkedCard);
    }
  
  };

  useEffect(()=> {
    console.log("Benches: " + checkedBenches + " / Toilet: " + checkedToilet + " / Card: "+ checkedCard)
    
  }, [checkedBenches, checkedToilet, checkedCard])

  return (
    <form>
      <SearchBox
        value={value}
        onRetrieve={handleSearch}
        accessToken={tokenMapBox}
      />

<label>
        <input
          name="benches"
          type="checkbox"
          checked={checkedBenches}
          onChange={handleChangeCheckboxFilter}
        />
        has benches
      </label>

      <label>
        <input
          name="toilet"
          type="checkbox"
          checked={checkedToilet}
          onChange={handleChangeCheckboxFilter}
        />
        has toilet
      </label>

      <label>
        <input
          name="card"
          type="checkbox"
          checked={checkedCard}
          onChange={handleChangeCheckboxFilter}
        />
        accept card
      </label>


    </form>
  );
}
