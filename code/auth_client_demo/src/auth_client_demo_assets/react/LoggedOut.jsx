import React from "react";
import { useAuth } from "./use-auth-client";

function LoggedOut() {
  const { login } = useAuth();

  return (
    <div className="container">
      <h1>BlockSign Digital Signature</h1>
      <p>Please Login First!</p>
      <button type="button" id="loginButton" onClick={login}>
        Log in
      </button>
    </div>
  );
}

export default LoggedOut;
