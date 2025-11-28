import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Bar = () => {
  // Removed username, showTasks, setShowTasks props as they are no longer needed here
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); 

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (viewName) => {
    setIsMenuOpen(false); 
    navigate(`/${viewName.toLowerCase()}`);
  };
  
  // --- STYLES ---
  const styles = {
    // 1. The Toggle Button
    menuButton: {
      position: 'fixed', 
      top: '20px',
      left: '20px',
      backgroundColor: isMenuOpen ? 'transparent' : '#FBCFE8', 
      border: isMenuOpen ? 'none' : '2px solid #000000', 
      cursor: 'pointer',
      padding: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1a1a1a',
      borderRadius: '12px',
      boxShadow: isMenuOpen ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      zIndex: 100, 
    },

    // 2. The Transparent Pink Overlay Sheet
    overlaySheet: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',           
      height: '25vh',          
      backgroundColor: 'rgba(251, 207, 232, 0.9)', 
      backdropFilter: 'blur(5px)', 
      borderBottom: '2px solid #000', 
      
      display: 'flex',
      flexDirection: 'row',    
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',             
      
      paddingTop: '40px',      
      zIndex: 90, 
      
      // Slide Animation
      transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },

    // 3. Application Style Buttons
    navButton: {
      padding: '10px 24px',
      backgroundColor: '#ffffff', 
      border: '2px solid #1a1a1a', 
      borderRadius: '12px',       
      fontSize: '1rem',
      fontWeight: '600',
      fontFamily: 'sans-serif',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      color: '#1a1a1a',
      boxShadow: '3px 3px 0px rgba(0,0,0,1)', 
      minWidth: '100px',
    },
  };

  // Hover Helpers
  const handleMouseEnter = (e) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '5px 5px 0px rgba(0,0,0,1)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = '3px 3px 0px rgba(0,0,0,1)';
  };

  return (
    <>
      {/* 1. Toggle Button */}
      <button style={styles.menuButton} onClick={handleMenuToggle}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          {isMenuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* 2. Menu Sheet */}
      <div style={styles.overlaySheet}>
        <button 
          style={styles.navButton} 
          onClick={() => handleNavigation('Planner')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Planner
        </button>

        <button 
          style={styles.navButton} 
          onClick={() => handleNavigation('Profile')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Profile
        </button>

        <button 
          style={styles.navButton} 
          onClick={() => handleNavigation('Theme')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Theme
        </button>

        <button 
          style={styles.navButton} 
          onClick={() => handleNavigation('Settings')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Settings
        </button>
      </div>
    </>
  );
};

export default Bar;