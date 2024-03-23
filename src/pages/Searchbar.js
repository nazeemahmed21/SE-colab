// Searchbar.js
import React from "react";
import "../styles/events.css";

function Searchbar({ searchQuery, setSearchQuery }) {
  return (
    <div className="eventsSearchBar">
      <input
        type="text"
        placeholder=" Search Events by author name or event title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

export default Searchbar;
