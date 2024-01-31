import { gapi } from "gapi-script";

//Returns if user is signed in or not
export function isSignedIn() {
  let signedIn = false;

  try {
    let auth2 = gapi.auth2.getAuthInstance();

    if (auth2 != null) {
      signedIn = auth2.isSignedIn.get();
    }
  } catch (error) {}

  return signedIn;
}
