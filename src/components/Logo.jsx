import { useNavigate } from "react-router-dom";
import LogoPNG from '../assets/logo.png'



function Logo() {

  const navigate = useNavigate();

  const goToHome = () => {
    console.log("etrei");
    navigate("/");
  };
  return (
    <img onClick={() => goToHome()} src={LogoPNG} alt="" width="200px" height="100px"></img>
      );
    }
    
    export default Logo;