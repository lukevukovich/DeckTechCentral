import { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { awaitLoginStatus, getUserInfo, setUserPopup } from "../../oauth/User";
import { maxSearchLength } from "../../assets/DTCHeader/DTCHeader";
import DTCHeader from "../../assets/DTCHeader/DTCHeader";

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
    if (input != "" && input.length <= maxSearchLength) {
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
      <text id="welcome-db">Welcome to DeckTechCentral.</text>
    </div>
  );
}
