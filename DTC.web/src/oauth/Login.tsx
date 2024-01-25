import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

const clientId = "449883430868-j3aom1pndrf721cv5f1tblpce43lthqi.apps.googleusercontent.com";

function LoginButton() {

  const handleSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    console.log("LOGIN SUCCESS! Current user: ", getProfile(res));
  }

  const handleFailure = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    console.log("LOGIN FAILED! res: ", res);
  }

  const getProfile = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    // Check if 'profileObj' exists (type guard)
    if ('profileObj' in res) {
      return res.profileObj;
    } else {
      return null; // Handle the case where 'profileObj' doesn't exist
    }
  };

  return (
    <div id="signInButtton">
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </div>
  );
}

export default LoginButton;