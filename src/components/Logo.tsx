import { Link } from "react-router-dom";
import logo from "../assets/icons/logo.svg";

export default function Logo() {
  return (
    <Link to="/" className="flex gap-1 text-xl font-semibold items-center">
      <img src={logo} alt="the logo of Commerce" />
      <h1>Sagar stores</h1>
    </Link>
  );
}
