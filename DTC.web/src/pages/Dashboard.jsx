import { useState } from "react";
import "./Dashboard.css";
import { faSearch, faMultiply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  //Use state for input
  const [input, setInput] = useState("");

  //Use state for search toggle
  const [isToggled, setIsToggled] = useState(true);

  function search() {
    if (input != "" && input.length <= 100) {
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
          <text id="heading-db">DeckTechCentral</text>
        </Link>
        <div id="search-panel-db">
          <input type="checkbox" id="checkbox-db"></input>
          <label
            id="checkbox-toggle-db"
            htmlFor="checkbox-db"
            checked={isToggled}
            onChange={toggleSearch}
            onClick={() => toggleSearch()}
          ></label>
          <button id="go-db" onClick={() => search()}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <input
            id="search-bar-db"
            placeholder="Search deck list..."
            autoComplete="off"
            onClick={() => setInput("")}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                search();
              }
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></input>
          <button id="clear-db" onClick={() => clearSearch()}>
            <FontAwesomeIcon icon={faMultiply} />
          </button>
        </div>
        <div id="placeholder-db"></div>
      </div>
      <text id="welcome-db">Welcome to DeckTechCentral.</text>
    </div>
  );
}
