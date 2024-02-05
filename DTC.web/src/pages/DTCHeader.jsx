import "./Pages.css";
import {
  faSearch,
  faMultiply,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";


export default function DTCHeader({
  id,
  inputText,
  inputValue,
  inputOnChange,
  isToggled,
  search,
  toggleSearch,
  clearSearch,
  numResults,
  navigate,
}) {
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
              if (e.key === "Enter") {
                search();
              }
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
          <button
            id={`profile-${id}`}
            className="button-profile"
            onClick={() => navigate("/profile")}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
        <text id="num-decks" className="num-results">
          {numResults}
        </text>
      </div>
      <label id={`user-popup-${id}`} className="user-popup"></label>
    </div>
  );
}
