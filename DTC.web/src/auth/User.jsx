export function createTokenAndStoreInCookie(userInfo) {
  // Current date and time
  const now = new Date();
  // Expiration date set to 7 days from now
  const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Token object
  const tokenData = {
    token: userInfo.token,
    id: userInfo.id,
    username: userInfo.username,
    email: userInfo.email,
    exp: expires.toISOString(), // ISO string format for the expiration date
  };

  // Convert token object to JSON string
  const tokenJsonString = JSON.stringify(tokenData);

  // Encode JSON string to Base64 to simulate a JWT-like structure
  const encodedToken = btoa(tokenJsonString);

  // Store encoded token in a cookie with a 7 day expiration and HttpOnly flag
  document.cookie = `userToken=${encodedToken};expires=${expires.toUTCString()};path=/`;
}

//Determine if user is logged in or not based on token existence
export function getLoginStatus() {
  const name = "userToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return true; // Return true if the token exists
    }
  }
  return false; // Return false if the token does not exist
}

//Get the user info from the token
export function getUserInfoFromToken() {
  const name = "userToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      const cookieValue = c.substring(name.length, c.length);
      try {
        // Decode Base64 string to JSON
        const decodedValue = atob(cookieValue);
        // Parse JSON string to object
        const userInfo = JSON.parse(decodedValue);
        // Return only the required user info
        return {
          token: userInfo.token,
          id: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
        };
      } catch (e) {
        console.error("Failed to parse user info:", e);
        return null;
      }
    }
  }
  return null; // Return null if the token does not exist or is invalid
}

//Set info for user popup
export function setUserPopup(id) {
  const popup = document.getElementById(`user-popup-${id}`);
  const status = getLoginStatus();
  if (status) {
    const user = getUserInfoFromToken();
    popup.textContent = "User | " + user.username;
  } else {
    popup.textContent = "Guest | Login required";
  }
}
