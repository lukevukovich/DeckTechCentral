import Modal from "react-modal";
import { faMultiply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CardModal.css";

export default function CardModal({ id, modal, setModal, selectedCard }) {
  //Close card modal
  function closeCardDetails() {
    setModal(false);
  }

  return (
    <Modal
      id={`card-modal-${id}`}
      isOpen={modal}
      onRequestClose={() => closeCardDetails()}
      // Thanks https://codepen.io/claydiffrient/pen/KNjVrG for help with custom CSS styles for Modal
      className="card-modal-content"
      overlayClassName="card-modal-overlay"
    >
      <div id={`modal-header-${id}`} className="modal-header">
        <div id={`modal-heading-${id}`} className="modal-heading">
          <text id={`modal-heading-name-${id}`}>
            {selectedCard.name
              .replace(new RegExp("//", "g"), "||")
              .substring(0, 66)}
          </text>
          <text id={`modal-heading-mana-${id}`} className="modal-heading-mana">
            {selectedCard.mana_cost.replace(new RegExp("//", "g"), "||")}
          </text>
        </div>
        <button
          id={`modal-button-${id}`}
          className="modal-button"
          onClick={() => closeCardDetails()}
        >
          <FontAwesomeIcon icon={faMultiply} />
        </button>
      </div>
      <div id={`modal-info-${id}`} className="modal-info">
        <img
          id={`modal-card-${id}`}
          className="card-image modal-card"
          src={selectedCard.image_uris.large}
        />
        <div id={`modal-stats-${id}`} className="modal-stats">
          <text>
            {selectedCard.type_line.replace(new RegExp("//", "g"), "||")}
          </text>
          <text>
            {selectedCard.oracle_text.replace(new RegExp("\n", "g"), "\n\n")}
          </text>
          <text>
            {selectedCard.flavor_text.replace(new RegExp("\n", "g"), "\n\n")}
          </text>
        </div>
      </div>
    </Modal>
  );
}
