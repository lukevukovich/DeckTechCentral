import "./CardPane.css";

export default function CardPane({ imageList, showCardDetails }) {
  return (
    <div className="card-pane">
      {imageList.map((url, index) => (
        <img
          className="card-image"
          key={index}
          src={url}
          onClick={() => showCardDetails(index)}
        />
      ))}
    </div>
  );
}
