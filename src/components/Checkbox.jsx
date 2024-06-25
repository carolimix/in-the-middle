import { useEffect, useState } from "react";
// eslint-disable-next-line react/prop-types
export default function Checkbox({ handleCheckBox }) {
  const [checkedBenches, setCheckedBenches] = useState(false);
  const [checkedToilet, setCheckedToilet] = useState(false);
  const [checkedCard, setCheckedCard] = useState(false);

  const handleChangeCheckboxFilter = (inputChecked) => {
    if (inputChecked.target.name === "benches") {
      setCheckedBenches(!checkedBenches);
    }

    if (inputChecked.target.name === "toilet") {
      setCheckedToilet(!checkedToilet);
    }

    if (inputChecked.target.name === "card") {
      setCheckedCard(!checkedCard);
    }
  };

  useEffect(() => {
    handleCheckBox(checkedBenches, checkedToilet, checkedCard);
  }, [checkedBenches, checkedToilet, checkedCard]);

  return (
    <>
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
    </>
  );
}
