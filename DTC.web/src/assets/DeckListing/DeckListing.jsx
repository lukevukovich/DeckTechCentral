import "./DeckListing.css";
import { faUser, faThumbsUp, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatNumber } from "../FormatNumber";
import { clearTooltipTimeout, hideTooltip, showTooltip } from "../Tooltip";
import { useNavigate } from "react-router-dom";

export default function DeckListing({ id, deck }) {
  const navigate = useNavigate();

  return (
    <div
      className="deck-listing"
      onClick={() => {
        clearTooltipTimeout();
        navigate(`/deck?id=${deck.id}`);
      }}
      onMouseEnter={(e) => {
        showTooltip(id, e, "View deck");
      }}
      onMouseLeave={() => hideTooltip(id)}
    >
      <img className="cover-image" src={deck.cover_image} />
      <div className="overlay"></div>
      <text className="deck-name">{deck.name}</text>
      <text className="format">{deck.format}</text>
      <div className="creator-likes-views">
        <text className="creator">
          <FontAwesomeIcon icon={faUser} className="icon" />
          {deck.editors[0].username}
        </text>
        <text className="likes">
          <FontAwesomeIcon icon={faThumbsUp} className="icon" />
          {formatNumber(deck.likes)}
        </text>
        <text className="views">
          <FontAwesomeIcon icon={faEye} className="icon" />
          {formatNumber(deck.views)}
        </text>
      </div>
    </div>
  );
}
