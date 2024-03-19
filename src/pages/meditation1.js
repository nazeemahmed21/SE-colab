import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import '../styles/meditation1.css';
import { Link } from "react-router-dom";

const Meditation1 = () => {
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    secondname: "",
    ProfPic: "",
    Role: "",
  });

  const [meditations, setMeditations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchUserData();
    fetchMeditations();
  }, []);

  const fetchUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      const userRef = doc(db, "Users", userId);

      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo({
            firstname: userData.firstName || "",
            secondname: userData.lastName || "",
            ProfPic: userData.pfpURL || "",
            Role: userData.role || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const fetchMeditations = async () => {
    try {
      // Fetch meditations from your database or API
      const meditationsData = [
        { title: "For Beginners", category: "beginner", content: [
          { title: "Introduction to Meditation", description: "A beginner-friendly meditation introduction." },
          { title: "Breathing Techniques", description: "Learn simple breathing techniques for relaxation." },
          { title: "Body Scan Meditation", description: "A guided meditation to scan and relax your body." }
        ] },
        { title: "Quick and Easy", category: "quick_easy", content: [
          { title: "5-Minute Mindfulness", description: "Quick mindfulness exercises for busy days." },
          { title: "Stress Relief", description: "Instant stress relief techniques." },
          { title: "Morning Meditation", description: "Start your day with a short morning meditation." }
        ] },
        { title: "Sleep Better", category: "sleep", content: [
          { title: "Sleep Meditation", description: "Guided meditation to help you fall asleep faster." },
          { title: "Night-time Relaxation", description: "Relaxation techniques for a peaceful night's sleep." },
          { title: "Deep Sleep", description: "Meditations to promote deep and restful sleep." }
        ] },
        // Add more categories and their content as needed
      ];
      setMeditations(meditationsData);
    } catch (error) {
      console.error("Error fetching meditations:", error);
    }
  };

  const filterMeditations = (category) => {
    setSelectedCategory(category);
    // Logic to filter meditations based on the selected category
  };

  const filteredMeditations = selectedCategory === "all" ? meditations : meditations.filter(meditation => meditation.category === selectedCategory);

  return (
    <div className='Meditation1PageWithNavBar'>
      <Navbar />
      <div className="Meditation1Page">
        <h1>Hello {userInfo.firstname} </h1>
        <h2>How are you feeling today?</h2>
        <div className="emotion-container">
          <div className="emotion-box">
            <span role="img" aria-label="happy">😊</span>
            <div className="emotion-title">Happy</div>
            <div className="emotion-description">Feeling joyful and content</div>
          </div>
          <div className="emotion-box">
            <span role="img" aria-label="sad">😢</span>
            <div className="emotion-title">Sad</div>
            <div className="emotion-description">Feeling down or melancholic</div>
          </div>
          <div className="emotion-box">
            <span role="img" aria-label="calm">😌</span>
            <div className="emotion-title">Calm</div>
            <div className="emotion-description">Feeling peaceful and relaxed</div>
          </div>
          <div className="emotion-box">
            <span role="img" aria-label="Anxious">😌</span>
            <div className="emotion-title">Anxious</div>
            <div className="emotion-description">Feeling peaceful and relaxed</div>
          </div>
          <div className="emotion-box">
            <span role="img" aria-label="Tired">😌</span>
            <div className="emotion-title">Tired</div>
            <div className="emotion-description">Feeling peaceful and relaxed</div>
          </div>
          <div className="emotion-box">
            <span role="img" aria-label="Angry">😌</span>
            <div className="emotion-title">Angry</div>
            <div className="emotion-description">Feeling peaceful and relaxed</div>
          </div>
          <div className="emotion-box">
            <span role="img" aria-label="Meditate">😌</span>
            <div className="emotion-title">I want to meditate</div>
            <div className="emotion-description">Feeling peaceful and relaxed</div>
          </div>
          </div>
        <div className="filter-categories">
          <button className={selectedCategory === "all" ? "active" : ""} onClick={() => filterMeditations("all")}>All</button>
          <button className={selectedCategory === "beginner" ? "active" : ""} onClick={() => filterMeditations("beginner")}>For Beginners</button>
          <button className={selectedCategory === "quick_easy" ? "active" : ""} onClick={() => filterMeditations("quick_easy")}>Quick and Easy</button>
          <button className={selectedCategory === "sleep" ? "active" : ""} onClick={() => filterMeditations("sleep")}>Sleep Better</button>
          {/* Add more category buttons as needed */}
        </div>
        <div className="meditation-playlist">
          {meditations.length === 0 ? (
            <p>Loading...</p>
          ) : (
            filteredMeditations.map((category, index) => (
              <div key={index} className="category-container">
                <h3>{category.title}</h3>
                {/* <div className="content-tiles">
                  {category.content.map((contentItem, contentIndex) => (
                    <div key={contentIndex} className="content-tile">
                      <h4>{contentItem.title}</h4>
                      <p>{contentItem.description}</p>
                      <Link to={`/meditationPlayer/${contentItem.title}`}>Meditation Player</Link> </div>
                  ))}
                </div> */}
                <div className="content-tiles">
  {category.content.map((contentItem, contentIndex) => (
    <Link key={contentIndex} to={`/meditationPlayer/${contentItem.title}`} className="content-tile">
      <div>
        <h4>{contentItem.title}</h4>
        <p>{contentItem.description}</p>
      </div>
    </Link>
  ))}
</div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Meditation1;
