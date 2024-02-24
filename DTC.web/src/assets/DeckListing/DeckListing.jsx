import "./DeckListing.css";

export default function DeckListing(deckJson) {
  deckJson = deckJson.deckJson;

  return (
    <div className="deck-listing">
      <img
        className="cover-image"
        src={deckJson.cover_image}
      />
      <div className="overlay"></div>
      <text className="deck-name">{deckJson.name}</text>
      <text className="format">{deckJson.format}</text>
      <text className="creator">{deckJson.editors[0].username}</text>
      <text className="likes">{deckJson.likes}</text>
      <text className="views">{deckJson.views}</text>
    </div>
  );
}
