import { gapi } from "gapi-script";

const clientId =
  "449883430868-j3aom1pndrf721cv5f1tblpce43lthqi.apps.googleusercontent.com";

// Load the Google API client library
gapi.load('auth2', function () {
  gapi.auth2.init({
    client_id: clientId,
  });
});

// Function to handle Google Sign-In
export function googleLogin() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signIn().then(function (googleUser) {
    // Handle the signed-in user (send to server, etc.)
    console.log('Google User:', googleUser);
  });
}

// Function to handle Google Sign-Out
export function googleLogout() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

// Returns whether there is a user signed in or not
export function isSignedIn() {
  var auth2 = gapi.auth2.getAuthInstance();
  const signedIn = auth2.isSignedIn.get();

  return signedIn;
}