import "./DTCHeader.css";
import {
  faSearch,
  faMultiply,
  faUser,
  faFileEdit,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  showTooltip,
  hideTooltip,
  loadToolTip,
  clearTooltipTimeout,
} from "../Tooltip";
import { getLoginStatus } from "../../oauth/User";

//Max length of search
export const maxSearchLength = 40;

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
    }
  }

  //Check for Google login, determine if user can create deck
  async function handleCreateDeckButton() {
    const status = getLoginStatus();
    if (status) {
      navigate("/deck");
    } else {
      navigate("/profile");
    }
  }

  //Hide tooltip after page load
  useEffect(() => {
    loadToolTip(id);
  }, []);

  return (
    <div id={id}>
      <div id={`header-${id}`}>
        <Link
          to="/"
          style={{ textDecoration: "none" }}
          onClick={() => clearTooltipTimeout()}
          onMouseEnter={(e) => showTooltip(id, e, "Home page")}
          onMouseLeave={() => hideTooltip(id)}
        >
          <text id={`heading-${id}`} className="heading">
            <span className="heading-txt">DeckTechCentral</span>
            <span className="heading-logo">
              <FontAwesomeIcon icon={faHome} />
            </span>
          </text>
        </Link>
        <div id={`search-panel-${id}`} className="search-panel">
          <button
            id={`go-${id}`}
            onClick={() => {
              clearTooltipTimeout();
              search();
            }}
            onMouseEnter={(e) => showTooltip(id, e, "Search")}
            onMouseLeave={() => hideTooltip(id)}
          >
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
            onClick={() => {
              clearTooltipTimeout();
              toggleSearch();
            }}
            onMouseEnter={(e) =>
              showTooltip(id, e, "Toggle search mode by deck (D) or card (C)")
            }
            onMouseLeave={() => hideTooltip(id)}
          ></label>
          <button
            id={`clear-${id}`}
            className="button-clear"
            onClick={() => {
              clearTooltipTimeout();
              clearSearch();
            }}
            onMouseEnter={(e) => showTooltip(id, e, "Clear search")}
            onMouseLeave={() => hideTooltip(id)}
          >
            <FontAwesomeIcon icon={faMultiply} />
          </button>
          <div id={`profile-panel-${id}`} className="profile-panel">
            <button
              id={`create-deck-${id}`}
              className="create-deck-button"
              onClick={() => {
                clearTooltipTimeout();
                handleCreateDeckButton();
              }}
              onMouseEnter={(e) =>
                showTooltip(id, e, "Create a deck (login required)")
              }
              onMouseLeave={() => hideTooltip(id)}
            >
              <FontAwesomeIcon icon={faFileEdit} />
            </button>
            <button
              id={`profile-${id}`}
              className="profile-button"
              onClick={() => {
                clearTooltipTimeout();
                navigate("/profile");
              }}
              onMouseEnter={(e) => showTooltip(id, e, "Profile")}
              onMouseLeave={() => hideTooltip(id)}
            >
              <FontAwesomeIcon icon={faUser} />
            </button>
            <label id={`user-popup-${id}`} className="user-popup"></label>
          </div>
        </div>
      </div>
      <label id={`tooltip-${id}`} className="tooltip"></label>
      <img src="/landing-backdrop.webp" className="backdrop"></img>
    </div>
  );
}
