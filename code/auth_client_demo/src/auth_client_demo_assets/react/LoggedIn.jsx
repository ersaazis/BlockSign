import React, { useState, useEffect } from "react";
import { useAuth } from "./use-auth-client";
import MultiSelect from "./component/Multiselect";

const whoamiStyles = {
  border: "1px solid #1a1a1a",
  marginBottom: "1rem",
};

function LoggedIn() {
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [docs, setDocs] = useState("")

  const [person_documents, setPersonDocuments] = useState([]);
  const [sign_documents, setSignDocuments] = useState([]);

  const [result, setResult] = useState("");
  const [options, setOptions] = useState([])
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

  const handleLockDocument = async (document_id, document) => {
    const whoami = await whoamiActor.whoami();
    await whoamiActor.finishSign(whoami, document_id, document)
    getListDocuments()
  };

  const handleProfileSave = async () => {
    const whoami = await whoamiActor.whoami();
    await whoamiActor.addPerson(whoami)
    await whoamiActor.changePerson(whoami, name, role)

    let listPersonObj = await whoamiActor.getPerson();
    console.log(listPersonObj)
    // const names = []
    // listPersonObj.forEach(person => { person.forEach(user => { names.push(user.name) }) });
    setOptions(listPersonObj)
  };

  const handleSignDocument = async (docid, index) => {
    const whoami = await whoamiActor.whoami();
    console.log(docid, whoami);
    await whoamiActor.signDocument(docid, whoami)

    getListDocuments()
  };

  const handleDocumentSave = async () => {
    // Implement logic to save the document
    const whoami = await whoamiActor.whoami()
    const reader = new FileReader();

    reader.onload = async function (e) {
      const fileContent = e.target.result;
      console.log('File content:', fileContent);
      // You can further process the file content here
      const uint8Array = new Uint8Array(fileContent);
      await whoamiActor.addDocument(docs.name, whoami, uint8Array)

      const selected = [...options]
      selected.filter(el => selectedOptions.includes(el.name))
      selected.forEach(async (el) => {
        await whoamiActor.addPersonDocument(docs.name, el.id)
      })
      getListDocuments()
    };

    reader.readAsArrayBuffer(docs);
    // await addDocument()
    console.log("Document saved");
  };

  const getListDocuments = async () => {
    const whoami = await whoamiActor.whoami();
    let listDocumentsObj = await whoamiActor.documentPerson(whoami);
    let listSignObj = await whoamiActor.documentSign(whoami);
    console.log(listSignObj);
    setPersonDocuments(listDocumentsObj)
    setSignDocuments(listSignObj)
  };

  const getFile = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      setDocs(file)
    }
  }

  const handleDownloads = (el) => {
    console.log(el)
    const blob = new Blob([el.document], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${el.hashing == "" ? el.id : el.hashing}`; // Specify the file name
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
  }

  useEffect(async () => {
    getListDocuments()

    const whoami = await whoamiActor.whoami();
    console.log(whoami)
    await whoamiActor.addPerson(whoami)
    const myPerson = await whoamiActor.myPerson(whoami)
    setName(myPerson[0][0]['name'])
    setRole(myPerson[0][0]['role'])

    console.log("test")

    let listPersonObj = await whoamiActor.getPerson();
    // const names = []
    // listPersonObj.forEach(person => { names.push(person[0]['name'])});
    console.log(listPersonObj)
    setOptions(listPersonObj)
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
        <input type="file" style={{ width: "90%" }} accept=".pdf" onChange={getFile} />
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
      {person_documents.map((el, index) => (
        <div key={index} style={{width: "100%", wordBreak: 'break-all'}}>
          <hr />
          <p>Name :{el.id}</p>
          <p>Action :
            {el.status ? (
              "Locked"
            ) : (
              <button onClick={() => handleLockDocument(el.id, el.document)}>Lock</button>
            )} <button onClick={()=>handleDownloads(el)}>Download</button>
          </p>
          <b>Signature</b>
          <p>{el.hashing == "" ? "no signature" : el.hashing}</p>
          <hr />
        </div>
      ))}
      <br />
      <h3>Requested Signatures</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            sign_documents.map((el, index) => (
              <tr key={index}>
                <td>{el.id}</td>
                <td><button onClick={() => handleSignDocument(el.id, index)}>Sign</button></td>
              </tr>
            ))
          }
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
