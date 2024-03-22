import { useState, useEffect } from "react";
import "./DeckView.css";
import { useNavigate } from "react-router-dom";
import { awaitLoginStatus, getUserInfo, setUserPopup } from "../../oauth/User";
import { maxSearchLength } from "../../assets/DTCHeader/DTCHeader";
import DTCHeader from "../../assets/DTCHeader/DTCHeader";
import deck from "../../test/deck.json";
import DeckBoard from "../../assets/DeckBoard/DeckBoard";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DeckView() {
  const navigate = useNavigate();

  //Use state for input
  const [input, setInput] = useState("");

  //Use state for search toggle
  const [isToggled, setIsToggled] = useState(false);

  const [board, setBoard] = useState(deck.mainboard);

  //Check for Google login, set popup
  async function checkLogin() {
    const s = await awaitLoginStatus();
    if (s) {
      const u = getUserInfo();
      setUserPopup(u, "dv");
    } else {
      setUserPopup(null, "dv");
    }
  }

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

  function getEditors() {
    let editors = "";
    for (let i = 1; i < deck.editors.length; i++) {
      editors += deck.editors[i].username;

      if (i + 1 != deck.editors.length) {
        editors += ", ";
      }
    }

    return editors;
  }

  function tabSelect(newBoard, boardName) {
    if (board != newBoard) {
      const buttons = [
        document.getElementById("tablink-mainboard"),
        document.getElementById("tablink-sideboard"),
        document.getElementById("tablink-considering"),
      ];

      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "transparent";
        buttons[i].style.color = "black";
        buttons[i].classList.add("button-effect-hover");
        buttons[i].style.boxShadow = "none";
      }

      const buttonSelected = document.getElementById("tablink-" + boardName);
      buttonSelected.style.backgroundColor = "rgb(158, 55, 55)";
      buttonSelected.style.color = "rgb(255, 251, 234)";
      buttonSelected.classList.remove("button-effect-hover");
      buttonSelected.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.35)";

      setBoard(newBoard);
    }
  }

  function setInitialTabs() {
    document.getElementById("tablink-mainboard").style.backgroundColor =
      "rgb(158, 55, 55)";
    document.getElementById("tablink-mainboard").style.color =
      "rgb(255, 251, 234)";
    document.getElementById("tablink-mainboard").style.boxShadow =
      "0 4px 8px rgba(0, 0, 0, 0.35)";
    document
      .getElementById("tablink-sideboard")
      .classList.add("button-effect-hover");
    document
      .getElementById("tablink-considering")
      .classList.add("button-effect-hover");
  }

  useEffect(() => {
    //Check for login and set popup
    checkLogin();

    setInitialTabs();
  }, []);

  return (
    <div id="dv-all">
      <DTCHeader
        id="dv"
        inputText="Search deck list..."
        inputValue={input}
        inputOnChange={setInput}
        isToggled={isToggled}
        setIsToggled={setIsToggled}
        search={search}
        clearSearch={clearSearch}
        navigate={navigate}
      ></DTCHeader>
      <div className="deck-view">
        <div className="deck-view-panel">
          <img className="deck-view-cover" src={deck.cover_image}></img>
          <div className="deck-view-info">
            <text className="deck-view-name">{deck.name}</text>
            <div className="deck-view-format">
              <text>{deck.format}</text>
            </div>
            <div className="deck-view-editors">
              <FontAwesomeIcon
                icon={faUser}
                className="deck-view-author-icon"
              />
              <text className="deck-view-author">
                {deck.editors[0].username}
              </text>
              <text className="deck-view-others">{getEditors()}</text>
            </div>
          </div>
        </div>
        <div className="deck-view-tabs">
          <button
            id="tablink-mainboard"
            className="deck-view-tablinks"
            onClick={() => tabSelect(deck.mainboard, "mainboard")}
          >
            Mainboard
          </button>
          <button
            id="tablink-sideboard"
            className="deck-view-tablinks"
            onClick={() => tabSelect(deck.sideboard, "sideboard")}
          >
            Sideboard
          </button>
          <button
            id="tablink-considering"
            className="deck-view-tablinks"
            onClick={() => tabSelect(deck.considering, "considering")}
          >
            Considering
          </button>
        </div>
        <DeckBoard boardJson={board}></DeckBoard>
      </div>
    </div>
  );
}
