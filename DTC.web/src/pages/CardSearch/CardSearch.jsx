import { useState, useEffect } from "react";
import "./CardSearch.css";
import { useNavigate } from "react-router-dom";
import { awaitLoginStatus, getUserInfo, setUserPopup } from "../../oauth/User";
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
  async function checkLogin() {
    const s = await awaitLoginStatus();
    if (s) {
      const u = getUserInfo();
      setUserPopup(u, "cs");
    } else {
      setUserPopup(null, "cs");
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
        if (jsonData.data[i].hasOwnProperty("card_faces")) {
          // If present, check if two images or one image
          const faces = jsonData.data[i].card_faces;
          if (faces[0].hasOwnProperty("image_uris")) {
            // Two images
            jsonData.data.splice(i, 1);
            jsonData.data.splice(i, 0, faces[1]);
            jsonData.data.splice(i, 0, faces[0]);
          } else {
            // One image
            const numFaces = jsonData.data[i].card_faces.length;
            jsonData.data[i].oracle_text = "";
            for (let j = 0; j < numFaces; j++) {
              let face_text = jsonData.data[i].card_faces[j].oracle_text;
              jsonData.data[i].oracle_text += " | " + face_text;
            }
            jsonData.data[i].oracle_text =
              jsonData.data[i].oracle_text.substring(3);
          }
        }

        // Test is flavor_text is present
        if (!jsonData.data[i].hasOwnProperty("flavor_text")) {
          jsonData.data[i].flavor_text = "";
        }
        images.push(jsonData.data[i].image_uris.large);
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
    let navigateString = `/cardsearch?card=${cardName}`;
    navigate(navigateString);

    setData([]);
    setImageList([]);
    try {
      //Make request
      const response = await fetch(
        `http://localhost:5272/card/search?q=${encodeURIComponent(
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
        setNumCards(cards + " card found for '" + cardName.toLowerCase() + "'");
      } else {
        setNumCards(
          cards + " cards found for '" + cardName.toLowerCase() + "'"
        );
      }
    } catch (error) {
      //Set num cards to none
      setNumCards("No cards found for '" + cardName.toLowerCase() + "'");
    }
  };

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
    </div>
  );
}
