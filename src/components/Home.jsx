import { useState } from "react";

function Home() {
  const [pointA, setPointA] = useState("");
  const [pointB, setPointB] = useState("");
  const [category, setCategory] = useState("bar");

  const handlePointAChange = (e) => {
    setPointA(e.target.value);
  };

  const handlePointBChange = (e) => {
    setPointB(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call a function to find the middle point and redirect to the map page
  };

  return (
    <div id="search">
      <form onSubmit={handleSubmit}>
        <div id="pointA">
          <label htmlFor="inputA">Point A:</label>
          <input
            type="text"
            id="inputA"
            value={pointA}
            onChange={handlePointAChange}
          />
        </div>
        <div id="pointB">
          <label htmlFor="inputB">Point B:</label>
          <input
            type="text"
            id="inputB"
            value={pointB}
            onChange={handlePointBChange}
          />
        </div>
        <div id="categoryDropdown">
          <label htmlFor="categories">Select a category:</label>
          <select
            id="categories"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="bar">Bar</option>
            <option value="restaurant">Restaurant</option>
            <option value="museum">Museum</option>
            <option value="cafe">Cafe</option>
            <option value="park">Park</option>
            <option value="art">Art</option>
          </select>
        </div>
        <button type="submit">Find a middle point</button>
      </form>
    </div>
  );
}

export default Home;
