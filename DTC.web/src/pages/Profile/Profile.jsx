import { useState, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import {
  awaitGoogleLogin,
  awaitGoogleLogout,
  awaitLoginStatus,
  getUserInfo,
  setUserPopup,
} from "../../oauth/User";
import { maxSearchLength } from "../../assets/DTCHeader/DTCHeader";
import DTCHeader from "../../assets/DTCHeader/DTCHeader";

export default function Profile() {
  const navigate = useNavigate();

  //Use state for input
  const [input, setInput] = useState("");

  //Use state for search toggle
  const [isToggled, setIsToggled] = useState(false);

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
      setUserPopup(u, "pf");
    } else {
      setUserInfo(null);
      setUserPopup(null, "pf");
    }
  }

  //Google login
  async function login() {
    const u = await awaitGoogleLogin();
    setUserInfo(u);
    setUserPopup(u, "pf");
  }

  //Logout from signed in user
  async function logout() {
    await awaitGoogleLogout();
    setUserInfo(null);
    setUserPopup(null, "pf");
  }

  useEffect(() => {
    //Check login, set user info
    checkLogin();

    sessionStorage.removeItem("deck");
  }, []);

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
      <div className="oauth">
        <button id="login-button" onClick={login}>
          Login
        </button>
        <button id="logout-button" onClick={logout}>
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
