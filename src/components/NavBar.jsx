import NavBarStyles from "../css-modules/NavBar.module.css";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const dropdown = useRef(null);
  const navigate = useNavigate();
  function toggleDropdown(e) {
    console.log(e.target);
    console.log(dropdown.current);
    e.target.classList.toggle(NavBarStyles["open"]);
    dropdown.current.classList.toggle(NavBarStyles["visible"]);
    dropdown.current.classList.toggle(NavBarStyles["not-visible"]);
  }
  return (
    <nav className={NavBarStyles["nav-bar"]}>
      <h1>WHERE IS WALDO</h1>
      <img src="./dropdown-icon.svg" onClick={toggleDropdown} />
      <ul ref={dropdown} className={NavBarStyles["not-visible"]}>
        <li
          onClick={() => {
            navigate("/");
          }}
        >
          Homepage
        </li>
        <li
          onClick={() => {
            navigate("/leaderBoard");
          }}
        >
          Leader Board
        </li>
      </ul>
    </nav>
  );
}
