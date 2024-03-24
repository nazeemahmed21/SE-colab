import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "../styles/meditation1.css";
import { Link } from "react-router-dom";
import rainpic1 from "../components/Meditation1/soft-rain.jpg";
import rainpic2 from "../components/Meditation1/forest.jpg";
import rainpic3 from "../components/Meditation1/harmony.jpg";
import quick1 from "../components/Meditation1/5min.jpg";
import quick2 from "../components/Meditation1/stressRelief.jpg";
import quick3 from "../components/Meditation1/morning.jpg";
import intro1 from "../components/Meditation1/intro1.jpg";
import intro2 from "../components/Meditation1/breathe.jpg";
import intro3 from "../components/Meditation1/BodyScanMeditation.jpg";
import low1 from "../components/Meditation1/low1.jpg";
import low2 from "../components/Meditation1/low2.jpg";
import low3 from "../components/Meditation1/low3.jpeg";
import happyEm from "../components/Meditation1/happyEmoji.jfif";
import sadEm from "../components/Meditation1/sadEmoji.jfif";
import tiredEm from "../components/Meditation1/tiredEmoji.jfif";
import anxiousEm from "../components/Meditation1/anxiousEmoji.jfif";
import hardBreathe from "../components/Meditation1/hardBreatheEmoji.jfif";
import angryEm from "../components/Meditation1/angryEmoji.jfif";

