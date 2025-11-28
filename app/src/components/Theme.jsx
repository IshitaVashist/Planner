import React from 'react';
import { useNavigate } from "react-router-dom";

const Theme = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f0e8', // same as Profile
      padding: '20px',
      boxSizing: 'border-box',
    },

    card: {
      backgroundColor: '#ffffff', // same as Profile
      border: '2px solid #1a1a1a',
      borderRadius: '20px',
      padding: '40px 20px',
      width: '100%',
      maxWidth: '500px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '8px 8px 0px #FBCFE8',
      position: 'relative',
    },

    header: {
      fontFamily: "'Pinyon Script', cursive",
      fontSize: '3rem',
      marginBottom: '30px',
      color: '#1a1a1a',
    },

    crossButton: {
      position: 'absolute',
      top: '-15px',
      right: '-15px',
      backgroundColor: '#FBCFE8',
      border: '2px solid #1a1a1a',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      userSelect: 'none',
    },

    comingSoonBar: {
      position: 'relative',
      width: '80%',
      padding: '15px 20px',
      borderRadius: '12px',
      backgroundColor: '#cce7ff', // light blue
      border: '2px solid #1a1a1a',
      fontWeight: 'bold',
      fontSize: '1.3rem',
      color: '#1a1a1a',
      textAlign: 'center',
      overflow: 'hidden',
      marginTop: '10px',
    },

    snowflake: {
      position: 'absolute',
      color: '#ffffff',
      fontSize: '1.2rem',
      opacity: 0.8,
      animation: 'fall 10s linear infinite',
    },

    // keyframes for snow falling inside the bar
    keyframes: `
      @keyframes fall {
        0% { transform: translateY(-10px); }
        100% { transform: translateY(60px); }
      }
    `
  };

  return (
    <div style={styles.container}>
      {/* Inject keyframes */}
      <style>{styles.keyframes}</style>

      <div style={styles.card}>

        {/* Cross button */}
        <div style={styles.crossButton} onClick={() => navigate("/planner")}>×</div>

        {/* Heading */}
        <h1 style={styles.header}>Theme</h1>

        {/* Coming Soon Bar with snowflakes */}
        <div style={styles.comingSoonBar}>
          {/* Snowflakes */}
          <div style={{...styles.snowflake, top: '10%', left: '15%'}}>❄️</div>
          <div style={{...styles.snowflake, top: '30%', left: '60%'}}>❄️</div>
          <div style={{...styles.snowflake, top: '50%', left: '35%'}}>❄️</div>
          <div style={{...styles.snowflake, top: '20%', left: '75%'}}>❄️</div>

          {/* Text */}
          🎄 Coming Soon 🎁
        </div>

      </div>
    </div>
  );
};

export default Theme;
