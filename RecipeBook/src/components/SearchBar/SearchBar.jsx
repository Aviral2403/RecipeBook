import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ value, onChange, onSearch }) => {
  const [placeholder, setPlaceholder] = useState('');
  const [isUserFocused, setIsUserFocused] = useState(false);
  
  const words = ['Pasta?', 'Pizza?', 'Burgers?','Salad?','Cake?'];
  
  useEffect(() => {
    if (isUserFocused) return;
    
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let timeoutId;
    
    const typeEffect = () => {
      const currentWord = words[currentWordIndex];
      
      if (!isDeleting) {
        // Typing
        setPlaceholder(currentWord.slice(0, currentCharIndex + 1));
        currentCharIndex++;
        
        if (currentCharIndex === currentWord.length) {
          // Word complete, wait then start deleting
          timeoutId = setTimeout(() => {
            isDeleting = true;
            typeEffect();
          }, 2000);
          return;
        }
        
        timeoutId = setTimeout(typeEffect, 150);
      } else {
        // Deleting
        setPlaceholder(currentWord.slice(0, currentCharIndex));
        currentCharIndex--;
        
        if (currentCharIndex < 0) {
          // Deletion complete, move to next word
          isDeleting = false;
          currentWordIndex = (currentWordIndex + 1) % words.length;
          currentCharIndex = 0;
          
          timeoutId = setTimeout(typeEffect, 500);
          return;
        }
        
        timeoutId = setTimeout(typeEffect, 100);
      }
    };
    
    // Start the animation
    timeoutId = setTimeout(typeEffect, 500);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isUserFocused]);
  
  const handleFocus = () => {
    setIsUserFocused(true);
    setPlaceholder('');
  };
  
  const handleBlur = () => {
    if (!value) {
      setIsUserFocused(false);
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-content">
        <h1 className="search-title">I WANT TO MAKE...</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          />
          <button onClick={onSearch}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;