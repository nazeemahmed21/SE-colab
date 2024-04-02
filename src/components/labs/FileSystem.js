import "./labStyles/fms.css";
//import "font-awesome/css/font-awesome.min.css"; // Import Font Awesome if you plan to use its icons
import './labStyles/ffolders.min.css'; // Import the FFolders.css library
import "./labStyles/css-file-icons.css"; // Import the css-file-icons.css file
import { useState, useEffect, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { storage, db, auth } from "../../firebase";
import { v4 } from "uuid";
import { collection, getDocs, addDoc, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom'; 

function FileSystem() {
  const [fileUpload, setFileUpload] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [fileUrls, setFileUrls] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [userId, setUserId] =  useState('');
  const [labId, setLabId] = useState('');
  const { labId: urlLabId } = useParams();
  const [isLabOwner, setIsLabOwner] = useState(false);
  


  useEffect(() => {
    const currentUser = auth.currentUser;
    setLabId(urlLabId);
    console.log("labId:", labId);
    if (currentUser) {
      setUserId(currentUser.uid);
      
    } else {
      // Handle the case when user is not authenticated (redirect to login?)
    }
  }, [labId, urlLabId]);

  useEffect(() => {
    const fetchLabOwnership = async () => {
      if (labId && userId) {
        const isOwner = await isLabOwnerFunc(labId, userId); // Assuming you have the isLabOwner function implemented
        setIsLabOwner(isOwner);
      }
    }

    fetchLabOwnership(); 
  }, [labId, userId]); 

  async function isLabOwnerFunc(labId, userId) {
    // 1. Fetch lab data from Firestore
    const labRef = doc(db, "labs", labId);
    const labDoc = await getDoc(labRef);

    // 2. Check if the lab exists
    if (!labDoc.exists()) {
        return false; // Lab doesn't exist
    }

    // 3. Check ownership
    return labDoc.data().ownerID === userId; 
}

  const fetchLabFiles = useCallback(async () => {
    try {
      setLoading(true); 
      setError(null); 

      if (!labId) {
        console.error("Lab ID is missing");
        return;
      }

      const labRef = doc(db, "labs", labId);

      // Get files
      const filesQuerySnapshot = await getDocs(collection(labRef, "files"));
      const files = filesQuerySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, nameFile: doc.data().name  }));

      // Get folders
      const foldersQuerySnapshot = await getDocs(collection(labRef, "folders"));
      const folders = foldersQuerySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id}));

      setFileUrls(files);
      setFolders(folders);
    } catch (error) {
      setError("Error fetching files. Please try again.");
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false); 
    }
  }, [labId]);

  const createFolder = async () => {
    if (folderName.trim() === "") return;

    try {
      const labRef = doc(db, "labs", labId);
      const newFolderDoc = await addDoc(collection(labRef, "folders"), {
        name: folderName,
        path: `${folderName + v4()}`,
        isFolder: true,
      });

      setFolders((prev) => [
        ...prev,
        { name: folderName, path: newFolderDoc.id, isFolder: true },
      ]);
      setFolderName("");
    } catch (error) {
      setError("Error creating folder. Please try again.");
      console.error("Error creating folder:", error);
    }
  };

  const uploadFile = async () => {
    if (fileUpload == null || !currentFolder) return;

    try {
      setLoading(true);

      const labRef = doc(db, "labs", labId); 
      const newFileDoc = await addDoc(collection(labRef, "files"), {
        name: fileUpload.name,
        folder: currentFolder.name,
        isFolder: false,
        uploadedBy: userId,
      });

      const url = await uploadFileToStorage(
        fileUpload,
        currentFolder.name,
        fileUpload.name + '_'+ newFileDoc.id
      );


      setFileUrls((prev) => [
        ...prev,
        { url, name: fileUpload.name, folder: currentFolder.name, isFolder: false },
      ]);
    } catch (error) {
      setError("Error uploading file. Please try again.");
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
      navigateIntoFolder(currentFolder);
    }
  };

  const uploadFileToStorage = async (file, folderName, fileName) => {
    const fileRef = ref(storage, `folders/${folderName}/${fileName}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
  };


  const navigateBack = async () => {
    try {
      if (currentFolder) {
        setCurrentFolder(null);
        fetchLabFiles(); // Fetch files at root of the lab
      }
    } catch (error) {
      setError("Error navigating back. Please try again.");
      console.error("Error navigating back:", error);
    }
  };

  const navigateIntoFolder = async (folder) => {
    try {
      const labRef = doc(db, "labs", labId);
      const folderRef = ref(storage, `folders/${folder.name}`);

      const filesResponse = await listAll(folderRef);
      const files = await Promise.all(filesResponse.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return { url, name: item.name, folder: folder.name, isFolder: false };
      }));

      setFileUrls(files);
      setCurrentFolder(folder);
    } catch (error) {
      //setError("Error fetching folder contents. Please try again.");
      console.error("Error fetching folder contents:", error);
    }
  };

  const openFile = (url) => {
    window.open(url, "_blank");
  };

  const deleteFile = async (file) => {
    try {
      const docOfFile = file.name.split('_')[1];
      console.log('docId:', docOfFile);
      // Confirmation Alert
      if (!window.confirm(`Are you sure you want to delete the file ${file.name}?`)) {
        return; 
      }
  
      // 1. Delete the file from Firebase Storage
      const fileRef = ref(storage, `folders/${file.folder}/${file.name}`);
      await deleteObject(fileRef);
  
      // 2. Delete file's record from the Firestore database
      const labRef = doc(db, "labs", labId);
      const fileDocRef = doc(db, "labs", labId, "files", docOfFile);
      await deleteDoc(fileDocRef);
  
      // 3. Remove the file from the fileUrls state
      setFileUrls((prevFiles) => prevFiles.filter((f) => f !== file.id));
      alert("File deleted successfully!");
    } catch (error) {
      setError("Error deleting file. Please try again.");
      console.error("Error deleting file:", error);
    }
  };
  
  const deleteFolder = async (folder) => {
    try {
      // Authorization Check - Implement your logic here
      if (!isLabOwner) {
        throw new Error("You are not authorized to delete this folder.");
      }
  
      // Confirmation Alert
      if (!window.confirm(`Are you sure you want to delete the folder ${folder.name} and all its contents?`)) {
        return; 
      }
  
      // 1. Recursively delete files within the folder 
      const folderRef = ref(storage, `folders/${folder.name}`);
      const filesResponse = await listAll(folderRef);
  
      await Promise.all(filesResponse.items.map((item) => {
        // Extract docId within loop (assuming file names use the same convention)
        const fileDocId = item.name.split('_')[1]; 
  
        return deleteFile({ 
          name: item.name,
          folder: folder.name,
          docId: fileDocId, 
        });
      })); 
  
      // 2. Delete the folder's record from Firestore
      const labRef = doc(db, "labs", labId);
      const folderDocRef = doc(collection(labRef, "folders"), folder.id); 
      await deleteDoc(folderDocRef);
  
      // 3. Remove the folder from the folders state
      setFolders(prevFolders => prevFolders.filter(f => f.id !== folder.id)); // Update for ID-based filtering
  
    } catch (error) {
      setError("Error deleting folder. Please try again.");
      console.error("Error deleting folder:", error);
    }
  };

  
  useEffect(() => {
    fetchLabFiles();
    navigateIntoFolder(currentFolder);
  },[fetchLabFiles]);


  return (
    <div className="App">
      <div>
        <input
          type="text"
          placeholder="Folder Name"
          value={folderName}
          onChange={(event) => setFolderName(event.target.value)}
        />
        <button onClick={createFolder}> Create Folder</button>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && error && <p style={{ color: "red" }}>{error}</p>}
      {currentFolder ? (
        <>
          <h2>{currentFolder.name} Folder:</h2>
          <button onClick={navigateBack}>Back</button>
          <div>
            <input
              type="file"
              onChange={(event) => {
                setFileUpload(event.target.files[0]);
              }}
            />
            <button onClick={uploadFile} disabled={loading}>Upload File</button>
          </div>
          {fileUrls.length > 0 && (
            <div className="file-container">
              <h2>Files:</h2>
              <div className="file-tiles">
                {fileUrls.map(({ url, name, isFolder, folder, user }, index) => (
                  !isFolder && // Only display files, not folders
                  <div key={index} className="file-tile"> {/* No onClick here */}
                  <div className="file-name" onClick={() => openFile(url)}> 
                    <span>{name.split('.')[0] +'.'+ name.split('.')[1].split('_')[0]}</span>
                  </div>
                  {isLabOwner && (
                    <button className="labFilesDelete" onClick={(event) => deleteFile({ url, name, isFolder, folder, user })}>Delete</button> 
                  )} 
                </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {folders.length > 0 && (
            <div className="folder-container">
              <h2>Folders:</h2>
              <div className="folder-tiles">
                {folders.map((folder, index) => (
                  <div key={index} className="folder-tile" onClick={() => navigateIntoFolder(folder)}>
                    <div className = "folder-info">
                    <div className="ffolder small cyan"></div>
                    <span>{folder.name}</span>
                    </div>
                    {isLabOwner && ( 
                      <button className="labFoldersDelete" onClick={() => deleteFolder(folder)}>
                        X
                      </button>
                    )}
                   
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FileSystem;