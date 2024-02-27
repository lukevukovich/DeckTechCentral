import "./DeckListing.css";
import { faUser, faThumbsUp, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DeckListing({ deck }) {
  //Format number to include K or M suffix
  //Ensures number is not too large
  function formatNumber(number) {
    let wholeNumberSlice;
    let suffix;
    let numberString;
    let decimal;

    //Determine slice index and suffix
    if (number >= 1000000) {
      wholeNumberSlice = -6;
      suffix = "M";
    } else if (number >= 1000) {
      wholeNumberSlice = -3;
      suffix = "K";
    } else {
      wholeNumberSlice = null;
      suffix = null;
    }

    //If number needs formatted
    if (wholeNumberSlice != null && suffix != null) {
      numberString = number.toString().slice(0, wholeNumberSlice);

      //If there is decimal
      decimal = number.toString().slice(wholeNumberSlice, wholeNumberSlice + 1);
      if (decimal > 0) {
        numberString += "." + decimal;
      }

      numberString += suffix;
    } else {
      numberString = number.toString();
    }

    return numberString;
  }

  return (
    <div className="deck-listing">
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
