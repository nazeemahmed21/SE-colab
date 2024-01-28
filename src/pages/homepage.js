import React from "react";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { PageTitle, AppHeader, AppContent } from "../components/combinedTodo";
import styles from "../styles/todo.module.css";

const Home = () => {
  return (
    <>
      <div>
        <div>
          <Navbar />
        </div>
        <div className={styles.half}>
          <div className="container">
            <PageTitle>TO DO List</PageTitle>
            <div className={styles.app__wrapper}>
              <AppHeader />
              <AppContent />
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
        </div>
      </div>
    </>
  );
};

export default Home;
