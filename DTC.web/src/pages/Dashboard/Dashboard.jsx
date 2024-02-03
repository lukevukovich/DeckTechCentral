import { useState, useEffect } from "react";
import "./Dashboard.css";
import "../Pages.css";
import {
  faSearch,
  faMultiply,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { awaitLoginStatus, getUserInfo } from "../../oauth/User";

export default function Dashboard() {
  const navigate = useNavigate();

  //Use state for input
  const [input, setInput] = useState("");

  //Use state for search toggle
  const [isToggled, setIsToggled] = useState(true);

  //Set content of user popup info
  function setUserPopup(user) {
    const popup = document.getElementById("user-popup-db");
    if (user != null) {
      const basicProfile = user.getBasicProfile();
      const username = basicProfile.getEmail();
      popup.textContent = "User | " + username;
    } else {
      popup.textContent = "Guest | Login required";
    }
  }

  //Check for Google login, set popup
  async function checkLogin() {
    const s = await awaitLoginStatus();
    console.log("Is loggged in: " + s);

    if (s) {
      const u = getUserInfo();
      setUserPopup(u);
    } else {
      setUserPopup(null);
    }
  }

  useEffect(() => {
    //Check for login and set popup
    checkLogin();
  }, []);

  function search() {
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

    const searchBar = document.getElementById("search-bar-db");
    if (!isToggled) {
      searchBar.placeholder = "Search deck list...";
    } else {
      searchBar.placeholder = "Search card...";
    }
  }

  // Create all components
  return (
    <div id="db">
      <div id="header-db">
        <Link to="/" style={{ textDecoration: "none" }}>
          <text id="heading-db" className="heading">
            DeckTechCentral
          </text>
        </Link>
        <div id="search-panel-db" className="search-panel">
          <button id="go-db" onClick={() => search()}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <input
            id="search-bar-db"
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
          <input type="checkbox" id="checkbox-db" className="checkbox"></input>
          <label
            id="checkbox-toggle-db"
            htmlFor="checkbox-db"
            className="checkbox-toggle"
            checked={isToggled}
            onChange={toggleSearch}
            onClick={() => toggleSearch()}
          ></label>
          <button
            id="clear-db"
            className="button-clear"
            onClick={() => clearSearch()}
          >
            <FontAwesomeIcon icon={faMultiply} />
          </button>
          <button
            id="profile-db"
            className="button-profile"
            onClick={() => navigate("/profile")}
          >
            <FontAwesomeIcon icon={faUser}/>
          </button>
        </div>
      </div>
      <label id="user-popup-db" className="user-popup"></label>
      <text id="welcome-db">Welcome to DeckTechCentral.</text>
    </div>
  );
}
