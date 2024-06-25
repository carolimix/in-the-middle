import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { Outlet } from "react-router-dom";
import { SearchBox } from "@mapbox/search-js-react";
import Logo from "./Logo.jsx";
const tokenMapBox = import.meta.env.VITE_ACCESS_TOKEN;
const publicId = import.meta.env.VITE_EMAILJS_KEY;
import "../Search.css";
import "../index.css";

const AddForm = () => {
  const [value, setValue] = useState("");
  const [errorFormValidation, setErrorFormValidation] = useState("");
  const [sendingForm, setSendingForm] = useState("");
  const [isFormSent, setIsFormSent] = useState(false);
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
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    console.log(event);
    event.preventDefault();
    if (!isFormValid()) {
      setErrorFormValidation("⚠️ Please, fill out every field!");
    } else {
      setErrorFormValidation("");
      setSendingForm("🔄 The form is being processed!");
      handleEmail();
    }
  };
  const handleNewSpati = () => {
    navigate("/add/newspati");
  };
  const handleEmail = () => {
    console.log(publicId);

    const data = { ...formData };
    emailjs
      .send(
        import.meta.env.VITE_YOUR_SERVICE_ID,
        import.meta.env.VITE_YOUR_TEMPLATE_ID,
        data,
        { publicKey: import.meta.env.VITE_EMAILJS_KEY }
      )
      .then(
        (result) => {
          setSendingForm("");
          setIsFormSent(true);
          handleNewSpati();
          window.scrollTo({
            top: 0,
            behavior: "smooth", // Optional: smooth scrolling behavior
          });
          console.log("Email sent:", result.text);
        },
        (error) => {
          setSendingForm("");
          setErrorFormValidation(
            "An error occurred on our server. Please try again later!"
          );
          console.log(error);
        }
      );
  };
  const handleSearch = (coordinates, value) => {
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

  const comeBackToTheForm = () => {
    setIsFormSent(false);
    formData.name = "";
    formData.coordinates = "";
    formData.hasToilette = "";
    formData.hasTable = "";
    formData.sellsFood = "";
    formData.hasAtm = "";
    formData.hasCardPayment = "";
    formData.sterniPrice = "";
    console.log(formData);
  };
  return (
    <div>
      <div id="addForm">
        <Logo />

        {isFormSent ? (
          <div id="backToTheSpati">
            <a onClick={() => comeBackToTheForm()}> ◄ back to the form</a>
          </div>
        ) : (
          <div id="formContent">
            <h1>Is your favorite späti missing?</h1>
            <h2>
              Fill out the information below and we will add it to our map :)
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="addFormSession">
                <label htmlFor="name">Name:</label>
                <input
                  className="addSpatiInput"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleOnChange}
                />
              </div>
              <div className="addFormSession">
                <label htmlFor="address">Address:</label>
                <SearchBox
                  className="inputSearch"
                  value={value}
                  onRetrieve={handleSearch}
                  accessToken={tokenMapBox}
                />
              </div>
              <div>
                <h3>Extra info:</h3>
                <div className="addFormSession">
                  <legend>Does it have a toilette?</legend>
                  <label>
                    <input
                      type="radio"
                      name="hasToilette"
                      value="yes"
                      checked={formData.hasToilette === "yes"}
                      onChange={handleOnChange}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="hasToilette"
                      value="no"
                      checked={formData.hasToilette === "no"}
                      onChange={handleOnChange}
                    />{" "}
                    No
                  </label>
                </div>

                <div className="addFormSession">
                  <legend>Does it have tables outside?</legend>
                  <label>
                    <input
                      type="radio"
                      name="hasTable"
                      value="yes"
                      checked={formData.hasTable === "yes"}
                      onChange={handleOnChange}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="hasTable"
                      value="no"
                      checked={formData.hasTable === "no"}
                      onChange={handleOnChange}
                    />{" "}
                    No
                  </label>
                </div>

                <div className="addFormSession">
                  <legend>Does it sells food? e.g bakery items</legend>
                  <label>
                    <input
                      type="radio"
                      name="sellsFood"
                      value="yes"
                      checked={formData.sellsFood === "yes"}
                      onChange={handleOnChange}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="sellsFood"
                      value="no"
                      checked={formData.sellsFood === "no"}
                      onChange={handleOnChange}
                    />{" "}
                    No
                  </label>
                </div>
                <div className="addFormSession">
                  <legend>Is there an ATM?</legend>
                  <label>
                    <input
                      type="radio"
                      name="hasAtm"
                      value="yes"
                      checked={formData.hasAtm === "yes"}
                      onChange={handleOnChange}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="hasAtm"
                      value="no"
                      checked={formData.hasAtm === "no"}
                      onChange={handleOnChange}
                    />{" "}
                    No
                  </label>
                </div>
                <div className="addFormSession">
                  <legend>Is card payment available?</legend>
                  <label>
                    <input
                      type="radio"
                      name="hasCardPayment"
                      value="yes"
                      checked={formData.hasCardPayment === "yes"}
                      onChange={handleOnChange}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="hasCardPayment"
                      value="no"
                      checked={formData.hasCardPayment === "no"}
                      onChange={handleOnChange}
                    />{" "}
                    No
                  </label>
                </div>
                <div className="addFormSession">
                  <label htmlFor="sterniPrice">Sterni Price:</label>
                  <select
                    name="sterniPrice"
                    id="sterniPrice"
                    value={formData.sterniPrice}
                    onChange={handleOnChange}
                  >
                    <option value="">Select price</option>
                    {generatePriceOptions()}
                  </select>
                </div>
              </div>
              <button
                id="buttonAddSpati"
                type="submit"
                onClick={(event) => handleSubmit(event)}
              >
                Submit
              </button>
              <span className="loading">{sendingForm}</span>
              <span className="errorValidation">{errorFormValidation}</span>
            </form>
          </div>
        )}

        {!isFormSent ? false : <Outlet />}
      </div>
      <footer>
        <p>
          {" "}
          <a href="">About Us</a>{" "}
        </p>{" "}
        <p>| </p>
        <p>
          <a href="">Contact</a>{" "}
        </p>
      </footer>
    </div>
  );
};
export default AddForm;
