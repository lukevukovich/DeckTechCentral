import { useState, useEffect } from "react";
import "./Deck.css";
import { useNavigate } from "react-router-dom";
import { awaitLoginStatus, getUserInfo, setUserPopup } from "../../oauth/User";
import { maxSearchLength } from "../../assets/DTCHeader/DTCHeader";
import DTCHeader from "../../assets/DTCHeader/DTCHeader";
import deck from "../../test/deck.json";
import DeckBoard from "../../assets/DeckBoard/DeckBoard";
import {
  faUser,
  faThumbsUp,
  faEye,
  faPenToSquare,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatNumber } from "../../assets/FormatNumber";
import {
  showTooltip,
  hideTooltip,
  clearTooltipTimeout,
} from "../../assets/Tooltip";

export default function Deck() {
  const navigate = useNavigate();

  //Get list of elements that become editable
  const editableElements = [
    "deck-view-name",
    "deck-view-format",
    "deck-view-desc",
  ];

  //Get list of elements that are removable
  const removableElements = ["deck-view-add-card"];

  //Edit state
  const [edit, setEdit] = useState(false);

  //Edit icon state
  const [editIcon, setEditIcon] = useState(faPenToSquare);

  const [editTooltip, setEditTooltip] = useState("Edit deck");

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

  function setEditStates() {
    if (edit) {
      var buttonIcon = faFloppyDisk;
      var tooltip = "Save deck";
      var padding = "1px";
      var editable = true;
      var display = "block";
    } else {
      var buttonIcon = faPenToSquare;
      var tooltip = "Edit deck";
      var padding = "2px";
      var editable = false;
      var display = "none";
    }

    setEditIcon(buttonIcon);
    setEditTooltip(tooltip);
    document.getElementById("edit-button").style.paddingLeft = padding;

    try {
      for (let i = 0; 0 < editableElements.length; i++) {
        var element = document.getElementById(editableElements[i]);
        element.contentEditable = editable;
      }
    } catch {}

    try {
      for (let i = 0; 0 < removableElements.length; i++) {
        var element = document.getElementById(removableElements[i]);
        element.style.display = display;
      }
    } catch {}
  }

  //IMPORTANT: When edit state it changed *********************
  useEffect(() => {
    setEditStates();
  }, [edit]);

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
          <div className="deck-view-cover">
            <img src={deck.cover_image}></img>
          </div>
          <div className="deck-view-info">
            <div className="deck-view-name-edit">
              <text id="deck-view-name" className="deck-view-name">
                {deck.name}
              </text>
              <button
                id="edit-button"
                className="edit-button"
                onClick={() => {
                  clearTooltipTimeout();
                  setEdit(!edit);
                }}
                onMouseEnter={(e) => showTooltip("dv", e, editTooltip)}
                onMouseLeave={() => hideTooltip("dv")}
              >
                <FontAwesomeIcon icon={editIcon} />
              </button>
            </div>
            <div className="deck-view-format">
              <text id="deck-view-format">{deck.format}</text>
            </div>
            <div id="deck-view-desc" className="deck-view-desc">
              <text>{deck.description}</text>
            </div>
          </div>
        </div>
        <div className="deck-view-stats">
          <text className="deck-view-text">
            <FontAwesomeIcon icon={faUser} className="deck-view-icon" />
            {deck.editors[0].username}
          </text>
          <text className="deck-view-others">{getEditors()}</text>
          <text className="deck-view-text deck-view-text-left deck-view-text-reg">
            <FontAwesomeIcon icon={faThumbsUp} className="deck-view-icon" />
            {formatNumber(deck.likes)}
          </text>
          <text className="deck-view-text deck-view-text-reg">
            <FontAwesomeIcon icon={faEye} className="deck-view-icon" />
            {formatNumber(deck.views)}
          </text>
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
        <button id="deck-view-add-card" className="deck-view-add-card">
          Add Card
        </button>
        <DeckBoard boardJson={board}></DeckBoard>
      </div>
    </div>
  );
}
