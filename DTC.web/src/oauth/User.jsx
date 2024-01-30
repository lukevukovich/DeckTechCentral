//Determine if user is signed in
function isSignedIn() {
  return gapi.auth2.getAuthInstance().isSignedIn.get();
}

//Return user profile
function getUserProfile() {
  if (isSignedIn()) {
    return gapi.auth2.currentUser.get().getBasicProfile();
  } else {
    return null;
  }
}
