import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { PageTitle, AppHeader, AppContent } from "../components/combinedTodo";
import styles from "../styles/todo.module.css";
import Reminder from "../components/reminder";
import Popup from "../components/Popup"; // Import Popup component

function TodoPage() {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const showPopup = () => {
    setPopupVisible(true);
  };
  //ewlfnwefp
  const hidePopup = () => {
    setPopupVisible(false);
  };
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className={styles.todo_half}>
        <div className="todo_container">
          <PageTitle>TO DO List</PageTitle>
          <div className={styles.todo_app__wrapper}>
            <AppHeader />
            <AppContent />
          </div>
        </div>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontSize: "1.75rem",
          },
        }}
      />
      <Reminder />
      {/* Render Popup component conditionally */}
      {isPopupVisible && <Popup onClose={hidePopup} />}
    </>
  );
}

export default TodoPage;
