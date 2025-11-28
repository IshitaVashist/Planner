const IntroPage = ({ onExplore }) => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.logoContainer}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={styles.logo}>
            {/* Brown circle background */}
            <ellipse cx="60" cy="70" rx="45" ry="35" fill="#8B4513" />
            
            {/* Plant stem */}
            <rect x="57" y="50" width="6" height="40" fill="#4ADE80" rx="3" />
            
            {/* Top leaf (right) */}
            <ellipse cx="68" cy="45" rx="12" ry="8" fill="#4ADE80" transform="rotate(45 68 45)" />
            
            {/* Second leaf (left) */}
            <ellipse cx="52" cy="55" rx="12" ry="8" fill="#4ADE80" transform="rotate(-45 52 55)" />
            
            {/* Third leaf (right) */}
            <ellipse cx="68" cy="65" rx="12" ry="8" fill="#4ADE80" transform="rotate(30 68 65)" />
            
            {/* Fourth leaf (left) */}
            <ellipse cx="52" cy="75" rx="12" ry="8" fill="#4ADE80" transform="rotate(-30 52 75)" />
          </svg>
        </div>

        <h1 style={styles.title}>TIMETOGO</h1>

        <button style={styles.button} onClick={onExplore}>
          LETS EXPLORE THE APPLICATION
        </button>
      </div>
    </div>
  );
};

const MainPage = () => {
  return (
    <div style={mainPageStyles.container}>
      <div style={mainPageStyles.content}>
        <h1 style={mainPageStyles.title}>Welcome to TimeToGo</h1>
        <p style={mainPageStyles.text}>This is the main page of the application.</p>
      </div>
    </div>
  );
};

const mainPageStyles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    padding: '20px',
    boxSizing: 'border-box',
  },
  content: {
    textAlign: 'center',
    maxWidth: '800px',
    width: '100%',
  },
  title: {
    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: '20px',
  },
  text: {
    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
    color: '#4a5568',
  },
};

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    padding: '20px',
    boxSizing: 'border-box',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '40px',
    maxWidth: '800px',
    width: '100%',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
  },
  title: {
    fontSize: 'clamp(3rem, 8vw, 5rem)',
    fontWeight: '900',
    color: '#1a1a1a',
    margin: '0',
    letterSpacing: '0.05em',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#f9a8d4',
    color: '#1a1a1a',
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    fontWeight: '700',
    padding: '18px 40px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    letterSpacing: '0.03em',
  },
};

// Add hover effect using CSS-in-JS approach
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2) !important;
      background-color: #f472b6 !important;
    }
    
    button:active {
      transform: translateY(0);
    }
    
    @media (max-width: 768px) {
      button {
        padding: 14px 30px !important;
      }
    }
    
    @media (max-width: 480px) {
      button {
        padding: 12px 24px !important;
        font-size: 0.85rem !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default IntroPage;