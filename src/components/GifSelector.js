import React, { useState } from 'react';
// import '../Style.css';

const GifSelector = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchGifs = async () => {
    // Implement GIF search logic using Giphy API or any other GIF API
    // This is a simplified example
    try {
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchQuery}&api_key=YOUR_API_KEY`);
      const data = await response.json();
      setSearchResults(data.data);
    } catch (error) {
      console.error('Error searching GIFs:', error);
    }
  };

  const handleSelectGif = (gif) => {
    onSelect(gif);
  };

  return (
    <div className="gif-selector">
      <input
        type="text"
        placeholder="Search GIFs"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => {
            if (e.key === 'Enter') {
              searchGifs();
            }
          }}
      />
      <button onClick={searchGifs}>Search</button>
      <div className="gif-results">
        {searchResults.map((gif) => (
          <div key={gif.id} className="gif-item" onClick={() => handleSelectGif(gif)}>
            <img src={gif.images.fixed_height.url} alt={gif.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GifSelector;
