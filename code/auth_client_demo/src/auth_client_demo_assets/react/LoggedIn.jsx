import React from "react";
import { useAuth } from "./use-auth-client";

const whoamiStyles = {
  border: "1px solid #1a1a1a",
  marginBottom: "1rem",
};

function LoggedIn() {
  const [result, setResult] = React.useState("");

  const { whoamiActor, logout } = useAuth();

  const handleClick = async () => {
    const whoami = await whoamiActor.whoami();
    setResult(whoami);
  };

  return (
    <div className="container">
      <h1>BlockSign Digital Signature</h1>
      <hr />
      <h3>Upload Document</h3>
      <div>
        <input type="file" style={{ width: "90%" }} />
        <br />
        <label>
          <b>Signed By</b>
        </label>
        <select name="cars" id="cars" style={{ width: "100%" }} multiple>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="opel">Opel</option>
          <option value="audi">Audi</option>
        </select>
        <br />
        <br />
        <button onClick={handleClick}>Save</button>
      </div>
      <hr />
      <h3>My Document</h3>
      <table border="1">
        <tbody>
          <tr>
            <td>File 1</td>
            <td>lock</td>
          </tr>
          <tr>
            <td>File 2</td>
            <td>lock</td>
          </tr>
          <tr>
            <td>File 3</td>
            <td>lock</td>
          </tr>
          <tr>
            <td>File 4</td>
            <td>lock</td>
          </tr>
          <tr>
            <td>File 5</td>
            <td>lock</td>
          </tr>
        </tbody>
      </table>
      <br />
      <h3>Requested Signature</h3>
      <table border="1">
        <tbody>
          <tr>
            <td>File 1</td>
            <td>sign</td>
          </tr>
          <tr>
            <td>File 2</td>
            <td>sign</td>
          </tr>
          <tr>
            <td>File 3</td>
            <td>signed</td>
          </tr>
        </tbody>
      </table>
      <br />
      <hr />
      <button id="logout" onClick={logout}>Log out</button>
    </div>
  );
}

export default LoggedIn;
