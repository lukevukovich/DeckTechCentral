import "./DeckSection.css";
import { useEffect, useState } from "react";
import CardModal from "../CardModal/CardModal";
import { clearTooltipTimeout, showTooltip, hideTooltip } from "../Tooltip";
import EditCardModal from "../EditCardModal/EditCardModal";

export default function DeckSection({
  deckSectionJson,
  deckSectionName,
  edit,
  deck,
  setDeck,
  board,
  setBoard,
}) {
  //Minimize/maximize the card section
  const [minimized, setMinimized] = useState(false);

  //Use state for modal pop up
  const [modal, setModal] = useState(false);

  //Use state for edit modal pop up
  const [editModal, setEditModal] = useState(false);

  //Use state for selected card
  const [selectedCard, setSelectedCard] = useState({
    name: "",
    image_uris: { large: "" },
    type_line: "",
    original_type_line: "",
    oracle_text: "",
    mana_cost: "",
    flavor_text: "",
  });

  const [isShowing, setIsShowing] = useState(false);

  function minMaxCard() {
    const button = document.getElementById(
      "section-min-max-" + deckSectionName
    );
    const cards = document.getElementById("card-section-" + deckSectionName);

    if (!minimized) {
      setMinimized(true);
      cards.style.transform = "scaleY(0.0)";
      button.textContent = "+";
      cards.style.height = "0px";
      cards.style.borderBottom = "none";
    } else {
      setMinimized(false);
      cards.style.borderBottom = "2px solid #000";
      cards.style.transform = "scaleY(1.0)";
      button.textContent = "-";
      cards.style.height = "auto";
    }
  }

  //Show card modal based on selected card
  function showCardDetails(card) {
    let image;
    if ("large" in card.image_uris) {
      image = card.image_uris.large;
    } else {
      image = card.image_uris[2];
    }
    const data = {
      name: card.name,
      image_uris: { large: image },
      type_line: card.type_line,
      original_type_line: card.original_type_line,
      oracle_text: card.oracle_text,
      mana_cost: card.mana_cost,
      flavor_text: card.flavor_text,
    };

    setSelectedCard(data);

    // Thanks to https://stackoverflow.com/questions/54989513/react-prevent-scroll-when-modal-is-open for overflow tip
    document.body.style.overflow = "hidden";
    setModal(true);
  }

  //Set default to maximized
  useEffect(() => {
    const button = document.getElementById(
      "section-min-max-" + deckSectionName
    );
    const cards = document.getElementById("card-section-" + deckSectionName);
    setMinimized(false);
    cards.style.borderBottom = "2px solid #000";
    cards.style.transform = "scaleY(1.0)";
    button.textContent = "-";
    cards.style.height = "auto";
  }, [deckSectionJson]);

  //Calculate count of cards in section
  function getCardCount() {
    let count = 0;
    for (let i = 0; i < deckSectionJson.length; i++) {
      count += deckSectionJson[i].amount;
    }
    return count;
  }

  function preventDefaultRightClick(card) {
    card.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
  }

  //Display the right click panel on a card
  function showCardRightClickPanel(e) {
    if (edit) {
      const panel = document.getElementById("right-click-panel");
      const x = e.clientX + 5;

      let minus;
      if (window.innerWidth > 650) {
        minus = 105;
      } else {
        minus = 90;
      }
      const y = e.clientY - minus;

      panel.style.left = x + "px";
      panel.style.top = y + "px";
      panel.style.visibility = "visible";

      setIsShowing(true);
    }
  }

  //Check for page click, hide panel
  document.addEventListener("click", function (e) {
    try {
      const panel = document.getElementById("right-click-panel");
      if (isShowing && edit) {
        panel.style.visibility = "hidden";
        setIsShowing(false);
      }
    } catch {}
  });

  //Check for page resize, hide panel
  window.addEventListener("resize", function (e) {
    try {
      const panel = document.getElementById("right-click-panel");
      if (isShowing && edit) {
        panel.style.visibility = "hidden";
        setIsShowing(false);
      }
    } catch {}
  });

  //Check for page resize, hide panel
  window.addEventListener("scroll", function (e) {
    try {
      const panel = document.getElementById("right-click-panel");
      if (isShowing && edit) {
        panel.style.visibility = "hidden";
        setIsShowing(false);
      }
    } catch {}
  });

  function handleCoverImage() {
    const card = JSON.parse(sessionStorage.getItem("card"));

    let cover_image;
    if ("large" in card.CardInfo.image_uris) {
      cover_image = card.CardInfo.image_uris.large;
    } else {
      cover_image = card.CardInfo.image_uris[2];
    }

    let newDeck = { ...deck };
    newDeck.cover_image = cover_image;
    setDeck(newDeck);

    sessionStorage.clear();
  }

  function handleEditCard() {
    document.body.style.overflow = "hidden";
    setEditModal(true);
  }

  function handleRemoveCard() {
    const card = JSON.parse(sessionStorage.getItem("card"));

    let newBoard = JSON.parse(JSON.stringify(board));

    for (let i = 0; i < newBoard.length; i++) {
      const id = newBoard[i].CardInfo.id;
      const number = newBoard[i].amount;
      const type_line = newBoard[i].CardInfo.type_line;

      if (
        id == card.CardInfo.id &&
        number == card.amount &&
        type_line == card.CardInfo.type_line
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

    sessionStorage.clear();
  }

  return (
    <div className="deck-section">
      <EditCardModal
        modal={editModal}
        setModal={setEditModal}
        board={board}
        deck={deck}
        setBoard={setBoard}
        setDeck={setDeck}
      ></EditCardModal>
      <CardModal
        id="dv"
        modal={modal}
        setModal={setModal}
        selectedCard={selectedCard}
        deckId={null}
      ></CardModal>
      <div id="right-click-panel" className="right-click-panel">
        <button
          className="right-click-panel-button"
          onClick={() => {
            handleCoverImage();
          }}
        >
          Make cover image
        </button>
        <button
          className="right-click-panel-button"
          onClick={() => handleEditCard()}
        >
          Edit
        </button>
        <button
          className="right-click-panel-button"
          onClick={() => handleRemoveCard()}
        >
          Remove
        </button>
      </div>
      <div id="section-panel" className="section-panel">
        <button
          id={`section-min-max-${deckSectionName}`}
          className="section-min-max"
          onClick={minMaxCard}
        >
          -
        </button>
        <text className="section-name" onClick={minMaxCard}>
          {deckSectionName + " (" + getCardCount() + ")"}
        </text>
      </div>
      <div id={`card-section-${deckSectionName}`} className="card-section">
        {deckSectionJson.map((card, index) => (
          <text
            key={index}
            className="card-listing"
            onClick={() => {
              clearTooltipTimeout();
              showCardDetails(card.CardInfo);
            }}
            onMouseEnter={(e) =>
              showTooltip("dv", e, "(L) Card details, (R) Card options")
            }
            onMouseLeave={() => hideTooltip("dv")}
            onAuxClick={(e) => {
              preventDefaultRightClick(e.currentTarget);
              showCardRightClickPanel(e);
              sessionStorage.clear();
              sessionStorage.setItem("card", JSON.stringify(card));
            }}
          >
            {card.amount +
              " " +
              card.CardInfo.name.replace(new RegExp("//", "g"), "|")}
          </text>
        ))}
      </div>
    </div>
  );
}