const Meditation1 = () => {
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    secondname: "",
    ProfPic: "",
    Role: "",
  });

  const [meditations, setMeditations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [setFilteredMeditations] = useState([]);

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
        {
          title: "For Beginners",
          category: "beginner",
          content: [
            {
              title: "Introduction to Meditation",
              description: "A beginner-friendly meditation introduction.",
              pic: intro1,
            },
            {
              title: "Breathing Techniques",
              description: "Learn simple breathing techniques for relaxation.",
              pic: intro2,
            },
            {
              title: "Body Scan Meditation",
              description: "A guided meditation to scan and relax your body.",
              pic: intro3,
            },
          ],
        },
        {
          title: "Quick and Easy",
          category: "quick_easy",
          content: [
            {
              title: "5-Minute Mindfulness",
              description: "Quick mindfulness exercises for busy days.",
              pic: quick1,
            },
            {
              title: "Stress Relief",
              description: "Instant stress relief techniques.",
              pic: quick2,
            },
            {
              title: "Morning Meditation",
              description: "Start your day with a short morning meditation.",
              pic: quick3,
            },
          ],
        },
        {
          title: "Sleep Better - Sleep Music",
          category: "sleep",
          content: [
            // Sound Effect by <a href="https://pixabay.com/users/soundsforyou-4861230/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=111154">Mikhail</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=111154">Pixabay</a>
            {
              title: "Rainy morning",
              description: "Guided meditation to help you fall asleep faster.",
              pic: rainpic1,
            },
            // Image by <a href="https://pixabay.com/users/seaq68-4191072/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2942477">Sven Lachmann</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2942477">Pixabay</a>
            // Music by <a href="https://pixabay.com/users/light_music-40074088/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=187590">Alex Wit</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=187590">Pixabay</a>
            {
              title: "Forest stroll",
              description:
                "Relaxation techniques for a peaceful night's sleep.",
              pic: rainpic2,
            },
            // Image by <a href="https://pixabay.com/users/wokandapix-614097/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2525787">WOKANDAPIX</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2525787">Pixabay</a>
            // Music by <a href="https://pixabay.com/users/relaxingtime-17430502/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=123887">Piotr Witowski</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=123887">Pixabay</a>
            {
              title: "Harmony",
              description: "Meditations to promote deep and restful sleep.",
              pic: rainpic3,
            },
          ],
        },
        {
          title: "Not in a good mood? Feel better",
          category: "low",
          content: [
            // Music by <a href="https://pixabay.com/users/harumachi-13470593/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=112199">Noru</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=112199">Pixabay</a>
            {
              title: "Winter rhythm",
              description: "Embrace the tranquility of winter.",
              pic: low1,
            },
            // Music by <a href="https://pixabay.com/users/white_records-32584949/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=140705">Maksym Dudchyk</a> from <a href="https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=140705">Pixabay</a>
            {
              title: "Enchanted garden",
              description:
                "Step into an enchanted garden and experience relaxation.",
              pic: low2,
            },
            // Image by <a href="https://pixabay.com/users/wokandapix-614097/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2525787">WOKANDAPIX</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2525787">Pixabay</a>
            // Music by <a href="https://pixabay.com/users/verbovets-35294585/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=186241">verbovets</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=186241">Pixabay</a>
            {
              title: "Serenity Symphony",
              description: "Immerse yourself in a serene symphony of sounds.",
              pic: low3,
            },
          ],
        },
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

  const filteredMeditations =
    selectedCategory === "all"
      ? meditations
      : meditations.filter(
          (meditation) => meditation.category === selectedCategory
        );

  const filterMeditationsByEmotion = (emotion) => {
    // Logic to filter meditations based on the selected emotion
    switch (emotion) {
      case "happy":
        // Set the selected category to "beginner" when happy emoji is clicked
        setSelectedCategory("beginner");
        break;
      case "tired":
        // Display meditations for better sleep
        setSelectedCategory("sleep");
        break;
      case "sad":
        setSelectedCategory("low");
        // Handle sad emotion filtering
        // Add logic to filter and display meditations based on the emotion
        break;
      case "anxious":
        setSelectedCategory("low");
        // Handle anxious emotion filtering
        // Add logic to filter and display meditations based on the emotion
        break;
      case "angry":
        setSelectedCategory("quick_easy");
        // Handle angry emotion filtering
        // Add logic to filter and display meditations based on the emotion
        break;
      case "hardBreathe":
        // Handle hardBreathe emotion filtering
        // Add logic to filter and display meditations based on the emotion
        break;
      default:
        // If no emotion matches, display all meditations
        setFilteredMeditations(meditations);
    }
  };

  return (
    <div className="Meditation1PageWithNavBar">
      <div className="NavbarMeditatation1">
        <Navbar />{" "}
      </div>
      <div className="Meditation1Page">
        <h1>Hello {userInfo.firstname} </h1>
        <h2>How are you feeling today?</h2>
        <div className="emotion-container">
          <div
            className="emotion-box"
            style={{ backgroundImage: `url(${happyEm})` }}
            onClick={() => filterMeditationsByEmotion("happy")}
          >
            <div className="Happy">Happy</div>
          </div>
          <div
            className="emotion-box"
            style={{ backgroundImage: `url(${tiredEm})` }}
            onClick={() => filterMeditationsByEmotion("tired")}
          >
            <div className="Tired">Tired</div>
          </div>
          <div
            className="emotion-box"
            style={{ backgroundImage: `url(${sadEm})` }}
            onClick={() => filterMeditationsByEmotion("sad")}
          >
            <div className="Sad">Sad</div>
          </div>
          <div
            className="emotion-box"
            style={{ backgroundImage: `url(${anxiousEm})` }}
            onClick={() => filterMeditationsByEmotion("anxious")}
          >
            <div className="Anxious">Anxious</div>
          </div>
          <div
            className="emotion-box"
            style={{ backgroundImage: `url(${angryEm})` }}
            onClick={() => filterMeditationsByEmotion("angry")}
          >
            <div className="Angry">Angry</div>
          </div>
          <div
            className="emotion-box"
            style={{
              backgroundImage: `url(${hardBreathe})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="breatheHard">Hard to Breathe?</div>
          </div>
        </div>
        <div className="filter-categories">
          <button
            className={selectedCategory === "all" ? "active" : ""}
            onClick={() => filterMeditations("all")}
          >
            All
          </button>
          <button
            className={selectedCategory === "beginner" ? "active" : ""}
            onClick={() => filterMeditations("beginner")}
          >
            For Beginners
          </button>
          <button
            className={selectedCategory === "quick_easy" ? "active" : ""}
            onClick={() => filterMeditations("quick_easy")}
          >
            Quick and Easy
          </button>
          <button
            className={selectedCategory === "sleep" ? "active" : ""}
            onClick={() => filterMeditations("sleep")}
          >
            Sleep Better
          </button>
          <button
            className={selectedCategory === "low" ? "active" : ""}
            onClick={() => filterMeditations("low")}
          >
            Low mood?
          </button>

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
                    <Link
                      key={contentIndex}
                      to={`/meditationPlayer/${contentItem.title}`}
                      className="content-tile"
                      style={{ backgroundImage: `url(${contentItem.pic})` }}
                    >
                      <div className="content-text">
                        {/* <img src={contentItem.pic} alt={contentItem.title} className="content-image" /> */}

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
