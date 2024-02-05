import { useState, useEffect } from "react";
import "./DeckSearch.css";
import "../Pages.css";
import {
  faSearch,
  faMultiply,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { awaitLoginStatus, getUserInfo, setUserPopup } from "../../oauth/User";

export default function DeckSearch() {
  //Set working variables
  const navigate = useNavigate();
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  //Use state for search toggle
  const [isToggled, setIsToggled] = useState(false);

  //Set initial search text based on dashboard
  const [searchText, setSearchText] = useState(searchParams.get("q"));

  //Use state for deck name search value
  const [deckName, setDeckName] = useState(searchText);

  const [numDecks, setNumDecks] = useState("");

  //Check for Google login, set popup
  async function checkLogin() {
    const s = await awaitLoginStatus();
    if (s) {
      const u = getUserInfo();
      setUserPopup(u, "ds");
    } else {
      setUserPopup(null, "ds");
    }
  }

  //Set toggle and search setting
  function toggleSearch() {
    setIsToggled(!isToggled);

    const searchBar = document.getElementById("search-bar-ds");
    if (isToggled) {
      searchBar.placeholder = "Search deck list...";
    } else {
      searchBar.placeholder = "Search card...";
    }
  }

  //Check search toggle and handle accordingly
  function checkSearchToggle() {
    if (deckName != "" && deckName.length <= 40) {
      if (isToggled) {
        navigate(`/cardsearch?q=${deckName}`);
      } else {
        searchDeck();
      }
    }
  }

  useEffect(() => {
    //Check for login and set popup
    checkLogin();

    // Call searchCard when searchText changes
    if (searchText != null) {
      searchDeck();
    }
  }, [searchText]);

  const searchDeck = async () => {
    navigate(`/decksearch?q=${deckName}`);
    setNumDecks("Deck search for '" + deckName.toLowerCase() + "'");
  };

  //Clear search and image list
  function clearSearch() {
    setDeckName("");
  }

  //Create all components
  return (
    <div id="ds">
      <div id="header-ds">
        <Link to="/" style={{ textDecoration: "none" }}>
          <text id="heading-ds" className="heading">
            DeckTechCentral
          </text>
        </Link>
        <div id="search-panel-ds" className="search-panel">
          <button id="go-ds" onClick={checkSearchToggle}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <input
            id="search-bar-ds"
            placeholder="Search deck list..."
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                checkSearchToggle();
              }
            }}
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
          ></input>
          <input
            type="checkbox"
            id="checkbox-ds"
            className="checkbox"
            checked={isToggled}
            onChange={() => {}}
          ></input>
          <label
            id="checkbox-toggle-ds"
            htmlFor="checkbox-ds"
            className="checkbox-toggle"
            onChange={toggleSearch}
            onClick={toggleSearch}
          ></label>
          <button
            id="clear-ds"
            className="button-clear"
            onClick={clearSearch}
          >
            <FontAwesomeIcon icon={faMultiply} />
          </button>
          <button
            id="profile-ds"
            className="button-profile"
            onClick={() => navigate("/profile")}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
        <text id="num-decks" className="num-results">
          {numDecks}
        </text>
      </div>
      <label id="user-popup-ds" className="user-popup"></label>
    </div>
  );
}