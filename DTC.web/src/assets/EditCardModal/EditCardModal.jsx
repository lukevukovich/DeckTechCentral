import Modal from "react-modal";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./EditCardModal.css";
import { showTooltip, hideTooltip, clearTooltipTimeout } from "../Tooltip";
import { useState, useEffect } from "react";

export default function EditCardModal({
  modal,
  setModal,
  board,
  setBoard,
  deck,
  setDeck,
}) {
  //Use state for selected card
  const [selectedCard, setSelectedCard] = useState({
    number: "",
    CardInfo: {
      name: "",
      image_uris: { large: "" },
      type_line: "",
      original_type_line: "",
      oracle_text: "",
      mana_cost: "",
      flavor_text: "",
    },
  });

  const [number, setNumber] = useState("");
  const [commander, setCommander] = useState(false);
  const [boardSelect, setBoardSelect] = useState("");

  function loadCard() {
    const card = JSON.parse(sessionStorage.getItem("card"));

    setSelectedCard(card);
    setNumber(card.number);

    if (card.CardInfo.type_line == "Commander") {
      setCommander(true);
    } else {
      setCommander(false);
    }

    const tablinks = [
      document.getElementById("tablink-mainboard"),
      document.getElementById("tablink-sideboard"),
      document.getElementById("tablink-considering"),
    ];

    for (let i = 0; i < tablinks.length; i++) {
      const tablinkText = tablinks[i].id.slice(8);
      if (tablinks[i].style.backgroundColor == "rgb(158, 55, 55)") {
        setBoardSelect(
          tablinkText.charAt(0).toUpperCase() + tablinkText.slice(1)
        );
        break;
      }
    }

    sessionStorage.clear();
  }

  useEffect(() => {
    if (modal) {
      loadCard();
    }
  }, [modal]);

  function close() {
    document.body.style.overflow = "unset";
    setModal(false);
  }

  function handleNumberInput(num) {
    if (num != "") {
      if (num < 1) {
        setNumber(1);
      } else if (num > 1000) {
        setNumber(1000);
      } else {
        setNumber(num);
      }
    } else {
      setNumber("");
    }
  }

  function removeOldCard() {
    let newBoard = JSON.parse(JSON.stringify(board));

    for (let i = 0; i < newBoard.length; i++) {
      const id = newBoard[i].CardInfo.id;
      const number = newBoard[i].number;
      const type_line = newBoard[i].CardInfo.type_line;

      if (
        id == selectedCard.CardInfo.id &&
        number == selectedCard.number &&
        type_line == selectedCard.CardInfo.type_line
      ) {
        newBoard.splice(i, 1);
        break;
      }
    }

    setBoard(newBoard);

    const tablinks = [
      document.getElementById("tablink-mainboard"),
      document.getElementById("tablink-sideboard"),
      document.getElementById("tablink-considering"),
    ];

    for (let i = 0; i < tablinks.length; i++) {
      const tablinkText = tablinks[i].id.slice(8);
      if (tablinks[i].style.backgroundColor == "rgb(158, 55, 55)") {
        const newDeck = { ...deck };
        newDeck[tablinkText] = newBoard;
        setDeck(newDeck);
        break;
      }
    }
  }

  function saveCard() {
    let card = JSON.parse(JSON.stringify(selectedCard));

    card.number = parseInt(number);

    if (commander) {
      card.CardInfo.type_line = "Commander";
    } else {
      if (card.CardInfo.original_type_line.includes("—")) {
        card.CardInfo.type_line = card.CardInfo.original_type_line
          .split("—")[0]
          .slice(0, -1);
      } else {
        card.CardInfo.type_line = card.CardInfo.original_type_line;
      }
    }

    const newDeck = { ...deck };

    //Add card to board
    newDeck[boardSelect.toLowerCase()].push(card);

    removeOldCard();

    console.log("Card saved");
  }

  return (
    <Modal
      id={`add-card-modal`}
      isOpen={modal}
      onRequestClose={close}
      // Thanks https://codepen.io/claydiffrient/pen/KNjVrG for help with custom CSS styles for Modal
      className="add-card-modal-content"
      overlayClassName="add-card-modal-overlay"
    >
      <div>
        <div id={`add-modal-header`} className="add-modal-header">
          <div id={`add-modal-heading`} className="add-modal-heading">
            <text id={`add-modal-heading-name`}>
              {selectedCard.number +
                " " +
                selectedCard.CardInfo.name
                  .replace(new RegExp("//", "g"), "|")
                  .substring(0, 60)}
            </text>
          </div>
          <button
            id={`add-modal-button`}
            className="add-modal-button"
            onClick={() => {
              clearTooltipTimeout();
              hideTooltip("dv");
              saveCard();
              close();
            }}
            onMouseEnter={(e) => showTooltip("dv", e, "Save card")}
            onMouseLeave={() => hideTooltip("dv")}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </div>
        <div className="add-modal-body">
          <div className="add-modal-number-box">
            <text className="add-modal-number-text add-modal-resize-text">Card Number</text>
            <input
              type="number"
              className="add-modal-number"
              autoComplete="off"
              onKeyDown={(e) => handleNumberInput(e.target.value)}
              value={number}
              onChange={(e) => handleNumberInput(e.target.value)}
              onBlur={(e) => {
                if (e.target.value == "") {
                  setNumber(1);
                }
              }}
            ></input>
          </div>
          <div className="add-modal-commander-box">
            <text className="add-modal-commander-text add-modal-resize-text">Commander</text>
            <input
              type="checkbox"
              className="add-modal-commander"
              value={commander}
              checked={commander}
              onChange={() => setCommander(!commander)}
            ></input>
          </div>
          <div className="add-modal-board-box">
            <text className="add-modal-board-text add-modal-resize-text">Board</text>
            <select
              id="add-modal-board"
              className="add-modal-board"
              value={boardSelect}
              onChange={(e) => setBoardSelect(e.target.value)}
            >
              <option>Mainboard</option>
              <option>Sideboard</option>
              <option>Considering</option>
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
}
