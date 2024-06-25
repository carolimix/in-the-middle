import { useNavigate } from "react-router-dom";

function Logo() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };
  return (
    <div
      onClick={() => goToHome()}
      className="img-logo"
      alt=""
      width="200px"
      height="100px"
    ></div>
  );
}

export default Logo;
