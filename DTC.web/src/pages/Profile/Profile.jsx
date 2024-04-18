import { useState, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import {
  getLoginStatus,
  setUserPopup,
  createTokenAndStoreInCookie,
  getUserInfoFromToken,
} from "../../auth/User";
import { maxSearchLength } from "../../assets/DTCHeader/DTCHeader";
import DTCHeader from "../../assets/DTCHeader/DTCHeader";
import {
  clearTooltipTimeout,
  hideTooltip,
  showTooltip,
} from "../../assets/Tooltip";
import DeckPane from "../../assets/DeckPane/DeckPane";
import { baseUrl } from "../../App";

export default function Profile() {
  const navigate = useNavigate();

  const maxUser = 20;
  const minUser = 3;
  const maxEmailPassword = 50;
  const minEmailPassword = 6;

  //Use state for input
  const [input, setInput] = useState("");

  //Auth input fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  //Use state for search toggle
  const [isToggled, setIsToggled] = useState(false);

  //Use state for user decks
  const [decks, setDecks] = useState([]);

  const [loginTab, setLoginTab] = useState("login");

  //Check to see if user is logged in
  async function checkLogin() {
    const s = getLoginStatus();
    if (s) {
      setLoggedIn(true);
      setUserPopup("pf");
    } else {
      setUserPopup("pf");
    }
  }

  useEffect(() => {
    const username = document.getElementById("username");

    let button;
    let notButton;

    if (loginTab == "login") {
      username.style.display = "none";
      button = document.getElementById("login");
      notButton = document.getElementById("signup");
    } else {
      username.style.display = "block";
      button = document.getElementById("signup");
      notButton = document.getElementById("login");
    }

    button.classList.remove("button-not-selected");
    button.classList.add("button-selected");

    notButton.classList.remove("button-selected");
    notButton.classList.add("button-not-selected");
  }, [loginTab]);

  //Sign up
  async function signup() {
    if (
      username.length <= maxUser &&
      username.length >= minUser &&
      !username.includes(" ") &&
      email.length <= maxEmailPassword &&
      email.length >= minEmailPassword &&
      !email.includes(" ") &&
      password.length <= maxEmailPassword &&
      password.length >= minEmailPassword &&
      !password.includes(" ")
    ) {
      const user = {
        username: username,
        email: email,
        password: password,
      };

      const response = await fetch(baseUrl + "/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.text();
      console.log(data);

      if (!data.includes("message")) {
        alert("User '" + username + "' created. Welcome to DeckTechCentral!");
        setLoginTab("login");
      } else {
        alert("Username '" + username + "' already in use. Please try again.");
        setLoginTab("signup");
      }
    } else {
      alert(
        "Username:\n    Minimum: " +
          minUser +
          "\n    Maximum: " +
          maxUser +
          "\n    No spaces" +
          "\n\nEmail & Password:\n    Minimum: " +
          minEmailPassword +
          "\n    Maximum: " +
          maxEmailPassword +
          "\n    No spaces"
      );
      setLoginTab("signup");
    }

    setUsername("");
    setEmail("");
    setPassword("");
  }

  //login
  async function login() {
    if (
      email.length <= maxEmailPassword &&
      email.length >= minEmailPassword &&
      !email.includes(" ") &&
      password.length <= maxEmailPassword &&
      password.length >= minEmailPassword &&
      !password.includes(" ")
    ) {
      const user = {
        email: email,
        password: password,
      };

      try {
        const response = await fetch(baseUrl + "/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        //Create token
        const token = await response.json();

        if ("message" in token) {
          alert("Login failed. Please try again.");
          setLoginTab("login");
        } else {
          createTokenAndStoreInCookie(token);
          setLoggedIn(true);
          alert("Login successful. Welcome back, " + token.username + "!");
        }
      } catch {
        alert("Login failed. Please try again.");
        setLoginTab("login");
      }
    } else {
      alert(
        "Email & Password:\n    Minimum: " +
          minEmailPassword +
          "\n    Maximum: " +
          maxEmailPassword +
          "\n    No spaces"
      );
      setLoginTab("login");
    }

    setUsername("");
    setEmail("");
    setPassword("");
    setUserPopup("pf");
  }

  //Manually delete token, useful for logout
  function deleteToken() {
    document.cookie =
      "userToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  //Logout from signed in user
  function logout() {
    deleteToken();
    setLoggedIn(false);
    setUserPopup("pf");
  }

  useEffect(() => {
    //Check login, set user info
    checkLogin();

    sessionStorage.clear();
  }, []);

  //Get list of user created decks
  async function getUserDecks(username) {
    //Make request
    const response = await fetch(
      baseUrl + `/deck/users/${encodeURIComponent(username)}`,
      {
        method: "GET", // or 'POST', 'PUT', etc.
        headers: {
          "Content-Type": "application/json",
          requestingUser: username,
        },
      }
    );
    const rawData = await response.json();

    setDecks(rawData);
  }

  useEffect(() => {
    let hide;
    let show;
    const username = document.getElementById("username");
    const auth = document.getElementById("auth");
    const deckText = document.getElementById("your-decks-text");

    if (loggedIn) {
      deckText.style.display = "flex";

      const user = getUserInfoFromToken();
      getUserDecks(user.username);

      hide = ["email", "password", "login", "signup"];
      show = ["logout", "username"];

      username.readOnly = true;
      username.style.textAlign = "center";
      username.style.marginBottom = "-20px";
      username.style.backgroundColor = "transparent";
      auth.style.height = "140px";
      document.getElementById("deck-pane-pf").style.display = "grid";
      setUsername("Hello, " + user.username);
    } else {
      deckText.style.display = "none";

      setDecks([]);

      hide = ["logout", "username"];
      show = ["email", "password", "login", "signup"];

      username.readOnly = false;
      username.style.textAlign = "start";
      username.style.marginBottom = "0px";
      username.style.backgroundColor = "rgb(121, 27, 27)";
      auth.style.height = "235px";
      document.getElementById("deck-pane-pf").style.display = "none";
      setUsername("");
    }

    for (let i = 0; i < hide.length; i++) {
      document.getElementById(hide[i]).style.display = "none";
    }

    for (let i = 0; i < show.length; i++) {
      document.getElementById(show[i]).style.display = "block";
    }
  }, [loggedIn]);

  //Search deck/card based on toggle
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

  // Create all components
  return (
    <div id="pf-all">
      <DTCHeader
        id="pf"
        inputText="Search deck list..."
        inputValue={input}
        inputOnChange={setInput}
        isToggled={isToggled}
        setIsToggled={setIsToggled}
        search={search}
        clearSearch={clearSearch}
        navigate={navigate}
      ></DTCHeader>
      <div className="auth" id="auth">
        <div className="auth-bkg">
          <div className="auth-input">
            <input
              id="username"
              className="username"
              value={username}
              placeholder="Username"
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => setUsername(e.target.value)}
            ></input>
            <input
              id="email"
              className="email"
              value={email}
              placeholder="Email"
              autoComplete="new-password"
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              onKeyDown={(e) => setEmail(e.target.value.toLowerCase())}
            ></input>
            <input
              id="password"
              type="password"
              className="password"
              value={password}
              placeholder="Password"
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div className="auth-buttons" id="auth-buttons">
            <button
              id="login"
              className="login"
              onClick={() => {
                clearTooltipTimeout();
                if (loginTab == "login") {
                  login();
                } else {
                  setLoginTab("login");
                }
              }}
              onMouseEnter={(e) => {
                showTooltip("pf", e, "Log in to DeckTechCentral");
              }}
              onMouseLeave={() => hideTooltip("pf")}
            >
              Login
            </button>
            <button
              id="signup"
              className="signup"
              onClick={() => {
                clearTooltipTimeout();
                if (loginTab == "signup") {
                  signup();
                } else {
                  setLoginTab("signup");
                }
              }}
              onMouseEnter={(e) => {
                showTooltip("pf", e, "Sign up for DeckTechCentral");
              }}
              onMouseLeave={() => hideTooltip("pf")}
            >
              Sign Up
            </button>
          </div>
          <div className="auth-button">
            <button
              id="logout"
              className="logout"
              onClick={() => {
                clearTooltipTimeout();
                logout();
              }}
              onMouseEnter={(e) => {
                showTooltip("pf", e, "Log out of DeckTechCentral");
              }}
              onMouseLeave={() => hideTooltip("pf")}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="your-decks-text" id="your-decks-text">
        <text>Your Decks.</text>
      </div>
      <DeckPane id="pf" decks={decks}></DeckPane>
    </div>
  );
}
