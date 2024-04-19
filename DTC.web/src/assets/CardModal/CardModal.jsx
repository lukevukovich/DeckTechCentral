import Modal from "react-modal";
import { faMultiply, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CardModal.css";
import { showTooltip, hideTooltip, clearTooltipTimeout } from "../Tooltip";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CardModal({ id, modal, setModal, selectedCard }) {
  const navigate = useNavigate();

  const deck = JSON.parse(sessionStorage.getItem("deck"));

  const [faceButton, setFaceButton] = useState(null);

  const [initialFace, setInitialFace] = useState(true);

  useEffect(() => {
    if (modal) {
      if ("name_2" in selectedCard) {
        setFaceButton(true);
      } else {
        setFaceButton(false);
      }
    } else {
      setFaceButton(null);
    }
  }, [modal]);

  useEffect(() => {
    if (faceButton != null) {
      const button = document.getElementById("modal-button-flip-" + id);
      if (faceButton) {
        button.style.display = "block";
      } else {
        button.style.display = "none";
      }
    }
  }, [faceButton]);

  //Close card modal
  function closeCardDetails() {
    document.body.style.overflow = "unset";
    setInitialFace(true);
    setModal(false);
  }

  function handleAddCard() {
    closeCardDetails();

    //Show mini modal, ask for board, if commander, and number
    const board = "mainboard";
    const number = 1;

    selectedCard.board = board;
    selectedCard.amount = number;

    sessionStorage.clear();
    sessionStorage.setItem("card", JSON.stringify(selectedCard));
    sessionStorage.setItem("deck", JSON.stringify(deck));
    if (deck.id == undefined) {
      navigate(`/deck`);
    } else {
      navigate(`/deck?id=${deck.id}`);
    }
  }

  function setAddCardState() {
    if (deck == null) {
      document.getElementById("modal-add-card").style.display = "none";
    }
  }

  const modalContentRef = useCallback((node) => {
    if (node !== null) {
      // Modal content is mounted, and DOM node is available
      setAddCardState();
    }
  }, []);

  return (
    <Modal
      id={`card-modal-${id}`}
      isOpen={modal}
      onRequestClose={() => closeCardDetails()}
      // Thanks https://codepen.io/claydiffrient/pen/KNjVrG for help with custom CSS styles for Modal
      className="card-modal-content"
      overlayClassName="card-modal-overlay"
    >
      <div ref={modalContentRef}>
        <div id={`modal-header-${id}`} className="modal-header">
          <div id={`modal-heading-${id}`} className="modal-heading">
            <text id={`modal-heading-name-${id}`}>
              {(initialFace ? selectedCard.name : selectedCard.name_2)
                .replace(new RegExp("//", "g"), "|")
                .substring(0, 60)}
            </text>
            <text
              id={`modal-heading-mana-${id}`}
              className="modal-heading-mana"
            >
              {(initialFace
                ? selectedCard.mana_cost
                : selectedCard.mana_cost_2
              ).replace(new RegExp("//", "g"), "|")}
            </text>
          </div>
          <div className="modal-buttons">
            <button
              id={`modal-button-${id}`}
              className="modal-button"
              onClick={() => {
                clearTooltipTimeout();
                closeCardDetails();
              }}
              onMouseEnter={(e) => showTooltip(id, e, "Close card details")}
              onMouseLeave={() => hideTooltip(id)}
            >
              <FontAwesomeIcon icon={faMultiply} />
            </button>
            <button
              id={`modal-button-flip-${id}`}
              className="modal-button-flip"
              onClick={() => {
                clearTooltipTimeout();
                setInitialFace(!initialFace);
              }}
              onMouseEnter={(e) => showTooltip(id, e, "Flip card")}
              onMouseLeave={() => hideTooltip(id)}
            >
              <FontAwesomeIcon icon={faRepeat} />
            </button>
          </div>
        </div>
        <div id={`modal-info-${id}`} className="modal-info">
          <div className="card-and-button">
            <img
              id={`modal-card-${id}`}
              className="card-image modal-card"
              src={
                initialFace
                  ? selectedCard.image_uris.large
                  : selectedCard.image_uris.large_2
              }
            />
            <button
              id="modal-add-card"
              className="modal-add-card"
              onClick={() => {
                clearTooltipTimeout();
                handleAddCard();
              }}
              onMouseEnter={(e) => showTooltip(id, e, "Add card to deck")}
              onMouseLeave={() => hideTooltip(id)}
            >
              Add to deck
            </button>
          </div>
          <div id={`modal-stats-${id}`} className="modal-stats">
            <text className="modal-type-line">
              {(initialFace
                ? selectedCard.original_type_line || selectedCard.type_line
                : selectedCard.type_line_2
              ).replace(new RegExp("//", "g"), "|")}
            </text>
            <text>
              {(initialFace
                ? selectedCard.oracle_text
                : selectedCard.oracle_text_2
              ).replace(new RegExp("\n", "g"), "\n\n")}
            </text>
            <text>
              {(initialFace
                ? selectedCard.flavor_text
                : selectedCard.flavor_text_2
              ).replace(new RegExp("\n", "g"), "\n\n")}
            </text>
          </div>
        </div>
      </div>
    </Modal>
  );
}
