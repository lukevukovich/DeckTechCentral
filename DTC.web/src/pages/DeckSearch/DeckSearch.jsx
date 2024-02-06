import { useState, useEffect } from "react";
import "./DeckSearch.css";
import "../Pages.css";
import { useNavigate } from "react-router-dom";
import { awaitLoginStatus, getUserInfo, setUserPopup } from "../../oauth/User";
import DTCHeader from "../DTCHeader";

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
    <div id="ds-all">
      <DTCHeader
        id="ds"
        inputText="Search deck list..."
        inputValue={deckName}
        inputOnChange={setDeckName}
        isToggled={isToggled}
        setIsToggled={setIsToggled}
        search={checkSearchToggle}
        toggleSearch={toggleSearch}
        clearSearch={clearSearch}
        numResults={numDecks}
        navigate={navigate}
      ></DTCHeader>
    </div>
  );
}
