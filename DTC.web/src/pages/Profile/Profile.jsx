import { useState, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import {
  getLoginStatus,
  setUserPopup,
  createTokenAndStoreInCookie,
  deleteToken,
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

export default function Profile() {
  const navigate = useNavigate();

  const maxInputLength = 50;
  const minInputLength = 6;

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

  //Sign up
  async function signup() {
    if (
      username != "" &&
      username.length <= maxInputLength &&
      username.length >= minInputLength &&
      email != "" &&
      email.length <= maxInputLength &&
      email.length >= minInputLength &&
      password != "" &&
      password.length <= maxInputLength &&
      password.length >= minInputLength
    ) {
      const user = {
        username: username,
        email: email,
        password: password,
      };

      const response = await fetch("http://localhost:5272/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.text();

      if (!data.includes("message")) {
        alert("User '" + username + "' created.");
      } else {
        alert("Username '" + username + "' already in use.");
      }
    } else {
      alert(
        "Username and password:\nminumum: " +
          minInputLength +
          "\nmaximum: " +
          maxInputLength
      );
    }

    setUsername("");
    setEmail("");
    setPassword("");
  }

  //login
  async function login() {
    if (
      email != "" &&
      email.length <= maxInputLength &&
      email.length >= minInputLength &&
      password != "" &&
      password.length <= maxInputLength &&
      password.length >= minInputLength
    ) {
      const user = {
        email: email,
        password: password,
      };

      try {
        const response = await fetch("http://localhost:5272/user/login", {
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
        } else {
          createTokenAndStoreInCookie(token);
          setLoggedIn(true);
          alert("Login successful.");
        }
      } catch {
        alert("Login failed. Please try again.");
      }
    } else {
      alert(
        "Username and password:\nminumum: " +
          minInputLength +
          "\nmaximum: " +
          maxInputLength
      );
    }

    setUsername("");
    setEmail("");
    setPassword("");
    setUserPopup("pf");
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
      `http://localhost:5272/deck/users/${encodeURIComponent(username)}`,
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
    if (loggedIn) {
      const user = getUserInfoFromToken();

      getUserDecks(user.username);

      hide = ["email", "password", "login", "signup"];
      show = ["logout"];

      const username = document.getElementById("username");
      const auth = document.getElementById("auth");

      username.readOnly = true;
      username.style.textAlign = "center";
      username.style.marginBottom = "-20px";
      auth.style.height = "140px";
      setUsername(user.username);
    } else {
      setDecks([]);

      hide = ["logout"];
      show = ["email", "password", "login", "signup"];

      const username = document.getElementById("username");
      const auth = document.getElementById("auth");

      username.readOnly = false;
      username.style.textAlign = "start";
      username.style.marginBottom = "0px";
      auth.style.height = "235px";
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
              onKeyDown={(e) => setUsername(e.target.value0)}
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
          <div className="auth-buttons">
            <button
              id="login"
              className="login"
              onClick={() => {
                clearTooltipTimeout();
                login();
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
                signup();
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
      <DeckPane id="pf" decks={decks}></DeckPane>
    </div>
  );
}
