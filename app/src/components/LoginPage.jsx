import React, { useState } from 'react';

// --- Flower Icon Components (Preserved) ---
const IconFlower1 = () => (
  <svg viewBox="0 0 50 50" fill="#f472b6"> 
    <circle cx="25" cy="25" r="7" fill="#fde047" /> 
    <circle cx="15" cy="18" r="8" />
    <circle cx="18" cy="32" r="8" />
    <circle cx="32" cy="32" r="8" />
    <circle cx="35" cy="18" r="8" />
    <circle cx="25" cy="12" r="8" />
  </svg>
);  

const IconFlower2 = () => (
  <svg viewBox="0 0 24 24" fill="#60a5fa"> 
    <path d="M12 2C9.24 2 7 4.24 7 7s.5 4.5 5 9.5c4.5-5 5-6.5 5-9.5S14.76 2 12 2zm0 18v2" />
  </svg>
);

const IconFlower3 = () => (
  <svg viewBox="0 0 24 24" fill="#f59e0b"> 
    <circle cx="12" cy="12" r="3" fill="#92400e" /> 
    <path d="M12 2v3M12 19v3M22 12h-3M5 12H2M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12M19.07 19.07l-2.12-2.12M7.05 7.05L4.93 4.93" />
  </svg>
);

const BackgroundIllustrations = ({ styles }) => {
  const illuStyle = (top, left, rotate, opacity = 0.7, size = 40) => ({
    position: 'absolute',
    top: `${top}%`,
    left: `${left}%`,
    width: size,
    height: size,
    transform: `rotate(${rotate}deg) translate(-50%, -50%)`,
    opacity: opacity,
  });

  return (
    <div style={styles.backgroundContainer}>
      <div style={illuStyle(10, 15, -15, 0.5, 50)}><IconFlower1 /></div>
      <div style={illuStyle(20, 80, 20, 0.7, 30)}><IconFlower2 /></div>
      <div style={illuStyle(5, 50, 5, 0.6, 45)}><IconFlower3 /></div>
      <div style={illuStyle(35, 30, -10, 0.4, 60)}><IconFlower2 /></div>
      <div style={illuStyle(40, 90, 10, 0.5, 40)}><IconFlower1 /></div>
      <div style={illuStyle(55, 10, -5, 0.8, 35)}><IconFlower3 /></div>
      <div style={illuStyle(70, 70, 15, 0.6, 55)}><IconFlower1 /></div>
      <div style={illuStyle(85, 25, 0, 0.4, 40)}><IconFlower2 /></div>
      <div style={illuStyle(90, 85, -10, 0.7, 30)}><IconFlower3 /></div>
      <div style={illuStyle(75, 5, 10, 0.5, 40)}><IconFlower1 /></div>
    </div>
  );
};

