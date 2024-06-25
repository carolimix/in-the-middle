import "../index.css";
import { useNavigate } from "react-router-dom";

function NewSpati() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div id="formSuccessSent">
      <h1 className="blue">
        We received your info. <br />{" "}
        <span className="red">Cheers for collaborating! 🍻</span>{" "}
      </h1>
      <div id="searchSpati">
        <a onClick={() => goToHome()}>🔍 Find a Späti</a>
      </div>
    </div>
  );
}

export default NewSpati;
