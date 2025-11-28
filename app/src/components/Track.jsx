import React, { useMemo } from 'react';

// --- ICONS (Simple SVGs) ---
const IconFlower1 = () => (
  <svg viewBox="0 0 50 50" fill="#f472b6" style={{ width: '100%', height: '100%' }}>
    <circle cx="25" cy="25" r="7" fill="#fde047" />
    <circle cx="15" cy="18" r="8" />
    <circle cx="18" cy="32" r="8" />
    <circle cx="32" cy="32" r="8" />
    <circle cx="35" cy="18" r="8" />
    <circle cx="25" cy="12" r="8" />
  </svg>
);

const IconFlower2 = () => (
  <svg viewBox="0 0 24 24" fill="#60a5fa" style={{ width: '100%', height: '100%' }}>
    <path d="M12 2C9.24 2 7 4.24 7 7s.5 4.5 5 9.5c4.5-5 5-6.5 5-9.5S14.76 2 12 2zm0 18v2" />
  </svg>
);

const IconFlower3 = () => (
  <svg viewBox="0 0 24 24" fill="#f59e0b" style={{ width: '100%', height: '100%' }}>
    <circle cx="12" cy="12" r="3" fill="#92400e" />
    <path d="M12 2v3M12 19v3M22 12h-3M5 12H2M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12M19.07 19.07l-2.12-2.12M7.05 7.05L4.93 4.93" />
  </svg>
);

// --- BACKGROUND COMPONENT (High Density Fill) ---
const BackgroundIllustrations = ({ styles }) => {
  const illustrations = useMemo(() => {
    const items = [];
    const icons = [IconFlower1, IconFlower2, IconFlower3];
    
    // Grid settings for "filled all over" look
    const rows = 8;    
    const cols = 12;   
    
    const rowStep = 100 / rows;
    const colStep = 100 / cols;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Calculate base position
        const basePathY = r * rowStep;
        const basePathX = c * colStep;

        // Add randomness (Jitter)
        const top = basePathY + (Math.random() * 10 - 2); 
        const left = basePathX + (Math.random() * 10 - 2);
        
        // Random properties
        const Icon = icons[Math.floor(Math.random() * icons.length)];
        const size = 30 + Math.random() * 40; 
        const rotation = Math.random() * 360;
        const opacity = 0.15 + Math.random() * 0.25; 

        items.push({ id: `${r}-${c}`, top, left, Icon, size, rotation, opacity });
      }
    }
    return items;
  }, []);

  return (
    <div style={styles.backgroundContainer}>
      {illustrations.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            top: `${item.top}%`,
            left: `${item.left}%`,
            width: `${item.size}px`,
            height: `${item.size}px`,
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
            opacity: item.opacity,
            pointerEvents: 'none', 
            zIndex: 0,
          }}
        >
          <item.Icon />
        </div>
      ))}
    </div>
  );
};

