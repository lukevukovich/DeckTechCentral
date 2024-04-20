import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { clearTooltipTimeout, hideTooltip, showTooltip } from "../Tooltip";
import "./CardPane.css";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";

export default function CardPane({ id, imageList, data, showCardDetails }) {
  function flipImage(id) {
    const index = parseInt(id.split("-")[3], 10);
    const image = document.getElementById("card-image-" + index);
    const large = data[index].image_uris.large;
    if (image.src == large) {
      image.src = data[index].image_uris.large_2;
    } else {
      image.src = data[index].image_uris.large;
    }
  }

  return (
    <div className="card-pane">
      {imageList.map((url, index) => (
        <div className="card-image-div">
          <div className="card-hover">
            <button
              id={`card-image-flip-${index}`}
              className="card-image-flip"
              onClick={(e) => {
                clearTooltipTimeout();
                flipImage(e.currentTarget.id);
              }}
              onMouseEnter={(e) => showTooltip(id, e, "Flip card")}
              onMouseLeave={() => hideTooltip(id)}
            >
              <FontAwesomeIcon icon={faRepeat}></FontAwesomeIcon>
            </button>
          </div>
          <img
            id={`card-image-${index}`}
            className="card-image"
            key={index}
            src={url}
            onClick={() => {
              clearTooltipTimeout();
              showCardDetails(index);
            }}
            onMouseEnter={(e) => showTooltip(id, e, "Show card details")}
            onMouseLeave={() => hideTooltip(id)}
          />
        </div>
      ))}
    </div>
  );
}
