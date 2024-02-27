import DeckListing from "../DeckListing/DeckListing";
import "./DeckPane.css";

export default function DeckPane({ decks }) {
  console.log(decks);
  return (
    <div class="deck-pane">
      {decks.map((deck, index) => (
        <DeckListing key={index} deck={deck} />
      ))}
    </div>
  );
}
