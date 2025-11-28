import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    zodiac: "",
    profilePic: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setFormData({
      ...formData,
      profilePic: imageURL
    });
  };

  // --- STYLES ---
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: '20px',
      boxSizing: 'border-box',
      backgroundColor: '#f5f0e8',   // <<< NEW BACKGROUND COLOR
      minHeight: '100vh'
    },
    card: {
      backgroundColor: '#ffffff',
      border: '2px solid #1a1a1a',
      borderRadius: '20px',
      padding: '40px',
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
      margin: '0 0 30px 0',
      color: '#1a1a1a',
    },
    imageContainer: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      border: '2px solid #1a1a1a',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '30px',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'pointer'
    },
    profileImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    placeholderIcon: {
      fontSize: '3rem',
      color: '#aaa',
    },
    uploadInput: {
      display: 'none'
    },
    infoGroup: {
      width: '100%',
      marginBottom: '15px',
    },
    label: {
      fontSize: '0.85rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: '#666',
      marginBottom: '5px',
      display: 'block',
      letterSpacing: '1px',
    },
    inputBox: {
      width: '100%',
      padding: '12px 15px',
      backgroundColor: '#FAFAFA',
      border: '2px solid #1a1a1a',
      borderRadius: '12px',
      fontSize: '1.1rem',
      color: '#1a1a1a',
      boxSizing: 'border-box',
      fontFamily: 'sans-serif',
    },
    decorativeBadge: {
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
      userSelect: 'none'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Cross button → back to planner */}
        <div 
          style={styles.decorativeBadge} 
          onClick={() => navigate('/planner')}
        >
          ×
        </div>

        <h1 style={styles.header}>My Profile</h1>

        {/* Profile Picture Upload */}
        <label style={styles.imageContainer}>
          {formData.profilePic ? (
            <img src={formData.profilePic} alt="Profile" style={styles.profileImage} />
          ) : (
            <div style={styles.placeholderIcon}>👤</div>
          )}
          <input 
            type="file"
            accept="image/*"
            style={styles.uploadInput}
            onChange={handleImageUpload}
          />
        </label>

        {/* Editable Fields */}
        <div style={styles.infoGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.inputBox}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Email ID</label>
          <input
            style={styles.inputBox}
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Date of Birth</label>
          <input
            style={styles.inputBox}
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Zodiac Sign</label>
          <input
            style={styles.inputBox}
            name="zodiac"
            value={formData.zodiac}
            onChange={handleChange}
            placeholder="Enter zodiac sign"
          />
        </div>

      </div>
    </div>
  );
};

export default Profile;
