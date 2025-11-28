import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f5f0e8',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      boxSizing: 'border-box',
    },

    card: {
      width: '100%',
      maxWidth: '650px',
      backgroundColor: '#ffffff',
      border: '2px solid #1a1a1a',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '8px 8px 0px #FBCFE8',
      position: 'relative',
    },

    crossButton: {
      position: 'absolute',
      top: '-15px',
      right: '-15px',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#FBCFE8',
      border: '2px solid #1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      userSelect: 'none',
    },

    header: {
      textAlign: 'center',
      marginBottom: '30px',
      fontFamily: "'Pinyon Script', cursive",
      fontSize: '2.7rem',
      color: '#1a1a1a',
    },

    section: {
      width: '100%',
      marginBottom: '30px',
    },

    sectionTitle: {
      fontSize: '1.2rem',
      fontWeight: '700',
      marginBottom: '15px',
      color: '#1a1a1a',
      borderBottom: '2px solid #e5e7eb',
      paddingBottom: '5px',
    },

    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: '15px 20px',
      borderRadius: '12px',
      marginBottom: '12px',
      border: '2px solid #1a1a1a',
      boxShadow: '4px 4px 0px #FBCFE8',
    },

    label: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#333',
    },

    toggle: {
      width: '40px',
      height: '20px',
      backgroundColor: '#FBCFE8',
      borderRadius: '20px',
      position: 'relative',
      cursor: 'pointer',
      border: '1px solid #1a1a1a',
    },

    toggleKnob: {
      width: '16px',
      height: '16px',
      backgroundColor: 'white',
      borderRadius: '50%',
      position: 'absolute',
      top: '1px',
      right: '1px',
      border: '1px solid #1a1a1a',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Cross button to return to planner */}
        <div 
          style={styles.crossButton}
          onClick={() => navigate('/planner')}
        >
          ×
        </div>

        <h1 style={styles.header}>Settings</h1>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Appearance</h3>

          <div style={styles.row}>
            <span style={styles.label}>Dark Mode</span>
            <div style={styles.toggle}>
              <div style={{ ...styles.toggleKnob, right: 'auto', left: '1px' }}></div>
            </div>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Show Weekends</span>
            <div style={styles.toggle}>
              <div style={styles.toggleKnob}></div>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Notifications</h3>

          <div style={styles.row}>
            <span style={styles.label}>Email Notifications</span>
            <div style={styles.toggle}>
              <div style={styles.toggleKnob}></div>
            </div>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Daily Reminders</span>
            <div style={styles.toggle}>
              <div style={{ ...styles.toggleKnob, right: 'auto', left: '1px' }}></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
