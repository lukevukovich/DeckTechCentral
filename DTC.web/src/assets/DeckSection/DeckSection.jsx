import "./DeckSection.css";
import { useEffect, useState } from "react";
import CardModal from "../CardModal/CardModal";
import { clearTooltipTimeout, showTooltip, hideTooltip } from "../Tooltip";

export default function DeckSection({ deckSectionJson, deckSectionName }) {
  //Minimize/maximize the card section
  const [minimized, setMinimized] = useState(false);

  //Use state for modal pop up
  const [modal, setModal] = useState(false);

  //Use state for selected card
  const [selectedCard, setSelectedCard] = useState({
    name: "",
    image_uris: { large: "" },
    type_line: "",
    oracle_text: "",
    mana_cost: "",
    flavor_text: "",
  });

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
    const data = {
      name: card.name,
      image_uris: { large: card.image_uris.large },
      type_line: card.type_line,
      oracle_text: card.oracle_text,
      mana_cost: card.mana_cost,
      flavor_text: card.flavor_text,
    };

    setSelectedCard(data);
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

  return (
    <div className="deck-section">
      <CardModal
        id="deck-section"
        modal={modal}
        setModal={setModal}
        selectedCard={selectedCard}
      ></CardModal>
      <div id="section-panel" className="section-panel">
        <button
          id={`section-min-max-${deckSectionName}`}
          className="section-min-max"
          onClick={minMaxCard}
        >
          -
        </button>
        <text className="section-name" onClick={minMaxCard}>
          {deckSectionName + " (" + deckSectionJson.length + ")"}
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
            onMouseEnter={(e) => showTooltip("dv", e, "Show card details")}
            onMouseLeave={() => hideTooltip("dv")}
          >
            {card.number + " " + card.CardInfo.name}
          </text>
        ))}
      </div>
    </div>
  );
}