const LoginPage = ({ onLoginSuccess }) => {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleAuthAction = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate Name
    if (!name.trim()) {
        setError('Name is required.');
        return;
    }

    if (isRegister) {
      console.log('Registering with:', name, email, password);
    } else {
      console.log('Logging in with:', name, email, password);
    }
    // Pass the name up to App.jsx
    onLoginSuccess(name);
  };

  const handleSkip = () => {
    // Validate Name before skipping
    if (!name.trim()) {
        setError('Please enter your name to continue.');
        return;
    }
    console.log('Skipping login...');
    // Pass the name up to App.jsx
    onLoginSuccess(name);
  };

  // --- STYLES OBJECT ---
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative', 
      overflow: 'hidden',   
      backgroundColor: '#fffcf7', 
    },
    backgroundContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
      overflow: 'hidden', 
    },
    loginBox: {
      backgroundColor: 'white',
      // Updated: Adjusted padding and width for a better centered fit
      padding: '30px 40px',
      borderRadius: '24px',
      boxShadow: '0 10px 25px -5px rgba(255, 105, 180, 0.3), 0 8px 10px -6px rgba(255, 105, 180, 0.1)',
      border: '1px solid black',
      maxWidth: '400px',
      width: '90%', // Responsive width
      boxSizing: 'border-box',
      position: 'relative', 
      zIndex: 10,           
    },
    title: {
      fontFamily: '"Pacifico", cursive',
      // Updated: Slightly smaller title to fit better
      fontSize: '2.2rem', 
      fontWeight: '400',
      letterSpacing: '1px',
      color: '#1a1a1a',
      textAlign: 'center',
      marginBottom: '5px',
    },
    subtitle: {
      textAlign: 'center',
      color: '#4a5568',
      marginBottom: '20px', // Reduced margin
      fontSize: '0.95rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px', // Reduced gap for better vertical fit
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontWeight: '600',
      color: '#333',
      fontSize: '0.9rem',
      marginLeft: '5px', // Slight indent for rounded look
    },
    input: {
      width: '100%',
      padding: '14px 15px',
      // UPDATED: Rounded inputs & Border
      border: '1px solid #eee',
      borderRadius: '12px',
      backgroundColor: '#fafafa',
      fontSize: '1rem',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif',
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    loginButton: {
      backgroundColor: '#ffb6c1', // Updated: Light Pink base
      color: '#1a1a1a',
      border: 'none',
      padding: '14px',
      // UPDATED: Rounded Button
      borderRadius: '16px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px',
    },
    toggleButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#4a5568',
      cursor: 'pointer',
      textDecoration: 'underline',
      fontSize: '0.9rem',
      padding: '5px',
      textAlign: 'center',
      marginTop: '10px',
      width:'100%',
    },
    or: {
      border: 'none',
      color: '#4a5568',
      fontSize: '0.9rem',
      padding: '5px',
      textAlign: 'center',
      width: '100%',
      marginTop: '5px', 
    },
    skipButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#4a5568',
      cursor: 'pointer',
      textDecoration: 'underline',
      fontSize: '0.9rem',
      padding: '5px',
      textAlign: 'center',
      width: '100%',
      marginTop: '5px', 
    },
    errorMessage: {
        color: '#e53e3e',
        fontSize: '0.9rem',
        textAlign: 'center',
        marginBottom: '15px',
        fontWeight: '600',
        backgroundColor: '#fff5f5',
        padding: '10px',
        borderRadius: '12px',
    }
  };
  
  React.useEffect(() => {
    const fontLinkId = 'google-font-inter-login';
    let fontLink = document.getElementById(fontLinkId);
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = fontLinkId;
      // Added Pacifico
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&family=Pacifico&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
    
    const styleSheetId = 'login-styles-hover';
    let styleSheet = document.getElementById(styleSheetId);
    if (!styleSheet) {
      styleSheet = document.createElement('style');
      styleSheet.id = styleSheetId;
      styleSheet.innerHTML = `
        .login-button-hover:hover {
          /* Updated: Ombre pink hover (gradient), not too dark */
          background: linear-gradient(90deg, #ffb6c1, #ff9eb5) !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(255, 105, 180, 0.25);
        }
        .skip-button-hover:hover, .toggle-button-hover:hover {
          color: #1a1a1a !important;
        }
        /* Pink Focus for Inputs */
        input:focus {
          border: 1px solid #ffb6c1 !important;
          background-color: #fff !important;
          box-shadow: 0 0 0 3px rgba(255, 182, 193, 0.2);
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  return (
    <div style={styles.container}>
      <BackgroundIllustrations styles={styles} />
      
      <div style={styles.loginBox}>
        {/* Static Header */}
        <h1 style={styles.title}>Welcome to Your Planner</h1>
        
        <p style={styles.subtitle}>
          {isRegister ? 'Create an account to get started.' : 'Sign in to your account.'}
        </p>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form style={styles.form} onSubmit={handleAuthAction}>
          
          {/* Name is Mandatory */}
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              style={styles.input}
              value={name}
              onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(''); 
              }}
              placeholder="Enter your name"
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            style={styles.loginButton}
            className="login-button-hover"
          >
            {isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>

        <button
          style={styles.toggleButton}
          className="toggle-button-hover, Signin-button"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? 'Already have an account? Sign in.' : "Don't have an account? Sign Up"}
        </button>
        <div style={styles.or} > or </div>
        <button
          style={styles.skipButton}
          className="skip-button-hover, Signin-button"
          onClick={handleSkip}
          type="button"
        >
          Skip Login ;)
        </button>
      </div>
    </div>
  );
};

export default LoginPage;