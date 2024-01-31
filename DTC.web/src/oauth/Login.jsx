import { GoogleLogin } from "react-google-login";

const clientId =
  "449883430868-j3aom1pndrf721cv5f1tblpce43lthqi.apps.googleusercontent.com";

function LoginButton() {
  const handleSuccess = () => {
    console.log("LOGIN SUCCESS!");
  };

  const handleFailure = () => {
    console.log("LOGIN FAILED!");
  };

  return (
    <div id="signInButtton">
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
      />
    </div>
  );
}

export default LoginButton;
