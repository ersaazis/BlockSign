import React, {useState, useEffect} from "react";
import { useAuth } from "./use-auth-client";
import MultiSelect from "./component/Multiselect";

const whoamiStyles = {
  border: "1px solid #1a1a1a",
  marginBottom: "1rem",
};

function LoggedIn() {
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");

  const [result, setResult] = useState("");
  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { whoamiActor, logout } = useAuth();

  const handleWhoamiClick = async () => {
    try {
      const whoami = await whoamiActor.whoami();
      setResult(whoami);
    } catch (error) {
      console.error("Failed to fetch whoami:", error);
    }
  };

  const handleProfileSave = async () => {
    const whoami = await whoamiActor.whoami();
    await whoamiActor.addPerson(whoami)
    await whoamiActor.changePerson(whoami,name,role)
  };

  const handleDocumentSave = () => {
    // Implement logic to save the document
    console.log("Document saved");
  };

  useEffect(async ()=> {
    const whoami = await whoamiActor.getPerson();
    console.log(whoami)
    console.log("test")
  }, [])
  return (
    <div className="container">
      <h1>BlockSign Digital Signature</h1>
      <hr />
      <label>
        <b>Name</b>
      </label>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>
        <b>Role</b>
      </label>
      <input
        type="text"
        placeholder="Enter your role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <button onClick={handleProfileSave}>Save Profile</button>
      <hr />
      <h3>Upload Document</h3>
      <div>
        <input type="file" style={{ width: "90%" }} />
        <br />
        <label>
          <b>Signed By</b>
        </label>
        <MultiSelect
          options={options}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
        <br />
        <br />
        <button onClick={handleDocumentSave}>Save Document</button>
      </div>
      <hr />
      <h3>My Documents</h3>
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
      <h3>Requested Signatures</h3>
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
      <button id="logout" onClick={logout}>
        Log out
      </button>
    </div>
  );
}

export default LoggedIn;
