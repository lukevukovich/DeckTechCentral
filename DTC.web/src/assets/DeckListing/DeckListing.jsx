import "./DeckListing.css";
import { faUser, faThumbsUp, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DeckListing(deckJson) {
  deckJson = deckJson.deckJson;

  return (
    <div className="deck-listing">
      <img className="cover-image" src={deckJson.cover_image} />
      <div className="overlay"></div>
      <text className="deck-name">{deckJson.name}</text>
      <text className="format">{deckJson.format}</text>
      <div className="creator-likes-views">
        <text className="creator">
          <FontAwesomeIcon icon={faUser} className="icon" />
          {deckJson.editors[0].username}
        </text>
        <text className="likes">
          <FontAwesomeIcon icon={faThumbsUp} className="icon" />
          {deckJson.likes}
        </text>
        <text className="views">
          <FontAwesomeIcon icon={faEye} className="icon" />
          {deckJson.views}
        </text>
      </div>
    </div>
  );
}
