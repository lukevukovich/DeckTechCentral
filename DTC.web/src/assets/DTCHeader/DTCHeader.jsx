import "./DTCHeader.css";
import {
  faSearch,
  faMultiply,
  faUser,
  faScrewdriverWrench,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { awaitLoginStatus } from "../../oauth/User";
import { useEffect } from "react";

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
  //Manage timeout for tooltip
  let timeoutId;

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
    const status = await awaitLoginStatus();
    if (status) {
      navigate("/deckcreate");
    } else {
      navigate("/profile");
    }
  }

  //Show tool tip after mouse enter. Allows for dynamic text and tooltips
  function showTooltip(e, tooltip_text) {
    const x = e.clientX - tooltip_text.length * 3;
    const y = e.clientY + 10;
    const tooltip = document.getElementById(`tooltip-${id}`);

    timeoutId = setTimeout(() => {
      tooltip.style.left = x + "px";
      tooltip.style.top = y + "px";
      tooltip.textContent = tooltip_text;
      tooltip.style.visibility = "visible";
    }, 600);
  }

  //Hide tooltip after mouse exit
  function hideTooltip() {
    clearTimeout(timeoutId);
    const tooltip = document.getElementById(`tooltip-${id}`);
    tooltip.style.visibility = "hidden";
  }

  //Hide tooltip after page load
  useEffect(() => {
    timeoutId = setTimeout(() => {
      hideTooltip();
    }, 600);
  }, []);

  return (
    <div id={id}>
      <div id={`header-${id}`}>
        <Link to="/" style={{ textDecoration: "none" }}>
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
              clearTimeout(timeoutId);
              search();
            }}
            onMouseEnter={(e) => showTooltip(e, "Search")}
            onMouseLeave={hideTooltip}
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
              clearTimeout(timeoutId);
              toggleSearch();
            }}
            onMouseEnter={(e) =>
              showTooltip(e, "Toggle search mode by deck (D) or card (C)")
            }
            onMouseLeave={hideTooltip}
          ></label>
          <button
            id={`clear-${id}`}
            className="button-clear"
            onClick={() => {
              clearTimeout(timeoutId);
              clearSearch();
            }}
            onMouseEnter={(e) => showTooltip(e, "Clear search")}
            onMouseLeave={hideTooltip}
          >
            <FontAwesomeIcon icon={faMultiply} />
          </button>
          <div id={`profile-panel-${id}`} className="profile-panel">
            <button
              id={`create-deck-${id}`}
              className="create-deck-button"
              onClick={() => {
                clearTimeout(timeoutId);
                handleCreateDeckButton();
              }}
              onMouseEnter={(e) =>
                showTooltip(e, "Create a deck (login required)")
              }
              onMouseLeave={hideTooltip}
            >
              <FontAwesomeIcon icon={faScrewdriverWrench} />
            </button>
            <button
              id={`profile-${id}`}
              className="profile-button"
              onClick={() => {
                clearTimeout(timeoutId);
                navigate("/profile");
              }}
              onMouseEnter={(e) => showTooltip(e, "Profile")}
              onMouseLeave={hideTooltip}
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
