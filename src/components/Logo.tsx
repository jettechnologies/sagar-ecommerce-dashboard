// import { Link } from "react-router-dom";
import logo from "@/assets/icons/logo.png";


export default function Logo() {
  return (
    <div className="w-[11rem] h-[2rem]">
      {/* <img src={logo} alt="the logo of Commerce" />
      <h1>Thegearmates</h1> */}
      <img src = {logo} alt="the gearmate logo" className="w-full h-full object-cover"/>
    </div>
  );
}
