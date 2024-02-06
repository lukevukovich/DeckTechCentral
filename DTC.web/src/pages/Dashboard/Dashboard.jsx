import { useState, useEffect } from "react";
import "./Dashboard.css";
import "../Pages.css";
import { useNavigate } from "react-router-dom";
import { awaitLoginStatus, getUserInfo, setUserPopup } from "../../oauth/User";
import DTCHeader from "../DTCHeader";

export default function Dashboard() {
  const navigate = useNavigate();

  //Use state for input
  const [input, setInput] = useState("");

  //Use state for search toggle
  const [isToggled, setIsToggled] = useState(false);

  //Check for Google login, set popup
  async function checkLogin() {
    const s = await awaitLoginStatus();
    if (s) {
      const u = getUserInfo();
      setUserPopup(u, "db");
    } else {
      setUserPopup(null, "db");
    }
  }

  useEffect(() => {
    //Check for login and set popup
    checkLogin();
  }, []);

  function search() {
    if (input != "" && input.length <= 40) {
      if (!isToggled) {
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
    if (isToggled) {
      searchBar.placeholder = "Search deck list...";
    } else {
      searchBar.placeholder = "Search card...";
    }
  }

  // Create all components
  return (
    <div id="db-all">
      <DTCHeader
        id="db"
        inputText="Search deck list..."
        inputValue={input}
        inputOnChange={setInput}
        isToggled={isToggled}
        setIsToggled={setIsToggled}
        search={search}
        toggleSearch={toggleSearch}
        clearSearch={clearSearch}
        numResults={""}
        navigate={navigate}
      ></DTCHeader>
      <text id="welcome-db">Welcome to DeckTechCentral.</text>
    </div>
  );
}
