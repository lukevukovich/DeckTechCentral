//Determine if user is signed in
export function isUserSignedIn() {
  return gapi.auth2.getAuthInstance().isSignedIn.get();
}

//Return user profile
export function getUserProfile() {
  if (isSignedIn()) {
    return gapi.auth2.currentUser.get().getBasicProfile();
  } else {
    return null;
  }
}
