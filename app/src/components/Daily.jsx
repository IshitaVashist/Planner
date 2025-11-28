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

// --- TaskRow Component with Swipe Actions ---
const TaskRow = ({ rowId, onAddRow, onDeleteRow, isLast, styles }) => {
  const [startX, setStartX] = React.useState(null);
  const [deltaX, setDeltaX] = React.useState(0);
  const [isMoving, setIsMoving] = React.useState(false); 
  const [isDragging, setIsDragging] = React.useState(false); 

  const SWIPE_THRESHOLD = 100;

  // --- Handlers ---
  const handleDragStart = (clientX) => {
    setStartX(clientX);
    setIsMoving(true);
    setDeltaX(0);
  };

  const handleDragMove = (clientX) => {
    if (startX === null) return;
    const currentX = clientX;
    let newDeltaX = currentX - startX;
    setDeltaX(newDeltaX);
  };

  const handleDragEnd = () => {
    setIsMoving(false);
    setIsDragging(false);
    
    if (deltaX < -SWIPE_THRESHOLD) { // Swiped left -> Delete
      onDeleteRow(rowId);
    } else if (deltaX > SWIPE_THRESHOLD) { // Swiped right -> Add
      onAddRow();
    }

    setDeltaX(0);
    setStartX(null);
  };

  // --- Touch Events ---
  const handleTouchStart = (e) => {
    if (e.target.tagName === 'INPUT') return; 
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startX === null) return;
    handleDragMove(e.touches[0].clientX);
  };

  // --- Mouse Events ---
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.type === 'checkbox') return;
    e.preventDefault();
    setIsDragging(true);
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || startX === null) return;
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) handleDragEnd();
  };

  const foregroundStyle = {
    ...styles.rowForeground,
    transform: `translateX(${deltaX}px)`,
    transition: isMoving || isDragging ? 'none' : 'transform 0.3s ease',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  let actionBackground = null;
  if (deltaX > 0) {
    actionBackground = (
      <div style={{...styles.actionLayer, ...styles.actionAdd}}>
        <span style={styles.actionText}>+ Add Row</span>
      </div>
    );
  } else if (deltaX < 0) {
    actionBackground = (
      <div style={{...styles.actionLayer, ...styles.actionDelete}}>
        <span style={styles.actionText}>🗑 Delete</span>
      </div>
    );
  }

  return (
    <div 
      style={styles.rowContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleDragEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {actionBackground}
      <div style={foregroundStyle}>
        <div style={styles.cell}>
          <input type="text" style={styles.input} placeholder="Task..." />
        </div>
        <div style={styles.cell}>
          <input type="text" style={styles.input} placeholder="Category" />
        </div>
        <div style={styles.cell}>
          <input type="text" style={styles.input} placeholder="Time" />
        </div>
        <div style={{...styles.cell, justifyContent: 'center'}}>
          <input type="checkbox" style={styles.checkbox} />
        </div>
      </div>
    </div>
  );
};

const Daily = ({ onBack, eventsForToday }) => {
  // UPDATED: Default to 4 rows
  const [rows, setRows] = React.useState([
    { id: crypto.randomUUID() },
    { id: crypto.randomUUID() },
    { id: crypto.randomUUID() },
    { id: crypto.randomUUID() },
  ]);

  const handleAddRow = () => {
    setRows(prevRows => [
      ...prevRows,
      { id: crypto.randomUUID() }
    ]);
  };

  const handleDeleteRow = (rowId) => {
    if (rows.length <= 1) return; 
    setRows(prevRows => prevRows.filter(row => row.id !== rowId));
  };

  const today = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

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
    // --- Updated Sections for Z-Index ---
    topSection: {
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        zIndex: 1, // Sit above flowers
        position: 'relative',
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
      alignSelf: 'flex-start',
      marginBottom: '10px',
      boxShadow: '2px 2px 0px #1a1a1a',
      transition: 'all 0.1s ease',
    },
    headerContainer: {
      display: 'flex',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      alignItems: 'center', // Centered alignment
      width: '100%',
      marginBottom: '15px',
      gap: '20px',
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      // flex: 1 removed to allow middle section to center
      justifyContent: 'center', 
    },
    title: {
      fontFamily: '"Pacifico", cursive', 
      fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
      color: '#1a1a1a',
      margin: 0, 
      lineHeight: 1.1,
    },
    // Updated Date Styles for Middle Position
    middleDateWrapper: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aestheticDateTag: {
        fontSize: '1rem',
        fontWeight: '700',
        color: '#1a1a1a',
        backgroundColor: '#fff',
        padding: '10px 20px',
        borderRadius: '50px',
        border: '2px solid #1a1a1a',
        boxShadow: '4px 4px 0px #ffc0cb', // Pink shadow
        textTransform: 'uppercase',
        letterSpacing: '1px',
        whiteSpace: 'nowrap',
    },
    titleBar: {
      height: '6px',
      width: '100px',
      backgroundColor: '#ffb6c1',
      borderRadius: '4px',
      border: '1px solid #1a1a1a',
      marginTop: '6px',
    },
    eventsContainer: {
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '20px', 
      border: '2px solid #1a1a1a', 
      boxShadow: '4px 4px 0px #1a1a1a',
      width: '300px',
      height: '130px',
      overflowY: 'auto',
      boxSizing: 'border-box',
      flexShrink: 0,
    },
    eventsTitle: {
      fontSize: '1rem',
      fontWeight: '700',
      color: '#1a1a1a',
      margin: '0 0 8px 0',
      paddingBottom: '5px',
      borderBottom: '2px solid #eee', 
    },
    eventItem: {
      fontSize: '0.85rem',
      color: '#555',
      padding: '4px 0',
      borderBottom: '1px solid #fafafa',
    },
    noEventsText: {
      fontSize: '0.8rem',
      color: '#888',
      fontStyle: 'italic',
      textAlign: 'center',
      padding: '10px 0',
    },
    navBar: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      gap: '10px',
      backgroundColor: 'white',
      padding: '12px',
      marginBottom: '15px',
      borderRadius: '20px', 
      boxShadow: '4px 4px 0px #1a1a1a',
      width: '100%',
      border: '2px solid #1a1a1a',
      flexShrink: 0,
      boxSizing: 'border-box',
    },
    navButton: {
      padding: '6px 14px',
      border: '2px solid #1a1a1a',
      borderRadius: '12px', 
      backgroundColor: '#fff',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#1a1a1a',
      boxShadow: '2px 2px 0px #1a1a1a',
    },

    // --- TABLE STYLES ---
    tableWrapper: {
      flex: 1,
      width: '100%',
      border: '2px solid #1a1a1a',
      borderRadius: '20px',
      backgroundColor: 'white',
      boxShadow: '4px 4px 0px #1a1a1a',
      overflow: 'hidden', 
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1, // Sit above flowers
      position: 'relative',
    },
    tableHeader: {
      display: 'grid',
      gridTemplateColumns: '3fr 2fr 2fr 1fr', 
      backgroundColor: '#ddebc8', 
      borderBottom: '2px solid #1a1a1a',
      padding: '15px',
      gap: '10px',
    },
    th: {
      fontSize: '0.9rem',
      fontWeight: '800',
      color: '#1a1a1a',
      textTransform: 'uppercase',
      textAlign: 'left',
    },
    thCenter: {
      fontSize: '0.9rem',
      fontWeight: '800',
      color: '#1a1a1a',
      textTransform: 'uppercase',
      textAlign: 'center',
    },
    scrollableBody: {
      flex: 1,
      overflowY: 'auto',
      padding: '0',
    },
    
    // --- Row Styles ---
    rowContainer: {
      position: 'relative',
      width: '100%',
      height: '60px', 
      borderBottom: '1px solid #eee',
      overflow: 'hidden',
      backgroundColor: '#1a1a1a', 
    },
    rowForeground: {
      display: 'grid',
      gridTemplateColumns: '3fr 2fr 2fr 1fr',
      gap: '10px',
      padding: '0 15px',
      height: '100%',
      alignItems: 'center',
      backgroundColor: 'white',
      position: 'relative',
      zIndex: 2,
    },
    cell: {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    },
    input: {
      width: '100%',
      padding: '8px 10px',
      border: '1px solid #ddd',
      borderRadius: '8px', 
      fontSize: '0.95rem',
      color: '#333',
      backgroundColor: '#fafafa',
      outline: 'none',
    },
    checkbox: {
      width: '20px',
      height: '20px',
      cursor: 'pointer',
      accentColor: '#ffb6c1', 
    },

    // --- Action Layers ---
    actionLayer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: '0 30px',
      boxSizing: 'border-box',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      color: '#1a1a1a',
      zIndex: 1,
    },
    actionAdd: {
      backgroundColor: '#ddebc8', 
      justifyContent: 'flex-start', 
    },
    actionDelete: {
      backgroundColor: '#ffc0cb', 
      justifyContent: 'flex-end', 
    },
    actionText: {
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
  };

  React.useEffect(() => {
    const fontLinkId = 'google-fonts-daily';
    let fontLink = document.getElementById(fontLinkId);
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = fontLinkId;
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Pacifico&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }

    const styleSheetId = 'daily-styles-hover';
    let styleSheet = document.getElementById(styleSheetId);
    if (!styleSheet) {
      styleSheet = document.createElement('style');
      styleSheet.id = styleSheetId;
      styleSheet.innerHTML = `
        .daily-back-button:active, .navButton:active {
          transform: translate(2px, 2px);
          box-shadow: none !important;
        }
        input:focus {
          border: 2px solid #ffb6c1 !important; 
          background-color: #fff !important;
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* 1. Added Background Illustrations */}
      <BackgroundIllustrations styles={styles} />

      {/* 2. Top Section (Title, Back, Header) */}
      <div style={styles.topSection}>
        <button
            style={styles.backButton}
            className="daily-back-button"
            onClick={onBack}
        >
            ← Back
        </button>

        <div style={styles.headerContainer}>
            <div style={styles.titleContainer}>
                <h1 style={styles.title}>Daily</h1>
                <div style={styles.titleBar}></div>
            </div>

            {/* NEW: CENTERED AESTHETIC DATE */}
            <div style={styles.middleDateWrapper}>
                 <span style={styles.aestheticDateTag}>{formattedDate}</span>
            </div>

            <div style={styles.eventsContainer}>
                <h4 style={styles.eventsTitle}>Today's Events</h4>
                {eventsForToday && eventsForToday.length > 0 ? (
                    <div>
                    {eventsForToday.map((event, index) => (
                        <div key={index} style={styles.eventItem}>
                        {event.content}
                        </div>
                    ))}
                    </div>
                ) : (
                    <p style={styles.noEventsText}>No events scheduled for today.</p>
                )}
            </div>
        </div>

        <div style={styles.navBar}>
            {['Text Font', 'Tape Symbol', 'Images', 'Shadow', 'Text Box'].map(item => (
                <div key={item} style={styles.navButton}>{item}</div>
            ))}
        </div>
      </div>

      {/* 3. Main Content (Table) */}
      <div style={styles.tableWrapper}>
        <div style={styles.tableHeader}>
            <div style={styles.th}>Task</div>
            <div style={styles.th}>Category</div>
            <div style={styles.th}>Time</div>
            <div style={styles.thCenter}>Done</div>
        </div>
        
        <div style={styles.scrollableBody}>
            {rows.map((row, index) => (
              <TaskRow
                key={row.id}
                rowId={row.id}
                onAddRow={handleAddRow}
                onDeleteRow={handleDeleteRow}
                isLast={index === rows.length - 1}
                styles={styles}
              />
            ))}
            {rows.length === 0 && (
                <div style={{padding: '20px', textAlign: 'center', color: '#888'}}>
                    Swipe right on the header or empty space to add a row? 
                    <br/>(Or refresh to reset)
                    <button 
                        onClick={handleAddRow} 
                        style={{...styles.navButton, marginTop: '10px', display: 'block', margin: '10px auto'}}
                    >
                        Add First Row
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Daily;