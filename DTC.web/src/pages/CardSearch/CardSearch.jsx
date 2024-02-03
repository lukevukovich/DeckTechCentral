import { useState, useEffect } from "react";
import "./CardSearch.css";
import "../Pages.css";
import {
  faSearch,
  faMultiply,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { awaitLoginStatus, getUserInfo } from "../../oauth/User";

Modal.setAppElement("#root");

export default function CardSearch() {
  //Set working variables
  const navigate = useNavigate();
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  //Use state for search toggle
  const [isToggled, setIsToggled] = useState(true);

  //Set initial search text based on dashboard
  const [searchText, setSearchText] = useState(searchParams.get("q"));

  //Use state for card name search value
  const [cardName, setCardName] = useState(searchText);

  //Use state for data
  const [data, setData] = useState([]);

  //Use state for list of images
  const [imageList, setImageList] = useState([]);

  //Use state for number of cards
  const [numCards, setNumCards] = useState("");

  //Use state for modal pop up
  const [modal, setModal] = useState(false);

  //Use state for selected card
  const [selectedCard, setSelectedCard] = useState({
    name: "",
    image_uris: { normal: "" },
    type_line: "",
    oracle_text: "",
    mana_cost: "",
    flavor_text: "",
  });

  //Set content of user popup info
  function setUserPopup(user) {
    const popup = document.getElementById("user-popup-cs");
    if (user != null) {
      const basicProfile = user.getBasicProfile();
      const username = basicProfile.getEmail();
      popup.textContent = "User | " + username;
    } else {
      popup.textContent = "Guest | Login required";
    }
  }

  //Check for Google login, set popup
  async function checkLogin() {
    const s = await awaitLoginStatus();
    if (s) {
      const u = getUserInfo();
      setUserPopup(u);
    } else {
      setUserPopup(null);
    }
  }

  useEffect(() => {
    //Check for login and set popup
    checkLogin();
  }, []);

  //Set toggle and search setting
  function toggleSearch() {
    setIsToggled(!isToggled);

    const searchBar = document.getElementById("search-bar-cs");
    if (isToggled) {
      searchBar.placeholder = "Search deck list...";
    } else {
      searchBar.placeholder = "Search card...";
    }
  }

  //Check search toggle and handle accordingly
  function checkSearchToggle() {
    if (cardName != "" && cardName.length <= 40) {
      if (!isToggled) {
        navigate(`/decksearch?q=${cardName}`);
      } else {
        searchCard();
      }
    }
  }

  useEffect(() => {
    // Call searchCard when searchText changes
    if (searchText != null) {
      searchCard();
    }
  }, [searchText]);

  const processData = (jsonData) => {
    const images = [];
    const removeCards = [];

    for (let i = 0; i < jsonData.data.length; i++) {
      try {
        // Test if oracle_text is present
        try {
          jsonData.data[i].oracle_text.split("\n");
        } catch (error) {
          // If not present, go through all card faces and add to oracle_text
          const faces = jsonData.data[i].card_faces.length;
          jsonData.data[i].oracle_text = "";
          for (let j = 0; j < faces; j++) {
            let face_text = jsonData.data[i].card_faces[j].oracle_text;
            jsonData.data[i].oracle_text += " | " + face_text;
          }
          jsonData.data[i].oracle_text =
            jsonData.data[i].oracle_text.substring(3);
        }

        //Text is flavor_text is present
        try {
          jsonData.data[i].flavor_text.split("\n");
        } catch (error) {
          jsonData.data[i].flavor_text = "";
        }
        images.push(jsonData.data[i].image_uris.normal);
      } catch (error) {
        removeCards.push(i);
      }
    }

    // Remove cards without an image
    for (let i = 0; i < removeCards.length; i++) {
      jsonData.data.splice(removeCards[i], 1);
    }

    return {
      images,
      processedData: jsonData.data,
    };
  };

  //Handle card seach to Scryfall API
  const searchCard = async () => {
    navigate(`/cardsearch?q=${cardName}`);

    setData([]);
    setImageList([]);
    try {
      //Make request
      const response = await fetch(
        `https://api.scryfall.com/cards/search?q=name:${encodeURIComponent(
          cardName
        )}`
      );
      const jsonData = await response.json();

      const { images, processedData } = processData(jsonData);
      const cards = processedData.length;

      //Set data
      setData(processedData);

      //Set image list
      setImageList(images);

      //Set num cards
      if (cards == 1) {
        setNumCards(cards + " card found for '" + cardName + "'");
      } else {
        setNumCards(cards + " cards found for '" + cardName + "'");
      }
    } catch (error) {
      //Set num cards to none
      setNumCards("No cards found for '" + cardName + "'");
    }
  };

  //Clear search and image list
  function clearSearch() {
    setCardName("");
  }

  //Create image components based on imageList
  const ImageList = () => {
    return (
      <div id="image-list">
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
  };

  //Set selected card and show modal
  function showCardDetails(index) {
    setSelectedCard(data[index]);
    setModal(true);
  }

  //Close card details
  function closeCardDetails() {
    setModal(false);
  }

  //Create card modal
  const CardModal = () => {
    return (
      <Modal
        id="card-modal"
        isOpen={modal}
        onRequestClose={() => closeCardDetails()}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
          },
          content: {
            width: "750px",
            height: "500px",
            margin: "auto",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            backgroundColor: "rgb(255, 251, 234)",
          },
        }}
      >
        <div id="modal-header">
          <div id="modal-heading">
            <text id="modal-heading-name">
              {selectedCard.name
                .replace(new RegExp("//", "g"), "|")
                .substring(0, 66)}
            </text>
            <text id="modal-heading-mana">
              {selectedCard.mana_cost.replace(new RegExp("//", "g"), "|")}
            </text>
          </div>
          <button id="modal-button" onClick={() => closeCardDetails()}>
            <FontAwesomeIcon icon={faMultiply} />
          </button>
        </div>
        <div id="modal-info">
          <img
            id="modal-card"
            className="card-image"
            src={selectedCard.image_uris.normal}
          />
          <div id="modal-stats">
            <text>
              {selectedCard.type_line.replace(new RegExp("//", "g"), "|")}
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
  };

  //Create all components
  return (
    <div id="cs">
      <CardModal />
      <div id="header-cs">
        <Link to="/" style={{ textDecoration: "none" }}>
          <text id="heading-cs" className="heading">
            DeckTechCentral
          </text>
        </Link>
        <div id="search-panel-cs" className="search-panel">
          <button
            id="profile-cs"
            className="button"
            onClick={() => navigate("/profile")}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button id="go-cs" onClick={() => checkSearchToggle()}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <input
            id="search-bar-cs"
            placeholder="Search card..."
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                checkSearchToggle();
              }
            }}
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          ></input>
          <input
            type="checkbox"
            id="checkbox-cs"
            className="checkbox"
            checked={isToggled}
            onChange={() => {}}
          ></input>
          <label
            id="checkbox-toggle-cs"
            htmlFor="checkbox-cs"
            className="checkbox-toggle"
            onChange={toggleSearch}
            onClick={() => toggleSearch()}
          ></label>
          <button
            id="clear-cs"
            className="button-clear"
            onClick={() => clearSearch()}
          >
            <FontAwesomeIcon icon={faMultiply} />
          </button>
        </div>
        <text id="num-cards" className="num-results">
          {numCards}
        </text>
      </div>
      <label id="user-popup-cs" className="user-popup"></label>
      <ImageList value={imageList}></ImageList>
    </div>
  );
}
