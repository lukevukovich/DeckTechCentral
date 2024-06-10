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
import { baseUrl } from "../../App";

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

  const [displayText, setDisplayText] = useState(true);

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

    for (let i = 0; i < jsonData.data.length; i++) {
      // Check if card_faces is present
      if (jsonData.data[i].card_faces == null) {
        if (jsonData.data[i].image_uris.length > 0) {
          // Test is flavor_text is present
          if (jsonData.data[i].flavor_text == null) {
            jsonData.data[i].flavor_text = "";
          }
          jsonData.data[i].image_uris = {
            large: jsonData.data[i].image_uris[2],
          };
          images.push(jsonData.data[i].image_uris.large);
        } else {
          jsonData.data.splice(i, 1);
          i--;
        }
      } else {
        if (
          jsonData.data[i].card_faces[0].image_uris.length > 0 &&
          jsonData.data[i].card_faces[1].image_uris.length > 0
        ) {
          //Face 1
          jsonData.data[i].name = jsonData.data[i].card_faces[0].name;
          jsonData.data[i].image_uris = {
            large: jsonData.data[i].card_faces[0].image_uris[2],
          };
          jsonData.data[i].type_line = jsonData.data[i].card_faces[0].type_line;
          jsonData.data[i].mana_cost = jsonData.data[i].card_faces[0].mana_cost;
          jsonData.data[i].oracle_text =
            jsonData.data[i].card_faces[0].oracle_text;
          if (jsonData.data[i].card_faces[0].flavor_text == null) {
            jsonData.data[i].flavor_text = "";
          } else {
            jsonData.data[i].flavor_text =
              jsonData.data[i].card_faces[0].flavor_text;
          }

          images.push(jsonData.data[i].card_faces[0].image_uris[2]);

          //Face 2
          jsonData.data[i].name_2 = jsonData.data[i].card_faces[1].name;
          (jsonData.data[i].image_uris.large_2 =
            jsonData.data[i].card_faces[1].image_uris[2]),
            (jsonData.data[i].type_line_2 =
              jsonData.data[i].card_faces[1].type_line);
          jsonData.data[i].mana_cost_2 =
            jsonData.data[i].card_faces[1].mana_cost;
          jsonData.data[i].oracle_text_2 =
            jsonData.data[i].card_faces[1].oracle_text;
          if (jsonData.data[i].card_faces[1].flavor_text == null) {
            jsonData.data[i].flavor_text_2 = "";
          } else {
            jsonData.data[i].flavor_text_2 =
              jsonData.data[i].card_faces[1].flavor_text;
          }
        } else {
          jsonData.data.splice(i, 1);
          i--;
        }
      }
    }

    return {
      images,
      processedData: jsonData.data,
    };
  };

  //Handle card seach to Scryfall API
  const searchCard = async () => {
    setDisplayText(false);
    navigate(`/cardsearch?card=${cardName}`);

    setData([]);
    setImageList([]);
    try {
      //Make request
      const response = await fetch(
        baseUrl + `/card/search?q=${encodeURIComponent(cardName)}`
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
      if (cards == undefined) {
        //Set num cards to none
        setNumCards("No cards found for '" + cardName.toLowerCase() + "'");
      }
      else if (cards == 1) {
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

  useEffect(() => {
    if (imageList.length > 0) {
      for (let i = 0; i < imageList.length; i++) {
        const flipCardButton = document.getElementById("card-image-flip-" + i);
        if (data[i].card_faces != null) {
          flipCardButton.style.opacity = "100%";
        }
      }
    }
  }, [imageList]);

  useEffect(() => {
    const text = document.getElementById("cs-text");
    if (!displayText) {
      text.style.display = "none";
    } else {
      text.style.display = "flex";
    }
  }, [displayText]);

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
        data={data}
        showCardDetails={showCardDetails}
      ></CardPane>
      <div className="cs-text" id="cs-text">
        <text>Search for a card.</text>
      </div>
    </div>
  );
}
