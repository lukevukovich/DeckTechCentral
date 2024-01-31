import { useState } from "react";
import "./Profile.css";
import "./Pages.css";
import {
  faSearch,
  faMultiply,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Login from "../oauth/Login";
import Logout from "../oauth/Logout";
import { gapi } from "gapi-script";

export default function Profile() {
  const navigate = useNavigate();

  //Use state for input
  const [input, setInput] = useState("");

  //Use state for search toggle
  const [isToggled, setIsToggled] = useState(true);

  function search() {
    z;
    if (input != "" && input.length <= 40) {
      if (isToggled) {
        navigate(`/decksearch?q=${input}`);
        setInput("");
      } else {
        navigate(`/cardsearch?q=${input}`);
        setInput("");
      }
    }
  }

  //Clear search
  function clearSearch() {
    setInput("");
  }

  //Set toggle and search setting
  function toggleSearch() {
    setIsToggled(!isToggled);

    const searchBar = document.getElementById("search-bar-pf");
    if (!isToggled) {
      searchBar.placeholder = "Search deck list...";
    } else {
      searchBar.placeholder = "Search card...";
    }
  }

  // Create all components
  return (
    <div id="pf">
      <div id="header-pf">
        <Link to="/" style={{ textDecoration: "none" }}>
          <text id="heading-pf" className="heading">
            DeckTechCentral
          </text>
        </Link>
        <div id="search-panel-pf" className="search-panel">
          <button
            id="profile-pf"
            className="button"
            onClick={() => navigate("/profile")}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button id="go-pf" onClick={() => search()}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <input
            id="search-bar-pf"
            placeholder="Search deck list..."
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                search();
              }
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></input>
          <input type="checkbox" id="checkbox-pf" className="checkbox"></input>
          <label
            id="checkbox-toggle-pf"
            htmlFor="checkbox-pf"
            className="checkbox-toggle"
            checked={isToggled}
            onChange={toggleSearch}
            onClick={() => toggleSearch()}
          ></label>
          <button
            id="clear-pf"
            className="button-clear"
            onClick={() => clearSearch()}
          >
            <FontAwesomeIcon icon={faMultiply} />
          </button>
        </div>
      </div>
      <div className="oauth">
        <Login id="login"></Login>
        <Logout id="logout" className="oauth"></Logout>
      </div>
    </div>
  );
}
