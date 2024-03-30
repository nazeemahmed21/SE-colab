// ThoughtsSearchbar.js
import React from "react";
import "../styles/thoughtscomp.css";

function ThoughtsSearchbar({ searchQuery, setSearchQuery }) {
  return (
    <div className="thoughts-searchbar">
      <input
        type="text"
        placeholder="Search by author name or thought title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

export default ThoughtsSearchbar;