const Track = ({ onBack }) => {

  // --- Mock Data ---
  const mockTopTasks = [
    { task: 'Meditate', consistency: 80 },
    { task: 'Workout', consistency: 95 },
    { task: 'Read', consistency: 60 },
    { task: 'Journal', consistency: 75 },
    { task: 'Code', consistency: 90 },
  ];

  const mockImportantTasks = [
    { name: 'Finish project proposal', status: 'Pending' },
    { name: 'Call doctor', status: 'Pending' },
    { name: 'Pay utility bill', status: 'Done' },
  ];
  
  const accentColors = [
    '#ffc0cb', // Pink
    '#ddebc8', // Sage
    '#ffc0cb', // Pink
    '#ddebc8', // Sage
    '#fff0f5', // Light
  ];

  const styles = {
    container: {
      height: '100vh',
      width: '100%',
      backgroundColor: '#fffcf7',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
      position: 'relative', // Context for absolute background
    },
    // --- Added Background Container Style ---
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0, 
        overflow: 'hidden',
    },
    topSection: {
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      marginBottom: '20px',
      zIndex: 1, // Sit above flowers
      position: 'relative',
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    backButton: {
      backgroundColor: '#ffc0cb',
      color: '#1a1a1a',
      border: '2px solid #1a1a1a',
      padding: '8px 16px',
      borderRadius: '16px', 
      fontSize: '0.9rem',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '2px 2px 0px #1a1a1a',
      transition: 'all 0.1s ease',
    },
    titleContainer: {
        marginTop: '10px',
    },
    title: {
      fontFamily: '"Pacifico", cursive', 
      fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
      color: '#1a1a1a',
      margin: 0, 
      lineHeight: 1.2,
    },
    titleBar: {
      height: '6px',
      width: '100px',
      backgroundColor: '#ffb6c1',
      borderRadius: '4px',
      border: '1px solid #1a1a1a',
      marginTop: '5px',
    },
    dropdown: {
      padding: '10px 20px',
      border: '2px solid #1a1a1a',
      borderRadius: '12px',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '700',
      color: '#1a1a1a',
      boxShadow: '4px 4px 0px #1a1a1a',
      outline: 'none',
      fontFamily: 'Inter, sans-serif',
    },
    
    // Scrollable Content Area
    scrollableContent: {
      flex: 1,
      overflowY: 'auto',
      paddingRight: '5px', 
      paddingBottom: '20px',
      zIndex: 1, // Sit above flowers
      position: 'relative',
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '25px',
      width: '100%',
    },
    
    // Card Styles
    card: {
      borderRadius: '20px',
      padding: '24px',
      border: '2px solid #1a1a1a',
      boxShadow: '6px 6px 0px #1a1a1a',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
    },
    cardTitle: {
      fontSize: '1.1rem',
      fontWeight: '800',
      color: '#1a1a1a',
      marginBottom: '20px',
      marginTop: 0,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '2px solid #f0f0f0',
      paddingBottom: '10px',
    },
    
    // Inner Chart Box
    chartPlaceholder: {
      flex: 1,
      width: '100%',
      backgroundColor: '#fffcf7',
      borderRadius: '12px',
      border: '2px solid #1a1a1a',
      padding: '20px',
      boxSizing: 'border-box',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    chartNote: {
      fontSize: '0.8rem',
      color: '#888',
      marginTop: '15px',
      textAlign: 'center',
      fontStyle: 'italic',
    },
    barChart: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      width: '100%',
      height: '150px',
    },
    barWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      flex: 1,
    },
    bar: {
      width: '20px',
      borderRadius: '4px 4px 0 0',
      border: '2px solid #1a1a1a',
      borderBottom: 'none', 
      transition: 'all 0.3s ease',
    },
    barLabel: {
      fontSize: '0.7rem',
      fontWeight: '600',
      color: '#1a1a1a',
      transform: 'rotate(-45deg)',
      marginTop: '10px',
      whiteSpace: 'nowrap',
    },
    lineChartSvg: {
      width: '100%',
      height: '100%',
      overflow: 'visible',
    },
    
    // Task List Styles
    taskList: {
      width: '100%',
      padding: 0,
      listStyle: 'none',
      margin: 0,
    },
    taskItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      marginBottom: '10px',
      backgroundColor: '#fffcf7',
      border: '2px solid #1a1a1a',
      borderRadius: '12px',
      boxShadow: '2px 2px 0px #1a1a1a',
    },
    taskName: {
      fontSize: '0.95rem',
      color: '#1a1a1a',
      fontWeight: '600',
    },
    taskStatus: {
      padding: '4px 10px',
      borderRadius: '8px',
      color: '#1a1a1a',
      fontSize: '0.75rem',
      fontWeight: '700',
      border: '1px solid #1a1a1a',
      textTransform: 'uppercase',
    },
  };

  // Fonts and Hover Effects
  React.useEffect(() => {
    const fontLinkId = 'google-fonts-track';
    let fontLink = document.getElementById(fontLinkId);
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = fontLinkId;
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Pacifico&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }

    const styleSheetId = 'track-styles-hover';
    let styleSheet = document.getElementById(styleSheetId);
    if (!styleSheet) {
      styleSheet = document.createElement('style');
      styleSheet.id = styleSheetId;
      styleSheet.innerHTML = `
        .track-back-button:active {
          transform: translate(2px, 2px);
          box-shadow: none !important;
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent; 
        }
        ::-webkit-scrollbar-thumb {
          background: #1a1a1a; 
          border-radius: 4px;
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* 1. Added Background Illustrations */}
      <BackgroundIllustrations styles={styles} />

      <div style={styles.topSection}>
        <div style={styles.headerRow}>
            <button
                style={styles.backButton}
                className="track-back-button"
                onClick={onBack}
            >
                ← Back
            </button>
            <select style={styles.dropdown} defaultValue="daily">
                <option value="daily">Daily View</option>
                <option value="weekly">Weekly View</option>
                <option value="monthly">Monthly View</option>
            </select>
        </div>
        
        <div style={styles.titleContainer}>
            <h1 style={styles.title}>Track</h1>
            <div style={styles.titleBar}></div>
        </div>
      </div>

      <div style={styles.scrollableContent}>
        <div style={styles.gridContainer}>

            {/* Card 1: Bar Chart */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>Consistency (Top 5)</h2>
                <div style={styles.chartPlaceholder}>
                    <div style={styles.barChart}>
                        {mockTopTasks.map((item, index) => (
                            <div key={item.task} style={styles.barWrapper}>
                                <div
                                    style={{
                                        ...styles.bar,
                                        height: `${item.consistency}%`,
                                        backgroundColor: accentColors[index % accentColors.length]
                                    }}
                                    title={`${item.task}: ${item.consistency}%`}
                                ></div>
                                <span style={styles.barLabel}>{item.task}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Card 2: Line Chart */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>Trends</h2>
                <div style={styles.chartPlaceholder}>
                    <svg style={styles.lineChartSvg} viewBox="0 0 100 50" preserveAspectRatio="none">
                        <polyline
                            fill="none"
                            stroke="#1a1a1a"
                            strokeWidth="1.5"
                            points="0,40 20,30 40,35 60,20 80,25 100,10"
                            strokeDasharray="4"
                        />
                        <circle cx="20" cy="30" r="2" fill="#ffc0cb" stroke="#1a1a1a" strokeWidth="1" />
                        <circle cx="40" cy="35" r="2" fill="#ddebc8" stroke="#1a1a1a" strokeWidth="1" />
                        <circle cx="60" cy="20" r="2" fill="#ffc0cb" stroke="#1a1a1a" strokeWidth="1" />
                        <circle cx="80" cy="25" r="2" fill="#ddebc8" stroke="#1a1a1a" strokeWidth="1" />
                    </svg>
                </div>
            </div>

            {/* Card 3: List */}
            <div style={{ ...styles.card, gridColumn: '1 / -1' }}>
                <h2 style={styles.cardTitle}>Priority Tasks</h2>
                <ul style={styles.taskList}>
                    {mockImportantTasks.map((task, index) => (
                        <li key={index} style={styles.taskItem}>
                            <span style={styles.taskName}>{task.name}</span>
                            <span style={{
                                ...styles.taskStatus,
                                backgroundColor: task.status === 'Pending' ? '#fff0f5' : '#ddebc8',
                                color: task.status === 'Pending' ? '#d87093' : '#386641',
                                borderColor: task.status === 'Pending' ? '#ffc0cb' : '#a7c957',
                            }}>
                                {task.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Track;