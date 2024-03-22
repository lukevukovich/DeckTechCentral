import "./DeckSection.css";
import { useState } from "react";

export default function DeckSection({ deckSectionJson, deckSectionName }) {
  const [minimized, setMinimized] = useState(false);

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

  return (
    <div className="deck-section">
      <div id="section-panel" className="section-panel">
        <button
          id={`section-min-max-${deckSectionName}`}
          className="section-min-max"
          onClick={minMaxCard}
        >
          -
        </button>
        <text className="section-name">
          {deckSectionName + " (" + deckSectionJson.length + ")"}
        </text>
      </div>
      <div id={`card-section-${deckSectionName}`} className="card-section">
        {deckSectionJson.map((card, index) => (
          <text key={index} className="card-listing">
            {card.number + " " + card.CardInfo.name}
          </text>
        ))}
      </div>
    </div>
  );
}
