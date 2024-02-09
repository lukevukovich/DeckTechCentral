import "../pages/Pages.css";
import {
  faSearch,
  faMultiply,
  faUser,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { awaitLoginStatus } from "../oauth/User";

//DTC Header that appears on every page
export default function DTCHeader({
  id,
  inputText,
  inputValue,
  inputOnChange,
  isToggled,
  setIsToggled,
  search,
  clearSearch,
  numResults,
  navigate,
}) {
  //Set toggle and search setting
  function toggleSearch() {
    setIsToggled(!isToggled);

    const searchBar = document.getElementById(`search-bar-${id}`);
    if (isToggled) {
      searchBar.placeholder = "Search deck list...";
    } else {
      searchBar.placeholder = "Search card...";
    }
  }

  //Handle onKeyDown for input/searchbar component
  function inputOnKeyDown(e) {
    if (e.key === "Enter") {
      search();
    } else if (e.key == "ArrowLeft" && isToggled) {
      toggleSearch();
    } else if (e.key == "ArrowRight" && !isToggled) {
      toggleSearch();
    }
  }

  //Check for Google login, set popup
  async function handleCreateDeckButton() {
    const status = await awaitLoginStatus();
    if (status) {
      console.log("Can create deck");
      navigate("/createdeck");
    } else {
      console.log("Cannot create deck");
      navigate("/profile");
    }
  }

  return (
    <div id={id}>
      <div id={`header-${id}`}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <text id={`heading-${id}`} className="heading">
            DeckTechCentral
          </text>
        </Link>
        <div id={`search-panel-${id}`} className="search-panel">
          <button id={`go-${id}`} onClick={search}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <input
            id={`search-bar-${id}`}
            placeholder={inputText}
            autoComplete="off"
            onKeyDown={(e) => {
              inputOnKeyDown(e);
            }}
            value={inputValue}
            onChange={(e) => inputOnChange(e.target.value)}
          ></input>
          <input
            type="checkbox"
            id={`checkbox-${id}`}
            className="checkbox"
            checked={isToggled}
            onChange={() => {}}
          ></input>
          <label
            id={`checkbox-toggle-${id}`}
            htmlFor={`checkbox-${id}`}
            className="checkbox-toggle"
            onChange={toggleSearch}
            onClick={toggleSearch}
          ></label>
          <button
            id={`clear-${id}`}
            className="button-clear"
            onClick={clearSearch}
          >
            <FontAwesomeIcon icon={faMultiply} />
          </button>
          <div id={`profile-panel-${id}`} className="profile-panel">
            <button
              id={`create-deck-${id}`}
              className="create-deck-button"
              onClick={handleCreateDeckButton}
            >
              <FontAwesomeIcon icon={faScrewdriverWrench} />
            </button>
            <button
              id={`profile-${id}`}
              className="profile-button"
              onClick={() => navigate("/profile")}
            >
              <FontAwesomeIcon icon={faUser} />
            </button>
          </div>
        </div>
        <text id="num-decks" className="num-results">
          {numResults}
        </text>
      </div>
      <label id={`user-popup-${id}`} className="user-popup"></label>
    </div>
  );
}
