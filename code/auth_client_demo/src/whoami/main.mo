import Cycles "mo:base/ExperimentalCycles";
import List "mo:base/List";
import Blob "mo:base/Blob";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Error "mo:base/Error";
import Hex "./Hex";
import SHA256 "./SHA256";

actor {
  // ENC
  type IC = actor {
    ecdsa_public_key : ({
      canister_id : ?Principal;
      derivation_path : [Blob];
      key_id : { curve : { #secp256k1 }; name : Text };
    }) -> async ({ public_key : Blob; chain_code : Blob });
    sign_with_ecdsa : ({
      message_hash : Blob;
      derivation_path : [Blob];
      key_id : { curve : { #secp256k1 }; name : Text };
    }) -> async ({ signature : Blob });
  };
  let ic : IC = actor ("aaaaa-aa");

  // HELPLER
  func listContains<T>(lst : List.List<T>, elem : T, eq : (T, T) -> Bool) : Bool {
    List.some(
      lst,
      func(x : T) : Bool {
        eq(x, elem);
      },
    );
  };

  // DATABASE
  type PersonHistoryProfile = {
    id : Principal;
    detail : Text;
    date_change : Int;
  };
  type ListPerson = {
    id : Principal;
    name : Text;
    role : Text;
  };
  type ListDocument = {
    id : Text;
    owner : Principal;
    document : Blob;
    hashing : Text;
    status : Bool;
  };
  type ListSign = {
    document_id : Text;
    user_id : Principal;
    date_sign : Int;
  };

  var items : List.List<ListPerson> = List.nil();
  var history : List.List<PersonHistoryProfile> = List.nil();
  var documents : List.List<ListDocument> = List.nil();
  var signs : List.List<ListSign> = List.nil();

  // AUTH
  public shared query (msg) func whoami() : async Principal {
    let callerId = msg.caller;

    // Check if the caller already exists in the list
    let personExists = List.some(
      items,
      func(person : ListPerson) : Bool {
        person.id == callerId;
      },
    );

    if (personExists) {
      // If the caller already exists, do nothing and return the callerId
      return callerId;
    } else {
      // If the caller does not exist, add them to the list
      let newItem : ListPerson = { id = callerId; name = ""; role = "" };
      items := List.push(newItem, items);
      return callerId;
    };
  };

  // PERSON
  public func addPerson(id : Principal) : async () {
    let newItem : ListPerson = { id = id; name = ""; role = "" };
    items := List.push(newItem, items);
  };

  public func getPerson() : async List.List<ListPerson> {
    return items;
  };

  public func changePerson(id : Principal, newName : Text, newRole : Text) : async Bool {
    let (updatedItems, found) = List.foldLeft<ListPerson, (List.List<ListPerson>, Bool)>(
      items,
      (List.nil(), false),
      func(current : (List.List<ListPerson>, Bool), item : ListPerson) : (List.List<ListPerson>, Bool) {
        let (updatedList, wasFound) = current;
        if (item.id == id) {
          var historyDetail = "";
          var updatedName = item.name;
          var updatedRole = item.role;

          if (newName != item.name) {
            historyDetail := "Change name from " # item.name # " to " # newName;
            updatedName := newName;
            let now = Time.now();
            let historyEntry : PersonHistoryProfile = {
              id = id;
              detail = historyDetail;
              date_change = now;
            };
            history := List.push(historyEntry, history);
          };

          if (newRole != item.role) {
            historyDetail := "Change role from " # item.role # " to " # newRole;
            updatedRole := newRole;
            let now = Time.now();
            let historyEntry : PersonHistoryProfile = {
              id = id;
              detail = historyDetail;
              date_change = now;
            };
            history := List.push(historyEntry, history);
          };

          let updatedItem : ListPerson = {
            id = id;
            name = updatedName;
            role = updatedRole;
          };
          (List.push(updatedItem, updatedList), true);
        } else { (List.push(item, updatedList), wasFound) };
      },
    );
    items := List.reverse(updatedItems);
    return found;
  };

  // Document
  public func documentPerson(user_id : Principal) : async List.List<ListDocument> {
    let userDocuments = List.filter<ListDocument>(
      documents,
      func(doc : ListDocument) : Bool {
        doc.owner == user_id;
      },
    );

    return userDocuments;
  };

  public func documentStatus(document_id : Text) : async List.List<ListSign> {
    let documentsSign = List.filter<ListSign>(
      signs,
      func(doc : ListSign) : Bool {
        doc.document_id == document_id;
      },
    );

    return documentsSign;
  };

  public func addDocument(id : Text, owner : Principal, document : Blob) : async () {
    let newDoc : ListDocument = {
      id = id;
      owner = owner;
      document = document;
      hashing = "";
      status = false;
    };
    documents := List.push(newDoc, documents);
  };

  // Document Signation

  public func documentSign(user_id : Principal) : async List.List<ListDocument> {
    let userSignDocuments = List.filter<ListSign>(
      signs,
      func(sign : ListSign) : Bool {
        sign.user_id == user_id;
      },
    );

    let documentIds = List.map<ListSign, Text>(
      userSignDocuments,
      func(sign : ListSign) : Text {
        sign.document_id;
      },
    );

    let signedDocuments = List.filter<ListDocument>(
      documents,
      func(doc : ListDocument) : Bool {
        listContains(documentIds, doc.id, Text.equal);
      },
    );

    return signedDocuments;
  };

  public func addPersonDocument(document_id : Text, user_id : Principal) : async () {
    let newSign : ListSign = {
      document_id = document_id;
      user_id = user_id;
      date_sign = 0;
    };
    signs := List.push(newSign, signs);
  };

  public func signDocument(document_id : Text, user_id : Text) : async Bool {
    let now = Time.now();
    let (updatedSigns, found) = List.foldLeft<ListSign, (List.List<ListSign>, Bool)>(
      signs,
      (List.nil(), false),
      func(current : (List.List<ListSign>, Bool), sign : ListSign) : (List.List<ListSign>, Bool) {
        let (updatedList, wasFound) = current;
        if (sign.document_id == document_id and sign.user_id == user_id) {
          let updatedSign : ListSign = { sign with date_sign = now };
          (List.push(updatedSign, updatedList), true);
        } else { (List.push(sign, updatedList), wasFound) };
      },
    );
    signs := List.reverse(updatedSigns);
    return found;
  };

  public shared (msg) func finishSign(user_id : Text, document_id : Text, newDocument : Blob) : async Bool {
    let caller = Principal.toBlob(msg.caller);
    let message_hash : Blob = Blob.fromArray(SHA256.sha256(Blob.toArray(newDocument)));
    Cycles.add(25_000_000_000);

    let { signature } = await ic.sign_with_ecdsa({
      message_hash;
      derivation_path = [caller];
      key_id = { curve = #secp256k1; name = "dfx_test_key" };
    });
    let signature_hex = Hex.encode(Blob.toArray(signature));

    let (updatedDocs, found) = List.foldLeft<ListDocument, (List.List<ListDocument>, Bool)>(
      documents,
      (List.nil(), false),
      func(current : (List.List<ListDocument>, Bool), doc : ListDocument) : (List.List<ListDocument>, Bool) {
        let (updatedList, wasFound) = current;
        if (doc.id == document_id and doc.owner == user_id) {
          let updatedDoc : ListDocument = {
            id = doc.id;
            owner = doc.owner;
            document = newDocument;
            hashing = signature_hex;
            status = true;
          };
          (List.push(updatedDoc, updatedList), true);
        } else { (List.push(doc, updatedList), wasFound) };
      },
    );
    documents := List.reverse(updatedDocs);
    return found;
  };

  // HISTORY
  public func getHistory(filterId : Text) : async List.List<PersonHistoryProfile> {
    let filteredHistory = List.filter<PersonHistoryProfile>(
      history,
      func(item : PersonHistoryProfile) : Bool {
        item.id == filterId;
      },
    );
    return filteredHistory;
  };

  public shared (msg) func public_key() : async {
    #Ok : { public_key_hex : Text };
    #Err : Text;
  } {
    let caller = Principal.toBlob(msg.caller);
    try {
      let { public_key } = await ic.ecdsa_public_key({
        canister_id = null;
        derivation_path = [caller];
        key_id = { curve = #secp256k1; name = "dfx_test_key" };
      });
      #Ok({ public_key_hex = Hex.encode(Blob.toArray(public_key)) });
    } catch (err) {
      #Err(Error.message(err));
    };
  };
};
