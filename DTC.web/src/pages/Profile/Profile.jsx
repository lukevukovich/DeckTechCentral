import { useState, useEffect } from "react";
import "./Profile.css";
import "../Pages.css";
import {
  faSearch,
  faMultiply,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  awaitGoogleLogin,
  awaitGoogleLogout,
  awaitLoginStatus,
  getUserInfo,
} from "../../oauth/User";

export default function Profile() {
  const navigate = useNavigate();

  //Use state for input
  const [input, setInput] = useState("");

  //Use state for search toggle
  const [isToggled, setIsToggled] = useState(true);

  //Set label content to user info
  function setUserInfo(user) {
    const user_id = document.getElementById("user-id");
    const user_email = document.getElementById("user-email");
    const user_name = document.getElementById("user-name");
    if (user != null) {
      const basicProfile = user.getBasicProfile();
      const id = user.getId();
      const name = basicProfile.getName();
      const email = basicProfile.getEmail();

      user_id.textContent = "User ID | " + id;
      user_email.textContent = "User Email | " + email;
      user_name.textContent = "User Name | " + name;
    } else {
      user_id.textContent = "No user logged in.";
      user_email.textContent = "";
      user_name.textContent = "";
    }
  }

  //Check to see if user is logged in
  async function checkLogin() {
    const s = await awaitLoginStatus();
    if (s) {
      const u = getUserInfo();
      setUserInfo(u);
    } else {
      setUserInfo(null);
    }
  }

  //Google login
  async function login() {
    const u = await awaitGoogleLogin();
    setUserInfo(u);
  }

  //Logout from signed in user
  async function logout() {
    await awaitGoogleLogout();
    setUserInfo(null);
  }

  useEffect(() => {
    //Check login, set user info
    checkLogin();
  }, []);

  function search() {
    if (input != "" && input.length <= 40) {
      if (isToggled) {
        navigate(`/decksearch?q=${input}`);
        setInput("");
      } else {
        navigate(`/cardsearch?q=${input}`);
        setInput("");
      }
    }
  }

  //Clear search
  function clearSearch() {
    setInput("");
  }

  //Set toggle and search setting
  function toggleSearch() {
    setIsToggled(!isToggled);

    const searchBar = document.getElementById("search-bar-pf");
    if (!isToggled) {
      searchBar.placeholder = "Search deck list...";
    } else {
      searchBar.placeholder = "Search card...";
    }
  }

  // Create all components
  return (
    <div id="pf">
      <div id="header-pf">
        <Link to="/" style={{ textDecoration: "none" }}>
          <text id="heading-pf" className="heading">
            DeckTechCentral
          </text>
        </Link>
        <div id="search-panel-pf" className="search-panel">
          <button id="go-pf" onClick={search}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <input
            id="search-bar-pf"
            placeholder="Search deck list..."
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                search();
              }
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></input>
          <input type="checkbox" id="checkbox-pf" className="checkbox"></input>
          <label
            id="checkbox-toggle-pf"
            htmlFor="checkbox-pf"
            className="checkbox-toggle"
            checked={isToggled}
            onClick={toggleSearch}
          ></label>
          <button
            id="clear-pf"
            className="button-clear"
            onClick={clearSearch}
          >
            <FontAwesomeIcon icon={faMultiply} />
          </button>
          <button
            id="profile-pf"
            className="button-profile"
            onClick={() => navigate("/profile")}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
      </div>
      <div className="oauth">
        <button
          id="login-button"
          onClick={login}
        >
          Login
        </button>
        <button
          id="logout-button"
          onClick={logout}
        >
          Logout
        </button>
        <div id="user-info">
          <text id="user-id">User ID:</text>
          <text id="user-email">User Email:</text>
          <text id="user-name">User Name:</text>
        </div>
      </div>
    </div>
  );
}
