import { useNavigate } from "react-router-dom";




function Logo() {

  const navigate = useNavigate();

  const goToHome = () => {
    console.log("etrei");
    navigate("/");
  };
    return (
        <img onClick={() => goToHome()} src="src/assets/logo.png" alt="" width="200px" height="100px"></img>
      );
    }
    
    export default Logo;