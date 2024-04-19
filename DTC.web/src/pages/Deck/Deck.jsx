import { useState, useEffect, useRef } from "react";
import "./Deck.css";
import { useNavigate } from "react-router-dom";
import {
  getLoginStatus,
  getUserInfoFromToken,
  setUserPopup,
} from "../../auth/User";
import { maxSearchLength } from "../../assets/DTCHeader/DTCHeader";
import DTCHeader from "../../assets/DTCHeader/DTCHeader";
import { loadDeck as load } from "../../assets/LoadDeck";
import DeckBoard from "../../assets/DeckBoard/DeckBoard";
import {
  faUser,
  faThumbsUp,
  faEye,
  faFloppyDisk,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import {
  faThumbsUp as faThumbsUpRegular,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatNumber } from "../../assets/FormatNumber";
import {
  showTooltip,
  hideTooltip,
  clearTooltipTimeout,
} from "../../assets/Tooltip";
import useQuery from "../../assets/useQuery";
import { baseUrl } from "../../App";

export default function Deck() {
  const navigate = useNavigate();
  const query = useQuery();

  //Deck Id to load
  const deckId = query.get("id");

  const [deck, setDeck] = useState(load);

  const hasRunOnceRef = useRef(false);

  //Get list of elements that become editable
  const editableElements = [
    "deck-view-name",
    "deck-view-format",
    "deck-view-desc",
  ];

  //Get list of elements that are shown during edit
  const showOnEdit = ["deck-view-add-card", "delete-button"];

  //Get list of elements that are hidden during edit
  const hideOnEdit = ["like-button"];

  //Edit state
  const [edit, setEdit] = useState(null);

  //Edit icon state
  const [editIcon, setEditIcon] = useState(faPenToSquare);

  //Edit tooltip text
  const [editTooltip, setEditTooltip] = useState("Edit deck");

  //Like state
  const [like, setLike] = useState(false);

  const [likeIcon, setLikeIcon] = useState(faThumbsUpRegular);

  //Use state for input
  const [input, setInput] = useState("");

  //Use state for search toggle
  const [isToggled, setIsToggled] = useState(false);

  const [board, setBoard] = useState(deck.mainboard);

  const [name, setName] = useState(deck.name);

  const [format, setFormat] = useState(deck.format);

  const [description, setDescription] = useState(deck.description);

  const nameMin = 1;
  const nameMax = 24;
  const formatMin = 1;
  const formatMax = 20;
  const descMin = 0;
  const descMax = 200;

  //Check for Google login, set popup
  function checkLogin() {
    const s = getLoginStatus();
    if (s) {
      setUserPopup("dv");
    } else {
      setUserPopup("dv");
    }
  }

  function search() {
    if (input != "" && input.length <= maxSearchLength) {
      if (!isToggled) {
        navigate(`/decksearch?deck=${input}`);
        setInput("");
      } else {
        navigate(`/cardsearch?card=${input}`);
        setInput("");
      }
    }
  }

  //Clear search
  function clearSearch() {
    setInput("");
  }

  function tabSelect(newBoard, boardName) {
    if (board != newBoard) {
      const buttons = [
        document.getElementById("tablink-mainboard"),
        document.getElementById("tablink-sideboard"),
        document.getElementById("tablink-considering"),
      ];

      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "transparent";
        buttons[i].style.color = "black";
        buttons[i].classList.add("button-effect-hover");
        buttons[i].style.boxShadow = "none";
      }

      const buttonSelected = document.getElementById("tablink-" + boardName);
      buttonSelected.style.backgroundColor = "rgb(158, 55, 55)";
      buttonSelected.style.color = "rgb(255, 251, 234)";
      buttonSelected.classList.remove("button-effect-hover");
      buttonSelected.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.35)";

      setBoard(newBoard);
    }
  }

  function setInitialTabs() {
    document.getElementById("tablink-mainboard").style.backgroundColor =
      "rgb(158, 55, 55)";
    document.getElementById("tablink-mainboard").style.color =
      "rgb(255, 251, 234)";
    document.getElementById("tablink-mainboard").style.boxShadow =
      "0 4px 8px rgba(0, 0, 0, 0.35)";
    document
      .getElementById("tablink-sideboard")
      .classList.add("button-effect-hover");
    document
      .getElementById("tablink-considering")
      .classList.add("button-effect-hover");
  }

  function setEditStates() {
    if (edit) {
      var buttonIcon = faFloppyDisk;
      var tooltip = "Save deck";
      var padding = "1px";
      var editable = true;
      var showDisplay = "block";
      var hideDisplay = "none";
      var outline = true;
    } else {
      var buttonIcon = faPenToSquare;
      var tooltip = "Edit deck";
      var padding = "2px";
      var editable = false;
      var showDisplay = "none";
      var hideDisplay = "block";
      var outline = false;
    }

    setEditIcon(buttonIcon);
    setEditTooltip(tooltip);
    document.getElementById("edit-button").style.paddingLeft = padding;

    try {
      for (let i = 0; 0 < editableElements.length; i++) {
        var element = document.getElementById(editableElements[i]);
        element.contentEditable = editable;
        if (outline) {
          element.classList.add("deck-view-edit");
        } else {
          element.classList.remove("deck-view-edit");
        }
      }
    } catch {}

    try {
      for (let i = 0; 0 < showOnEdit.length; i++) {
        var element = document.getElementById(showOnEdit[i]);
        element.style.display = showDisplay;
      }
    } catch {}

    try {
      for (let i = 0; 0 < hideOnEdit.length; i++) {
        var element = document.getElementById(hideOnEdit[i]);
        element.style.display = hideDisplay;
      }
    } catch {}
  }

  //Set like icon based on like state
  useEffect(() => {
    if (like) {
      setLikeIcon(faThumbsUp);
    } else {
      setLikeIcon(faThumbsUpRegular);
    }
  }, [like]);

  //IMPORTANT: When edit state it changed *********************
  useEffect(() => {
    if (edit != null) {
      setEditStates();
    }
  }, [edit]);

  function handleAddCardClick() {
    sessionStorage.clear();
    sessionStorage.setItem("deck", JSON.stringify(deck));
    navigate("/cardsearch");
  }

  //Check if card was sent to page, if so add card
  function checkForCardAdd() {
    const card = JSON.parse(sessionStorage.getItem("card"));

    if (card != null) {
      let newDeck = JSON.parse(sessionStorage.getItem("deck"));

      const board = card.board;
      const number = card.amount;

      const original_type_line = card.type_line;

      if (card.type_line.includes("—")) {
        card.type_line = card.type_line.split("—")[0].slice(0, -1);
      }

      let newCard;

      console.log(card);

      if (!"name_2" in card) {
        newCard = {
          amount: number,
          CardInfo: {
            name: card.name,
            id: card.id,
            mana_cost: card.mana_cost,
            cmc: card.cmc,
            type_line: card.type_line,
            original_type_line: original_type_line,
            oracle_text: card.oracle_text,
            flavor_text: card.flavor_text,
            image_uris: { large: card.image_uris.large },
          },
        };
      } else {
        newCard = {
          amount: number,
          CardInfo: {
            name: card.name,
            name_2: card.name_2,
            id: card.id,
            mana_cost: card.mana_cost,
            mana_cost_2: card.mana_cost_2,
            cmc: card.cmc,
            type_line: card.type_line,
            type_line_2: card.type_line_2,
            original_type_line: original_type_line,
            oracle_text: card.oracle_text,
            oracle_text_2: card.oracle_text_2,
            flavor_text: card.flavor_text,
            flavor_text_2: card.flavor_text_2,
            image_uris: {
              large: card.image_uris.large,
              large_2: card.image_uris.large_2,
            },
          },
        };
      }

      //Add card to board
      newDeck[board].push(newCard);

      sessionStorage.clear();

      setEdit(true);

      return newDeck;
    } else {
      return null;
    }
  }

  //Load deck on page load
  async function loadDeck() {
    //Must remove this block of code when deployed!!!!!!!!!!!!!!!!!!!!!
    if (hasRunOnceRef.current) {
      const loadDeck = checkForCardAdd();
      const loginStatus = getLoginStatus();
      const userInfo = getUserInfoFromToken();

      if (loadDeck == null) {
        if (deckId == null) {
          if (loginStatus) {
            const u = userInfo.username;
            const username = u;
            const newDeck = { ...deck };
            newDeck.editors[0] = username;
            setDeck(newDeck);
            document.getElementById("edit-button").style.display = "block";
            setEdit(true);
          } else {
            navigate("/profile");
            alert("Must be logged in to create a deck.");
          }
        } else {
          if (deckId == "") {
            navigate("/*");
          }
          if (loginStatus) {
            document.getElementById("like-button").style.display = "block";
          }

          let deckFetch;
          if (loginStatus) {
            deckFetch = {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: userInfo.token,
              },
            };
          } else {
            deckFetch = {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            };
          }

          try {
            const response = await fetch(
              baseUrl + `/deck/${encodeURIComponent(deckId)}`,
              deckFetch
            );
            const deck = await response.json();

            if ("status" in deck) {
              navigate("/*");
            } else {
              const boardList = ["mainboard", "sideboard", "considering"];

              for (let i = 0; i < boardList.length; i++) {
                for (let j = 0; j < deck[boardList[i]].length; j++) {
                  const card = deck[boardList[i]][j];
                  card.CardInfo.faces = card.CardInfo.card_faces;
                  card.CardInfo.card_faces = null;

                  const commander = card.is_commander;

                  if (card.CardInfo.faces != null) {
                    card.CardInfo.original_type_line =
                      card.CardInfo.faces[0].type_line;

                    //Face 1
                    card.CardInfo.name = card.CardInfo.faces[0].name;
                    card.CardInfo.image_uris = {
                      large: card.CardInfo.faces[0].image_uris[2],
                    };
                    card.CardInfo.type_line = card.CardInfo.faces[0].type_line;
                    card.CardInfo.mana_cost = card.CardInfo.faces[0].mana_cost;
                    card.CardInfo.oracle_text =
                      card.CardInfo.faces[0].oracle_text;
                    if (card.CardInfo.faces[0].flavor_text == null) {
                      card.CardInfo.flavor_text = "";
                    } else {
                      card.CardInfo.flavor_text =
                        card.CardInfo.faces[0].flavor_text;
                    }

                    //Face 2
                    card.CardInfo.name_2 = card.CardInfo.faces[1].name;
                    (card.CardInfo.image_uris.large_2 =
                      card.CardInfo.faces[1].image_uris[2]),
                      (card.CardInfo.type_line_2 =
                        card.CardInfo.faces[1].type_line);
                    card.CardInfo.mana_cost_2 =
                      card.CardInfo.faces[1].mana_cost;
                    card.CardInfo.oracle_text_2 =
                      card.CardInfo.faces[1].oracle_text;
                    if (card.CardInfo.faces[1].flavor_text == null) {
                      card.CardInfo.flavor_text_2 = "";
                    } else {
                      card.CardInfo.flavor_text_2 =
                        card.CardInfo.faces[1].flavor_text;
                    }
                  } else {
                    card.CardInfo.original_type_line = card.CardInfo.type_line;
                    if (card.CardInfo.flavor_text == null) {
                      card.CardInfo.flavor_text = "";
                    }
                    card.CardInfo.image_uris = {
                      large: card.CardInfo.image_uris[2],
                    };
                  }

                  if (commander) {
                    card.CardInfo.type_line = "Commander";
                  } else if (card.CardInfo.type_line.includes("—")) {
                    card.CardInfo.type_line = card.CardInfo.type_line
                      .split("—")[0]
                      .split(" // ")[0]
                      .slice(0, -1);
                  }
                }
              }
              if (loginStatus) {
                if (userInfo.username == deck.editors[0]) {
                  document.getElementById("edit-button").style.display =
                    "block";
                }
              }
              if (loginStatus) {
                setLike(deck.liked);
              }
              setDeck(deck);
            }
          } catch {
            navigate("/*");
          }
        }
      } else {
        document.getElementById("edit-button").style.display = "block";
        setDeck(loadDeck);
      }
    } else {
      hasRunOnceRef.current = true;
    }
  }

  //Load board during deck change
  useEffect(() => {
    const tablinks = [
      document.getElementById("tablink-mainboard"),
      document.getElementById("tablink-sideboard"),
      document.getElementById("tablink-considering"),
    ];

    for (let i = 0; i < tablinks.length; i++) {
      const tablinkText = tablinks[i].id.slice(8);
      if (tablinks[i].style.backgroundColor == "rgb(158, 55, 55)") {
        setBoard(deck[tablinkText]);
        break;
      }
    }

    setName(deck.name);
    setFormat(deck.format);
    setDescription(deck.description);
  }, [deck]);

  useEffect(() => {
    const newDeck = { ...deck };
    newDeck.name = name;
    newDeck.format = format;
    newDeck.description = description;

    setDeck(newDeck);
  }, [name, format, description]);

  useEffect(() => {
    //Check for login and set popup
    checkLogin();

    loadDeck();

    setInitialTabs();
  }, []);

  function validInfo() {
    const nameText = document.getElementById("deck-view-name").textContent;
    const formatText = document.getElementById("deck-view-format").textContent;
    const descText = document.getElementById("deck-view-desc").textContent;

    if (
      nameText.length <= nameMax &&
      nameText.length >= nameMin &&
      formatText.length <= formatMax &&
      formatText.length >= formatMin &&
      descText.length <= descMax &&
      descText.length >= descMin
    ) {
      return true;
    } else {
      return false;
    }
  }

  function alertInvalidInfo() {
    alert(
      "Deck Name:\n    Minimum: " +
        nameMin +
        "\n    Maximum: " +
        nameMax +
        "\nFormat:\n    Minimum: " +
        formatMin +
        "\n    Maximum: " +
        formatMax +
        "\nDescription:\n    Minimum: " +
        descMin +
        "\n    Maximum: " +
        descMax
    );
  }

  async function saveNewDeck() {
    if (validInfo()) {
      const { likes, views, editors, ...saveDeck } = deck;

      const boardList = ["mainboard", "sideboard", "considering"];

      for (let i = 0; i < boardList.length; i++) {
        saveDeck[boardList[i]] = [];
        for (let j = 0; j < deck[boardList[i]].length; j++) {
          const amount = deck[boardList[i]][j].amount;
          const id = deck[boardList[i]][j].CardInfo.id;

          let isCommander;
          if (deck[boardList[i]][j].CardInfo.type_line == "Commander") {
            isCommander = true;
          } else {
            isCommander = false;
          }

          const saveCard = {
            amount: amount,
            card_id: id,
            is_commander: isCommander,
          };

          saveDeck[boardList[i]].push(saveCard);
        }
      }

      const cookie = getUserInfoFromToken();
      const token = cookie.token;

      const response = await fetch(baseUrl + "/deck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(saveDeck),
      });

      const d = await response.json();
      navigate(`/deck?id=${d.id}`);

      setEdit(!edit);
    } else {
      alertInvalidInfo();
    }
  }

  async function saveDeck() {
    if (validInfo()) {
      const { likes, views, editors, ...saveDeck } = deck;

      const boardList = ["mainboard", "sideboard", "considering"];

      for (let i = 0; i < boardList.length; i++) {
        saveDeck[boardList[i]] = [];
        for (let j = 0; j < deck[boardList[i]].length; j++) {
          const amount = deck[boardList[i]][j].amount;
          const id = deck[boardList[i]][j].CardInfo.id;

          let isCommander;
          if (deck[boardList[i]][j].CardInfo.type_line == "Commander") {
            isCommander = true;
          } else {
            isCommander = false;
          }

          const saveCard = {
            amount: amount,
            card_id: id,
            is_commander: isCommander,
          };

          saveDeck[boardList[i]].push(saveCard);
        }
      }

      const cookie = getUserInfoFromToken();
      const token = cookie.token;

      await fetch(baseUrl + `/deck/${encodeURIComponent(saveDeck.id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(saveDeck),
      });

      setEdit(!edit);
    } else {
      alertInvalidInfo();
    }
  }

  async function deleteDeck() {
    if (query.get("id") == null) {
      navigate("/");
      alert("Deck scrapped.");
    } else {
      if (deck.id == null) {
        deck.id = query.get("id");
      }

      const token = getUserInfoFromToken().token;

      await fetch(baseUrl + `/deck/${encodeURIComponent(deck.id)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      navigate("/");
      alert("Deck deleted.");
    }
  }

  async function likeDeck() {
    const token = getUserInfoFromToken().token;

    const response = await fetch(
      baseUrl + `/deck/${encodeURIComponent(deckId)}/like`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const justLiked = await response.json();
    if (justLiked) {
      deck.likes += 1;
    } else {
      deck.likes -= 1;
    }

    setLike(!like);
  }

  return (
    <div id="dv-all">
      <DTCHeader
        id="dv"
        inputText="Search deck list..."
        inputValue={input}
        inputOnChange={setInput}
        isToggled={isToggled}
        setIsToggled={setIsToggled}
        search={search}
        clearSearch={clearSearch}
        navigate={navigate}
      ></DTCHeader>
      <div className="deck-view">
        <div className="deck-view-panel">
          <div
            className="deck-view-cover"
            onMouseEnter={(e) => showTooltip("dv", e, "Cover image")}
            onMouseLeave={() => hideTooltip("dv")}
          >
            <img src={deck.cover_image}></img>
          </div>
          <div className="deck-view-info">
            <div className="deck-view-name-edit">
              <text
                id="deck-view-name"
                className="deck-view-name"
                onMouseEnter={(e) => showTooltip("dv", e, "Deck name")}
                onMouseLeave={() => hideTooltip("dv")}
                onBlur={(e) => {
                  setName(e.currentTarget.innerText);
                  e.currentTarget.style.fontFamily = "Arial";
                }}
              >
                {name}
              </text>
              <FontAwesomeIcon
                icon={likeIcon}
                id="like-button"
                className="like-button"
                onClick={() => {
                  clearTooltipTimeout();
                  likeDeck();
                }}
                onMouseEnter={(e) => showTooltip("dv", e, "Like deck")}
                onMouseLeave={() => hideTooltip("dv")}
              ></FontAwesomeIcon>
              <button
                id="edit-button"
                className="edit-button"
                onClick={() => {
                  clearTooltipTimeout();
                  if (edit) {
                    if (deckId == null) {
                      saveNewDeck();
                    } else {
                      saveDeck();
                    }
                  } else {
                    setEdit(!edit);
                  }
                }}
                onMouseEnter={(e) => showTooltip("dv", e, editTooltip)}
                onMouseLeave={() => hideTooltip("dv")}
              >
                <FontAwesomeIcon icon={editIcon} />
              </button>
              <button
                id="delete-button"
                className="delete-button"
                onClick={() => {
                  clearTooltipTimeout();
                  deleteDeck();
                }}
                onMouseEnter={(e) => showTooltip("dv", e, "Delete/Scrap deck")}
                onMouseLeave={() => hideTooltip("dv")}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
            <div
              className="deck-view-format"
              id="deck-view-format"
              onMouseEnter={(e) => showTooltip("dv", e, "Deck format")}
              onMouseLeave={() => hideTooltip("dv")}
              onBlur={(e) => {
                setFormat(e.currentTarget.innerText);
                e.currentTarget.style.fontFamily = "Arial";
                e.currentTarget.style.color = "rgb(90, 90, 90)";
              }}
            >
              <text> {format}</text>
            </div>
            <div
              id="deck-view-desc"
              className="deck-view-desc"
              onMouseEnter={(e) => showTooltip("dv", e, "Deck description")}
              onMouseLeave={() => hideTooltip("dv")}
              onBlur={(e) => {
                setDescription(e.currentTarget.innerText);
                e.currentTarget.style.fontFamily = "Arial";
                e.currentTarget.style.color = "rgb(66, 66, 66)";
              }}
            >
              <text>{description}</text>
            </div>
          </div>
        </div>
        <div className="deck-view-stats">
          <text className="deck-view-text deck-view-author">
            <FontAwesomeIcon icon={faUser} className="deck-view-icon" />
            {deck.editors[0]}
          </text>
          <text className="deck-view-text deck-view-text-left deck-view-text-reg">
            <FontAwesomeIcon icon={faThumbsUp} className="deck-view-icon" />
            {formatNumber(deck.likes)}
          </text>
          <text className="deck-view-text deck-view-text-reg">
            <FontAwesomeIcon icon={faEye} className="deck-view-icon" />
            {formatNumber(deck.views)}
          </text>
        </div>
        <div className="deck-view-tabs">
          <button
            id="tablink-mainboard"
            className="deck-view-tablinks"
            onClick={() => {
              clearTooltipTimeout();
              tabSelect(deck.mainboard, "mainboard");
            }}
            onMouseEnter={(e) => showTooltip("dv", e, "View mainboard")}
            onMouseLeave={() => hideTooltip("dv")}
          >
            Mainboard
          </button>
          <button
            id="tablink-sideboard"
            className="deck-view-tablinks"
            onClick={() => {
              clearTooltipTimeout();
              tabSelect(deck.sideboard, "sideboard");
            }}
            onMouseEnter={(e) => showTooltip("dv", e, "View sideboard")}
            onMouseLeave={() => hideTooltip("dv")}
          >
            Sideboard
          </button>
          <button
            id="tablink-considering"
            className="deck-view-tablinks"
            onClick={() => {
              clearTooltipTimeout();
              tabSelect(deck.considering, "considering");
            }}
            onMouseEnter={(e) => showTooltip("dv", e, "View considering")}
            onMouseLeave={() => hideTooltip("dv")}
          >
            Considering
          </button>
        </div>
        <button
          id="deck-view-add-card"
          className="deck-view-add-card"
          onClick={() => {
            clearTooltipTimeout();
            handleAddCardClick();
          }}
          onMouseEnter={(e) => showTooltip("dv", e, "Add card to deck")}
          onMouseLeave={() => hideTooltip("dv")}
        >
          Add Card
        </button>
        <DeckBoard
          board={board}
          setBoard={setBoard}
          edit={edit}
          deck={deck}
          setDeck={setDeck}
        ></DeckBoard>
      </div>
    </div>
  );
}
