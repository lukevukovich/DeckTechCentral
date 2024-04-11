import { useState, useEffect } from "react";
import "./NotFound.css";
import { useNavigate } from "react-router-dom";
import { getLoginStatus, setUserPopup } from "../../oauth/User";
import { maxSearchLength } from "../../assets/DTCHeader/DTCHeader";
import DTCHeader from "../../assets/DTCHeader/DTCHeader";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NotFound() {
  const navigate = useNavigate();

  //Use state for input
  const [input, setInput] = useState("");

  //Use state for search toggle
  const [isToggled, setIsToggled] = useState(false);

  //Check for Google login, set popup
  function checkLogin() {
    const s = getLoginStatus();
    if (s) {
      setUserPopup("nf");
    } else {
      setUserPopup("nf");
    }
  }

  useEffect(() => {
    //Check for login and set popup
    checkLogin();

    sessionStorage.clear();
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
    <div id="nf-all">
      <DTCHeader
        id="nf"
        inputText="Search deck list..."
        inputValue={input}
        inputOnChange={setInput}
        isToggled={isToggled}
        setIsToggled={setIsToggled}
        search={search}
        clearSearch={clearSearch}
        navigate={navigate}
      ></DTCHeader>
      <div className="nf-text">
        <FontAwesomeIcon icon={faCircleExclamation} className="nf-icon" />
        <text>Page not found.</text>
      </div>
    </div>
  );
}
