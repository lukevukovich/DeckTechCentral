import { useState, useEffect } from "react";
import "./CardSearch.css";
import { useNavigate } from "react-router-dom";
import { getLoginStatus, setUserPopup } from "../../auth/User";
import { maxSearchLength } from "../../assets/DTCHeader/DTCHeader";
import DTCHeader from "../../assets/DTCHeader/DTCHeader";
import CardModal from "../../assets/CardModal/CardModal";
import Modal from "react-modal";
import CardPane from "../../assets/CardPane/CardPane";
import useQuery from "../../assets/useQuery";

Modal.setAppElement("#root");

export default function CardSearch() {
  //Set working variables
  const navigate = useNavigate();
  const query = useQuery();

  //Use state for search toggle
  const [isToggled, setIsToggled] = useState(true);

  //Set initial search text based on dashboard
  const [searchText, setSearchText] = useState(query.get("card"));

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
    image_uris: { large: "" },
    type_line: "",
    oracle_text: "",
    mana_cost: "",
    flavor_text: "",
  });

  //Check for Google login, set popup
  function checkLogin() {
    const s = getLoginStatus();
    if (s) {
      setUserPopup("cs");
    } else {
      setUserPopup("cs");
    }
  }

  //Check search toggle and handle accordingly
  function checkSearchToggle() {
    if (cardName != "" && cardName.length <= maxSearchLength) {
      setNumCards("");
      if (!isToggled) {
        navigate(`/decksearch?deck=${cardName}`);
      } else {
        searchCard();
      }
    }
  }

  useEffect(() => {
    //Check for login and set popup
    checkLogin();

    //Go to top of page
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Call searchCard when searchText changes
    if (searchText != null) {
      searchCard();
    }
  }, [searchText]);

  //Process card JSON result
  const processData = (jsonData) => {
    const images = [];
    const removeCards = [];

    for (let i = 0; i < jsonData.data.length; i++) {
      try {
        // Check if card_faces is present
        if (jsonData.data[i].card_faces == null) {
          // Test is flavor_text is present
          if (jsonData.data[i].flavor_text == null) {
            jsonData.data[i].flavor_text = "";
          }
          images.push(jsonData.data[i].image_uris[2]);
          jsonData.data[i].image_uris = {
            large: jsonData.data[i].image_uris[2],
          };
        }
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
    setData([0]);
    navigate(`/cardsearch?card=${cardName}`);

    setImageList([]);
    try {
      //Make request
      const response = await fetch(
        `http://localhost:5272/card/search?q=${encodeURIComponent(cardName)}`
      );
      const rawData = await response.json();
      const jsonData = {
        data: rawData,
      };

      const { images, processedData } = processData(jsonData);
      const cards = processedData.length;

      //Set data
      setData(processedData);

      //Set image list
      setImageList(images);

      //Set num cards
      if (cards == 1) {
        setNumCards(cards + " card found for '" + cardName.toLowerCase() + "'");
      } else {
        setNumCards(
          cards + " cards found for '" + cardName.toLowerCase() + "'"
        );
      }
    } catch (error) {
      //Set num cards to none
      setData([0]);
      setNumCards("No cards found for '" + cardName.toLowerCase() + "'");
    }
  };

  useEffect(() => {
    const text = document.getElementById("cs-text");
    if (data.length != 0) {
      text.style.display = "none";
    } else {
      text.style.display = "flex";
    }
  }, [data]);

  //Clear search and image list
  function clearSearch() {
    setCardName("");
  }

  //Set selected card and show modal
  function showCardDetails(index) {
    setSelectedCard(data[index]);
    document.body.style.overflow = "hidden";
    setModal(true);
  }

  //Create all components
  return (
    <div id="cs-all">
      <CardModal
        id="cs"
        modal={modal}
        setModal={setModal}
        selectedCard={selectedCard}
      ></CardModal>
      <DTCHeader
        id="cs"
        inputText="Search card..."
        inputValue={cardName}
        inputOnChange={setCardName}
        isToggled={isToggled}
        setIsToggled={setIsToggled}
        search={checkSearchToggle}
        clearSearch={clearSearch}
        navigate={navigate}
      ></DTCHeader>
      <div id="num-decks">
        <text className="num-results">{numCards}</text>
      </div>
      <CardPane
        id={"cs"}
        imageList={imageList}
        showCardDetails={showCardDetails}
      ></CardPane>
      <div className="cs-text" id="cs-text">
        <text>Search for a card.</text>
      </div>
    </div>
  );
}
