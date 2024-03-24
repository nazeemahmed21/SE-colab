import "./labStyles/fms.css";
//import "font-awesome/css/font-awesome.min.css"; // Import Font Awesome if you plan to use its icons
import './labStyles/ffolders.min.css'; // Import the FFolders.css library
import "./labStyles/css-file-icons.css";
import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage, db } from "../../firebase";
import { v4 } from "uuid";
import { collection, getDocs, addDoc } from "firebase/firestore";

function FileSystem(labId) {
  const [fileUpload, setFileUpload] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [fileUrls, setFileUrls] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);

  

  const filesCollection = collection(db, `labs/${labId}/files`);

  const fetchFiles = async () => {
    try {
      let items = [];

      if (currentFolder) {
        const folderPath = `labs/${labId}/folders/${currentFolder.name}`;
        const folderRef = ref(storage, folderPath);

        const folderResponse = await listAll(folderRef);
        const folderItems = await Promise.all(folderResponse.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { url, name: item.name, folder: currentFolder.name, isFolder: false };
        }));

        items = folderItems;
      } else {
        const filesSnapshot = await getDocs(filesCollection);
        const files = filesSnapshot.docs.map((doc) => doc.data());

        const foldersSnapshot = await getDocs(collection(db, `labs/${labId}/folders`));
        const folders = foldersSnapshot.docs.map((doc) => doc.data());

        items = [...files, ...folders];
      }

      setFileUrls(items);
      setFolders(items.filter(item => item.isFolder));
    } catch (error) {
      setError("Error fetching files. Please try again.");
      console.error("Error fetching files:", error);
    }
  };

  const createFolder = async () => {
    if (folderName.trim() === "") return;

    try {
      const newFolderDoc = await addDoc(collection(db, `labs/${labId}/folders`), {
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

    setLoading(true);

    try {
      const newFileDoc = await addDoc(filesCollection, {
        name: fileUpload.name,
        folder: currentFolder.name,
        isFolder: false,
      });

      const url = await uploadFileToStorage(
        fileUpload,
        currentFolder.name,
        fileUpload.name + v4()
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
    }
  };

  const uploadFileToStorage = async (file, folderName, fileName) => {
    const fileRef = ref(storage, `labs/${labId}/folders/${folderName}/${fileName}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
  };

  useEffect(() => {
    fetchFiles();
  }, [labId]);

  const navigateBack = async () => {
    try {
      if (currentFolder) {
        // If inside a folder, fetch all folders at the root level
        const foldersSnapshot = await getDocs(collection(db,`labs/${labId}/folders`));
        const folders = foldersSnapshot.docs.map((doc) => doc.data());

        setFolders(folders.filter(item => item.isFolder));
        setFileUrls([]); // Clear the file URLs

        setCurrentFolder(null);
      }
    } catch (error) {
      setError("Error navigating back. Please try again.");
      console.error("Error navigating back:", error);
    }
  };

  const navigateIntoFolder = async (folder) => {
    try {
      const folderPath = `labs/${labId}/folders/${folder.name}`;
      const folderRef = ref(storage, folderPath);

      const filesResponse = await listAll(folderRef);
      const files = await Promise.all(filesResponse.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return { url, name: item.name, folder: folder.name, isFolder: false };
      }));

      setFileUrls(files);
      setCurrentFolder(folder);
    } catch (error) {
      setError("Error fetching folder contents. Please try again.");
      console.error("Error fetching folder contents:", error);
    }
  };

  const openFile = (url) => {
    window.open(url, "_blank");
  };

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
      {error && <p style={{ color: "red" }}>{error}</p>}
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
                {fileUrls.map(({ url, name, isFolder }, index) => (
                  !isFolder && 
                  <div key={index} className="file-tile" onClick={() => openFile(url)}>
                    {/* Use css-file-icons class here with appropriate icon class */}
                    <div className="fi fi-file"></div> {/* File icon */}
                    <span>{name}</span>
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
                    <div className="ffolder small cyan"></div> {/* Use the same folder icon class */}
                    <span>{folder.name}</span>
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