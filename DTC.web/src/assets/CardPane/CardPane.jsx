import { clearTooltipTimeout, hideTooltip, showTooltip } from "../Tooltip";
import "./CardPane.css";

export default function CardPane({ id, imageList, showCardDetails }) {
  return (
    <div className="card-pane">
      {imageList.map((url, index) => (
        <img
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
      ))}
    </div>
  );
}
