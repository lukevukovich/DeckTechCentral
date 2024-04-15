import { useState, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { getLoginStatus, setUserPopup } from "../../auth/User";
import { maxSearchLength } from "../../assets/DTCHeader/DTCHeader";
import DTCHeader from "../../assets/DTCHeader/DTCHeader";

export default function Profile() {
  const navigate = useNavigate();

  //Use state for input
  const [input, setInput] = useState("");

  //Auth input fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  //Use state for search toggle
  const [isToggled, setIsToggled] = useState(false);

  //Check to see if user is logged in
  async function checkLogin() {
    const s = getLoginStatus();
    if (s) {
      setUserPopup("pf");
    } else {
      setUserPopup("pf");
    }
  }

  //login
  function login() {
    setUserPopup("pf");
  }

  //Logout from signed in user
  function logout() {
    setUserPopup("pf");
  }

  useEffect(() => {
    //Check login, set user info
    checkLogin();

    sessionStorage.clear();
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
      <div className="auth">
        <div className="auth-bkg">
          <div className="auth-input">
            <input
              className="username"
              value={username}
              placeholder="Username"
            ></input>
            <input className="email" value={email} placeholder="Email"></input>
            <input
              className="password"
              value={password}
              placeholder="Password"
            ></input>
          </div>
          <div className="auth-buttons">
            <button className="login">Login</button>
            <button className="signup">Sign-Up</button>
          </div>
          <div className="auth-button">
            <button className="logout">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
