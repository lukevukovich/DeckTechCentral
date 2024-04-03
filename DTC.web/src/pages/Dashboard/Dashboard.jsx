import { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { awaitLoginStatus, getUserInfo, setUserPopup } from "../../oauth/User";
import { maxSearchLength } from "../../assets/DTCHeader/DTCHeader";
import DTCHeader from "../../assets/DTCHeader/DTCHeader";
import decks from "../../test/decks.json";
import DeckListing from "../../assets/DeckListing/DeckListing";

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

    sessionStorage.removeItem("deck");
  }, []);

  function search() {
    if (input != "" && input.length <= maxSearchLength) {
      if (!isToggled) {
        navigate(`/decksearch?deck=${input}`);
        setInput("");
      } else {
        navigate(`/cardsearch?card=${input}`);
        setInput("");
      }
    }
  }

  //Clear search
  function clearSearch() {
    setInput("");
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
        clearSearch={clearSearch}
        navigate={navigate}
      ></DTCHeader>
      <div className="landing">
        <div className="landing-text">
          <text className="landing-heading">Welcome to DeckTechCentral.</text>
          <text className="landing-paragraph">
            DeckTechCentral is a web based deck list management tool for Magic:
            The Gathering. Explore our collection of user-made decks or create
            your own ultimate decks!
          </text>
        </div>
        <div className="landing-decks">
          <text className="landing-feature">★ Featured Decks</text>
          <DeckListing id="db" deck={decks[0]}></DeckListing>
          <DeckListing id="db" deck={decks[1]}></DeckListing>
        </div>
      </div>
    </div>
  );
}
