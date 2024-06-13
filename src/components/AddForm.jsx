import { useState, useEffect, useRef } from "react";
import Search from "./Search.jsx";
//import emailjs from "@emailjs/browser";

const AddForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    coordinates: "",
    hasToilette: "",
    hasTable: "",
    sellsFood: "",
    hasAtm: "",
    hasCardPayment: "",
    sterniPrice: "",
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please, fill out every field");
      return;
    }

    const data = {
      ...formData,
    };
    console.log(data);
  };
  /* 
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', data, 'YOUR_USER_ID')
    .then((result) => {
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
};  */

  const handleSearch = (coordinates,value) => {
    console.log(coordinates, value);
     setFormData((prevState) => ({
    ...prevState,
     coordinates,
  })); 
  };

  const handleOnChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value !== "");
  };

  const generatePriceOptions = () => {
    const options = [];
    for (let price = 0.7; price <= 3.0; price += 0.05) {
      options.push(
        <option key={price.toFixed(2)} value={price.toFixed(2) + "€"}>
          {price.toFixed(2)}€
        </option>
      );
    }
    return options;
  };

  return (
    <div>
      <h1>Is your favorite spati missing?</h1>
      <h2>Fill out the information here and we will added to our map</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='name'>Name:</label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleOnChange}
          />
        </div>
        
        <div>
          <label htmlFor='address'>Address:</label>
          <Search addMarkersOnMap={handleSearch} />
          <div style={{ marginBottom: "10px" }} />
          </div>
        <div>
          <h3>Extra info</h3>
          <legend>Does it have a toilette?</legend>
          <label>
            <input
              type='radio'
              name='hasToilette'
              value='yes'
              checked={formData.hasToilette === "yes"}
              onChange={handleOnChange}
            />{" "}
            Yes
          </label>
          <label>
            <input
              type='radio'
              name='hasToilette'
              value='no'
              checked={formData.hasToilette === "no"}
              onChange={handleOnChange}
            />{" "}
            No
          </label>

          <legend>Does it have tables outside?</legend>
          <label>
            <input
              type='radio'
              name='hasTable'
              value='yes'
              checked={formData.hasTable === "yes"}
              onChange={handleOnChange}
            />{" "}
            Yes
          </label>
          <label>
            <input
              type='radio'
              name='hasTable'
              value='no'
              checked={formData.hasTable === "no"}
              onChange={handleOnChange}
            />{" "}
            No
          </label>

          <legend>Does it sells food?e.g bakery items</legend>
          <label>
            <input
              type='radio'
              name='sellsFood'
              value='yes'
              checked={formData.sellsFood === "yes"}
              onChange={handleOnChange}
            />{" "}
            Yes
          </label>
          <label>
            <input
              type='radio'
              name='sellsFood'
              value='no'
              checked={formData.sellsFood === "no"}
              onChange={handleOnChange}
            />{" "}
            No
          </label>

          <legend>Is there an ATM?</legend>
          <label>
            <input
              type='radio'
              name='hasAtm'
              value='yes'
              checked={formData.hasAtm === "yes"}
              onChange={handleOnChange}
            />{" "}
            Yes
          </label>
          <label>
            <input
              type='radio'
              name='hasAtm'
              value='no'
              checked={formData.hasAtm === "no"}
              onChange={handleOnChange}
            />{" "}
            No
          </label>

          <legend>Is card payment available?</legend>
          <label>
            <input
              type='radio'
              name='hasCardPayment'
              value='yes'
              checked={formData.hasCardPayment === "yes"}
              onChange={handleOnChange}
            />{" "}
            Yes
          </label>
          <label>
            <input
              type='radio'
              name='hasCardPayment'
              value='no'
              checked={formData.hasCardPayment === "no"}
              onChange={handleOnChange}
            />{" "}
            No
          </label>
<div>
          <label htmlFor='sterniPrice'>Sterni Price:</label>
          <select
            name='sterniPrice'
            id='sterniPrice'
            value={formData.sterniPrice}
            onChange={handleOnChange}
          >
            <option value=''>Select price</option>
            {generatePriceOptions()}
          </select>
          </div>
        </div>
        <button type='submit' disabled={!isFormValid}>
          Submit
        </button>{" "}
      </form>
    </div>
  );
};

export default AddForm;
