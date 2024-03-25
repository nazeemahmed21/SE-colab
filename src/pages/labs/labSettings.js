import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 
import { db } from '../../firebase'; // Your Firebase configuration
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import '../../styles/labsnew.css';
import { DeleteLab } from '../../components/labs/labUtils';
import { useNavigate } from 'react-router-dom';
import defaultIcon from '../../images/lab-default-icon.jpg';
import { useOutletContext } from 'react-router-dom';

const LabSettings = () => {
  const { labId } = useParams();
  const [labData, setLabData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newLabName, setNewLabName] = useState('');
  const [newLabIcon, setNewLabIcon] = useState(null);
  const [labIconPreview, setLabIconPreview] = useState(null);
  const [defaultIconUrl, setDefaultIconUrl] = useState(null);
  const fileInputRef = React.useRef(null);
  const [newJoinId, setNewJoinId] = useState(labData ? labData.joinId : '');
  const isDisabled = useState(true);
  const [currentPageName,setCurrentPageName] = useOutletContext();
  
  
  useEffect(() => {
      setCurrentPageName('Settings'); 
  }, [setCurrentPageName]);

  // Fetch lab data on component mount
  useEffect(() => {
    const fetchLabData = async () => { 
      setIsLoading(true); 
      try {
        const docRef = doc(db, 'labs', labId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setLabData({...data, joinId: docSnap.get('joinId')}); 
          setNewLabName(data.labName); // Set initial newName to current name
          setNewJoinId(data.joinId);
          // Fetch lab icon if available
          if (data.labIcon) {
            try {
              setLabIconPreview(data.labIcon); 
            } catch (error) {
              console.error('Error fetching lab icon:', error);
            }
          }
        } else {
          setError('Lab not found'); 
        }
      } catch (error) {
        setError('Error fetching lab data:', error); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabData(); 
  }, [labId]); 

  const navigate = useNavigate();

  const handleDelete = (labId) => {
    DeleteLab(labId, navigate); // Pass navigate to DeleteLab
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);

    try {
      const docRef = doc(db, 'labs', labId);

      // Update lab name if changed
      if (newLabName !== labData.labName) { 
        await updateDoc(docRef, { labName: newLabName });
      }

      if (newJoinId !== labData.joinId) { 
          await updateDoc(docRef, { joinId: newJoinId });
        }

      // Upload and update lab icon if changed
      if (newLabIcon) {
        const storage = getStorage();
        const imageRef = ref(storage, `labIcons/${labId}.jpg`);
        await uploadBytes(imageRef, newLabIcon); 
        const iconUrl = await getDownloadURL(imageRef);
        await updateDoc(docRef, { labIcon: iconUrl }); 
        setLabIconPreview(iconUrl)
      }

      // Update local state for immediate UI update
      setLabData(prevData => ({ ...prevData, labName: newLabName, labIcon: labIconPreview})); 

      console.log('Lab settings updated successfully');
      // Add success message or other feedback here
    } catch (error) {
      console.error('Error updating lab settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="labSettings">
        {isLoading && <p>Loading...</p>} 
        {error && <p>Error: {error}</p>}
        {labData && (
          <form onSubmit={handleSubmit}> 
            {/* Lab Icon */}
            <div className="labIconSetting">
              <label htmlFor="labIcon">Lab Icon:</label>
              {labIconPreview && (<div className="lab-icon-preview-container" >
                                    <img src={labIconPreview} alt="Lab Icon Preview" />
                                </div> )}
              <input type="file" id="labIcon" accept="image/*" ref={fileInputRef} onChange={(e) => { 
                // Create preview URL
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/'))  {
                    setNewLabIcon(file); 
                    const fileReader = new FileReader();
                    fileReader.onload = function(event) {
                        setLabIconPreview(event.target.result); 
                    };
                    fileReader.readAsDataURL(file);
                  }else {
                    // Handle invalid file type
                    console.error('Invalid file type. Please select an image.');
                    setNewLabIcon(null); // Clear the previous image
                    setLabIconPreview(defaultIconUrl); // Reset the preview 
                    fileInputRef.current.value = '';
                    alert("Please select an image file"); // Provide user feedback
                }
              }} />
            
            </div>
            {/* Lab Name */}
            <div className="labNameSetting">
              <label htmlFor="labName">Lab Name:</label>
              <input type="text" id="labName" value={newLabName} onChange={(e) => setNewLabName(e.target.value)} /> 
            </div>
            <div className="joinIdSetting">
            <label htmlFor="joinId">Join ID:</label>
            <input type="text" id="joinId" value={newJoinId} disabled={isDisabled}/> 
            </div>
            <div className='deleteLabOption'>
              <button type="button" onClick={() => handleDelete(labId)}>Delete Lab</button>
              <h3>Delete the Lab Permanently</h3>
            </div>
            <div className='submitDiv'>
              <button type="submit">Save Changes</button>
            </div> 
          </form>
        )}
    </div>
  );
};

export default LabSettings; 