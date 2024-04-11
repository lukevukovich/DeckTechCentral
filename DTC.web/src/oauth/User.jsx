// Function to await Sign-In
export function awaitLogin() {}

// Function to await Sign-Out
export function awaitLogout() {}

//Await sign it status as
export function getLoginStatus() {
  return true;
}

//Set info for user popup
export function setUserPopup(id) {
  const popup = document.getElementById(`user-popup-${id}`);
  const user = getLoginStatus();
  if (user) {
    popup.textContent = "User | " + "test";
  } else {
    popup.textContent = "Guest | Login required";
  }
}
