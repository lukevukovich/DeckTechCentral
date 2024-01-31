import { GoogleLogout } from "react-google-login";

const clientId =
  "449883430868-j3aom1pndrf721cv5f1tblpce43lthqi.apps.googleusercontent.com";

function LogoutButton() {
  const handleLogoutSuccess = () => {
    console.log("LOGOUT SUCCESS!");
  };

  return (
    <div id="signInButtton">
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={handleLogoutSuccess}
      />
    </div>
  );
}

export default LogoutButton;
