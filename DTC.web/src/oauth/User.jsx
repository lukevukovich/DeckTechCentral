import { gapi } from "gapi-script";

//O-Auth client ID
export const clientId =
  "449883430868-j3aom1pndrf721cv5f1tblpce43lthqi.apps.googleusercontent.com";

// Function to await Google Sign-In
export function awaitGoogleLogin() {
  return new Promise((resolve) => {
    gapi.load("auth2", function () {
      gapi.auth2
        .init({
          client_id: clientId,
        })
        .then(function (auth2) {
          auth2.signIn().then(function (googleUser) {
            resolve(googleUser);
          });
        });
    });
  });
}

// Function to await Google Sign-Out
export function awaitGoogleLogout() {
  return new Promise((resolve) => {
    gapi.load("auth2", function () {
      gapi.auth2
        .init({
          client_id: clientId,
        })
        .then(function (auth2) {
          auth2.signOut().then(function (googleUser) {
            resolve(googleUser);
          });
        });
    });
  });
}

//Await sign it status as
export function awaitLoginStatus() {
  return new Promise((resolve) => {
    gapi.load("auth2", function () {
      gapi.auth2
        .init({
          client_id: clientId,
        })
        .then(function (auth2) {
          const signedIn = auth2.isSignedIn.get();
          resolve(signedIn);
        });
    });
  });
}

//Get Google user information
//Must pre-check that user is signed in
export function getUserInfo() {
  const auth2 = gapi.auth2.getAuthInstance();
  const user = auth2.currentUser.get();

  return user;
}

//Set info for user popup
export function setUserPopup(user, id) {
  const popup = document.getElementById(`user-popup-${id}`);
  if (user != null) {
    const basicProfile = user.getBasicProfile();
    const email = basicProfile.getEmail();
    popup.textContent = "User | " + email;
  } else {
    popup.textContent = "Guest | Login required";
  }
}
