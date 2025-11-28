import React, { useState, useEffect, useMemo } from 'react';

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
const BackgroundIllustrations = () => {
  // We use useMemo to generate positions once so they don't dance around on every re-render
  const illustrations = useMemo(() => {
    const items = [];
    const icons = [IconFlower1, IconFlower2, IconFlower3];
    
    // Grid settings for "filled all over" look
    const rows = 8;    // Number of vertical sections
    const cols = 12;   // Number of horizontal sections
    
    const rowStep = 100 / rows;
    const colStep = 100 / cols;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Calculate base position
        const basePathY = r * rowStep;
        const basePathX = c * colStep;

        // Add randomness (Jitter) so it doesn't look like a perfect grid
        // Random offset between -5% and +10%
        const top = basePathY + (Math.random() * 10 - 2); 
        const left = basePathX + (Math.random() * 10 - 2);
        
        // Random properties
        const Icon = icons[Math.floor(Math.random() * icons.length)];
        const size = 30 + Math.random() * 40; // Size between 30px and 70px
        const rotation = Math.random() * 360;
        const opacity = 0.15 + Math.random() * 0.25; // Keep opacity low (0.15 - 0.4) so text is readable

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
            pointerEvents: 'none', // Crucial: lets clicks pass through to the app
            zIndex: 0,
          }}
        >
          <item.Icon />
        </div>
      ))}
    </div>
  );
};

// --- HELPER FUNCTION ---
const getDragData = (e) => {
  try {
    const data = e.dataTransfer.getData("application/json");
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

const ScreenCalendar = ({ days, setDays, onClose, currentDate }) => {
  // --- STATE ---
  const [selectedDay, setSelectedDay] = useState(null); 
  const [eventText, setEventText] = useState("");
  const [hoveredDay, setHoveredDay] = useState(null); 
  const [floatingStickers, setFloatingStickers] = useState([]);
  
  const daysOfWeek = ['SUN', 'MON', 'TUES', 'WEDS', 'THURS', 'FRI', 'SAT'];
  const MAX_EVENTS_VISIBLE_IN_CELL = 3;

  // --- FORMAT YEAR SHORT (25') ---
  const getShortYearTitle = () => {
    if (!currentDate) return "Planner";
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const shortYear = currentDate.getFullYear().toString().slice(-2);
    return `${month} ${shortYear}'`;
  };

  const titleText = getShortYearTitle();

  // --- ACTIVE DATE DEFAULT ---
  useEffect(() => {
    if (!selectedDay && days.length > 0 && currentDate) {
      const targetDay = currentDate.getDate();
      const foundDay = days.find(d => d && d.day === targetDay);
      if (foundDay) {
        setSelectedDay(foundDay);
      } else {
        const firstDay = days.find(d => d !== null);
        if (firstDay) setSelectedDay(firstDay);
      }
    }
  }, [days, currentDate]);

  // --- HANDLERS ---
  const handleDayClick = (dayObject) => {
    if (dayObject) setSelectedDay(dayObject); 
  };

  const handleAddEvent = () => {
    if (!selectedDay || !eventText.trim()) {
       if (!selectedDay) alert("Please select a day from the calendar first!");
       if (!eventText.trim()) alert("Please enter some event text!");
       return; 
    }
    const newEvent = { type: "text", content: eventText.trim() };
    const updatedCalendarData = days.map(data => {
      if (data && data.day === selectedDay.day) {
        return { ...data, events: [...data.events, newEvent] };
      }
      return data; 
    });
    setDays(updatedCalendarData); 
    setSelectedDay(prev => ({ ...prev, events: [...prev.events, newEvent] }));
    setEventText("");
  };
  
  const handleRemoveEvent = (eventIndexToRemove) => {
      const updatedEvents = selectedDay.events.filter(
        (_, index) => index !== eventIndexToRemove
      );
      const updatedCalendarData = days.map(data => {
        if (data && data.day === selectedDay.day) {
          return { ...data, events: updatedEvents };
        }
        return data;
      });
      setDays(updatedCalendarData);
      setSelectedDay(prev => ({ ...prev, events: updatedEvents }));
  };

  const handleRemoveFloatingSticker = (id) => {
    setFloatingStickers(prev => prev.filter(s => s.id !== id));
  };

  // --- DRAG & DROP HANDLERS ---
  const handleDragStart = (e, data) => {
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    if (data.type === 'new_sticker') {
      e.dataTransfer.setData("drag-type", "new");
    } else if (data.type === 'existing_sticker') {
      e.dataTransfer.setData("drag-type", "existing-floating");
    } else if (data.type === 'cell_item') {
      e.dataTransfer.setData("drag-type", "existing-cell");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnDate = (e, dayObject) => {
    e.preventDefault();
    e.stopPropagation(); 
    setHoveredDay(null); 
    
    if (e.dataTransfer.getData("drag-type") !== "new" || !dayObject) return;

    const data = getDragData(e);
    if (!data) return;

    let newEvent;
    if (data.content === "tape") {
      const totalDays = days.filter(d => d !== null).length;
      newEvent = { type: "sticker", content: `📏 ${totalDays} days` };
    } else {
      newEvent = { type: "sticker", content: data.content };
    }

    const updatedCalendarData = days.map(dayData => {
      if (dayData && dayData.day === dayObject.day) {
        return { ...dayData, events: [...dayData.events, newEvent] };
      }
      return dayData;
    });
    setDays(updatedCalendarData);
    
    if (selectedDay && selectedDay.day === dayObject.day) {
      setSelectedDay(prev => ({ ...prev, events: [...prev.events, newEvent] }));
    }
  };
  
  const handleDropOnMain = (e) => {
    e.preventDefault();
    const data = getDragData(e);
    if (!data) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + e.currentTarget.scrollLeft;
    const y = e.clientY - rect.top + e.currentTarget.scrollTop;

    if (data.type === 'new_sticker') {
      let content = data.content;
      if (data.content === "tape") {
        content = `📏 `;
      }
      setFloatingStickers(prev => [
        ...prev,
        { id: Date.now(), content: content, x, y }
      ]);
    }
    
    if (data.type === 'existing_sticker') {
      setFloatingStickers(prev => 
        prev.map(s => (s.id === data.id ? { ...s, x, y } : s))
      );
    }
  };
  
  const handleMouseEnter = (e, data) => {
    if (data.events.length > MAX_EVENTS_VISIBLE_IN_CELL) {
      setHoveredDay({ 
        day: data, 
        rect: e.currentTarget.getBoundingClientRect() 
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  // --- RENDER ---
  return (
    <div style={styles.container}>
      {/* Background Illustrations Layer */}
      <BackgroundIllustrations />

      {/* Header Section */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onClose}>
          ← Back
        </button>
        <h2 style={styles.title}>{titleText}</h2>
        <div style={{ width: '100px' }}></div> 
      </div>

      <div 
        style={styles.mainContent}
        onDragOver={handleDragOver}
        onDrop={handleDropOnMain}
      >
        
        {/* LEFT COLUMN: Controls & Event List */}
        <div style={styles.leftPanel}>
          
          {/* Feature Bar */}
          <div style={styles.featureBar}>
            <div style={styles.featureSection}>
              <h4 style={styles.featureTitle}>
                Add to: {selectedDay ? <span style={styles.selectedDateText}>{selectedDay.day}</span> : 'Select Day'}
              </h4>
              <div style={styles.addEventForm}>
                <input 
                  type="text" 
                  value={eventText}
                  onChange={(e) => setEventText(e.target.value)}
                  style={styles.input}
                  placeholder="Type event..."
                />
                <button onClick={handleAddEvent} style={styles.addButton}>
                  +
                </button>
              </div>
            </div>
            
            <div style={styles.featureSection}>
               <h4 style={styles.featureTitle}>Stickers</h4>
               <div style={styles.stickerBox}>
                  {['⭐','❤️','🎉','📌','📏'].map((emoji) => (
                    <button 
                      key={emoji}
                      draggable="true" 
                      onDragStart={(e) => handleDragStart(e, {type: 'new_sticker', content: emoji === '📏' ? 'tape' : emoji})} 
                      style={styles.stickerButton}
                    >
                      {emoji}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Event List */}
          <div style={styles.eventListPane}>
            <h3 style={styles.editTitle}>
               {selectedDay ? `Day ${selectedDay.day} Details` : 'Event Details'}
            </h3>
            <div style={styles.eventList}>
              {selectedDay ? (
                selectedDay.events.length === 0 ? (
                  <p style={styles.noEventsText}>No events scheduled.</p>
                ) : (
                  selectedDay.events.map((event, index) => (
                    <div key={index} style={styles.eventItem}>
                      <span style={styles.eventItemText}>
                        {event.type === 'sticker' ? '🎨 ' : '📝 '}
                        {event.content}
                      </span>
                      <button 
                        onClick={() => handleRemoveEvent(index)} 
                        style={styles.removeButton}
                      >
                        &times;
                      </button>
                    </div>
                  ))
                )
              ) : (
                <div style={styles.placeholderText}>
                  Select a day on the calendar to view details.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Calendar Grid */}
        <div style={styles.calendarWrapper}>
          <div style={styles.calendar}>
            
            {/* --- WEEK HEADER --- */}
            <div style={styles.weekHeader}>
              {daysOfWeek.map((day) => (
                <div key={day} style={styles.dayHeader}>{day}</div>
              ))}
            </div>
            
            <div style={styles.calendarGrid}>
              {days.map((data, index) => {
                if (!data) {
                  return <div key={`empty-${index}`} style={styles.emptyCell} onDragOver={handleDragOver}></div>;
                }
                const isSelected = selectedDay && selectedDay.day === data.day;
                
                return (
                  <button 
                    key={data.day} 
                    style={{ ...styles.dayCell, ...(isSelected ? styles.selectedDayCell : {}) }}
                    onClick={() => handleDayClick(data)}
                    onMouseEnter={(e) => handleMouseEnter(e, data)}
                    onMouseLeave={handleMouseLeave}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnDate(e, data)}
                  >
                    <span style={styles.dayNumber}>{data.day}</span>
                    <div style={styles.eventContainer}>
                      {data.events.slice(0, MAX_EVENTS_VISIBLE_IN_CELL).map((event, i) => (
                        <div 
                          key={i} 
                          draggable="true"
                          onDragStart={(e) => {
                            e.stopPropagation(); 
                            handleDragStart(e, {
                              type: 'cell_item', 
                              content: event.content,
                              day: data.day, 
                              index: i
                            });
                          }}
                          style={{
                            ...styles.eventInCell, 
                            ...(event.type === 'sticker' ? styles.stickerEvent : styles.textEvent)
                          }}
                        >
                          {event.content}
                        </div>
                      ))}
                      {data.events.length > MAX_EVENTS_VISIBLE_IN_CELL && (
                        <div style={styles.moreEventsText}>...</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Render Floating Stickers */}
        {floatingStickers.map(sticker => (
          <div
            key={sticker.id}
            style={{
              ...styles.floatingStickerContainer,
              left: `${sticker.x}px`,
              top: `${sticker.y}px`,
            }}
          >
              <div 
               draggable="true"
               onDragStart={(e) => handleDragStart(e, {type: 'existing_sticker', id: sticker.id})}
               style={styles.floatingStickerContent}
              >
                {sticker.content}
              </div>
              <button 
                 style={styles.floatingDeleteBtn}
                 onClick={() => handleRemoveFloatingSticker(sticker.id)}
              >
                ×
              </button>
          </div>
        ))}
      </div>

      {/* Overflow Extension Box */}
      {hoveredDay && (
        <div style={{
          ...styles.extensionBox,
          top: hoveredDay.rect.bottom + 2, 
          left: hoveredDay.rect.left,      
          width: hoveredDay.rect.width,    
        }}>
          {hoveredDay.day.events.map((event, i) => (
            <div 
              key={i} 
              style={{
                ...styles.extensionEvent,
                ...(event.type === 'sticker' ? styles.stickerEvent : styles.textEvent)
              }}
            >
              {event.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: {
    height: '100vh',
    width: '100%',
    backgroundColor: '#fffcf7', // Creamy background
    padding: '20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, sans-serif',
    overflow: 'hidden',
    position: 'relative', // Context for absolute background
  },
  // Added Background Container Style
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0, // Behind content
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexShrink: 0,
    position: 'relative', // Ensure it sits above bg
    zIndex: 1, 
  },
  backButton: {
    backgroundColor: '#ffc0cb', // Light Pink
    color: '#1a1a1a',
    border: '2px solid #1a1a1a', // Rounded Black Border
    padding: '10px 24px',
    borderRadius: '24px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '2px 2px 0px #1a1a1a', // Offset Black Shadow
    transition: 'all 0.1s',
  },
  title: {
    fontFamily: '"Pacifico", cursive',
    fontSize: '2.5rem',
    color: '#1a1a1a',
    margin: 0,
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'row',
    gap: '25px',
    flex: 1,
    height: '100%',
    overflow: 'hidden',
    position: 'relative', // Ensure it sits above bg
    zIndex: 1,
  },
  
  // --- Left Panel Styles ---
  leftPanel: {
    width: '340px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    flexShrink: 0,
    overflowY: 'auto',
    paddingRight: '5px',
    paddingBottom: '10px',
  },
  featureBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backgroundColor: 'white',
    borderRadius: '24px',
    border: '2px solid #1a1a1a', // Bold Border
    padding: '20px',
    boxShadow: '6px 6px 0px #1a1a1a', // Bold Shadow
  },
  featureSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  featureTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: 0,
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedDateText: {
    color: '#d87093',
    backgroundColor: '#fff0f5',
    padding: '2px 8px',
    borderRadius: '12px',
    border: '1px solid #1a1a1a',
    fontSize: '0.9rem',
  },
  addEventForm: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '12px',
    border: '2px solid #1a1a1a',
    fontSize: '0.9rem',
    backgroundColor: '#fff',
    outline: 'none',
    color: '#1a1a1a',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#ddebc8', // Sage Green
    color: '#1a1a1a',
    border: '2px solid #1a1a1a',
    padding: '0 16px',
    borderRadius: '12px',
    fontSize: '1.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    lineHeight: 1,
    boxShadow: '2px 2px 0px #1a1a1a',
  },
  stickerBox: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  stickerButton: {
    backgroundColor: '#fff',
    border: '2px solid #1a1a1a',
    borderRadius: '12px',
    width: '42px',
    height: '42px',
    fontSize: '1.4rem',
    cursor: 'grab', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    boxShadow: '2px 2px 0px #1a1a1a',
    transition: 'transform 0.1s',
  },
  eventListPane: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '24px',
    border: '2px solid #1a1a1a',
    padding: '20px',
    boxShadow: '6px 6px 0px #1a1a1a',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '200px',
  },
  editTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a1a1a',
    borderBottom: '2px solid #1a1a1a',
    backgroundColor: '#ddebc8', // Sage Green Highlight
    margin: '-20px -20px 15px -20px',
    padding: '15px 20px',
    borderRadius: '22px 22px 0 0',
  },
  eventList: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '5px',
  },
  eventItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    marginBottom: '8px',
    border: '1px solid #1a1a1a',
    borderRadius: '12px',
    backgroundColor: '#fffcf7',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  eventItemText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginRight: '10px',
  },
  removeButton: {
    backgroundColor: '#ffc0cb',
    border: '1px solid #1a1a1a',
    color: '#1a1a1a',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '8px',
    lineHeight: 1,
  },
  placeholderText: {
    color: '#888',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: '40px',
  },
  
  // --- Right Panel Styles (Calendar) ---
  calendarWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    paddingBottom: '10px', // Space for shadow
  },
  calendar: {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '20px',
    boxShadow: '6px 6px 0px #1a1a1a',
    border: '2px solid #1a1a1a',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  weekHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '10px',
    marginBottom: '15px',
    backgroundColor: '#ddebc8', // Green BG
    padding: '12px',
    borderRadius: '12px',
    border: '2px solid #1a1a1a',
  },
  dayHeader: {
    textAlign: 'center',
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: '0.5px',
    backgroundColor: '#f5f0e8', // Beige
    border: '2px solid #1a1a1a', 
    borderRadius: '24px', // Rounded pill/circle
    padding: '8px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridTemplateRows: 'repeat(auto-fit, minmax(0, 1fr))',
    gap: '12px',
    flex: 1,
    },
  emptyCell: {
    backgroundColor: 'transparent',
  },
  dayCell: {
    backgroundColor: '#f5f0e8',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'stretch',
    padding: '8px',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#1a1a1a',
    border: '2px solid #1a1a1a', // Cell Borders
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    textAlign: 'left',
    overflow: 'hidden', 
    minHeight: '0',
    boxShadow: '2px 2px 0px rgba(0,0,0,0.05)', // Subtle inner shadow feeling
  },
  selectedDayCell: {
    backgroundColor: '#f3ced4ff', // Pink
    transform: 'translate(-2px, -2px)',
    boxShadow: 'inset 0 0 0 2px #1a1a1a, 4px 4px 0px #1a1a1a', // Combined Shadows
    zIndex: 2,
  },
  dayNumber: {
    fontSize: '1rem',
    marginBottom: '6px',
  },
  eventContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflow: 'hidden',
    flex: 1,
  },
  eventInCell: {
    fontSize: '0.75rem',
    padding: '3px 6px',
    borderRadius: '6px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'grab',
    border: '1px solid #1a1a1a', 
  },
  textEvent: {
    backgroundColor: '#ddebc8', // Sage Green event
    color: '#1a1a1a',
    fontWeight: '600',
  },
  stickerEvent: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: 0,
    fontSize: '1.2rem',
    textAlign: 'center',
  },
  moreEventsText: {
    fontSize: '0.8rem',
    color: '#1a1a1a',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 'auto',
  },

  // --- Extras ---
  extensionBox: {
    position: 'fixed',
    backgroundColor: 'white',
    border: '2px solid #1a1a1a',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '4px 4px 0px #1a1a1a',
    zIndex: 1000,
    maxHeight: '200px',
    overflowY: 'auto',
  },
  extensionEvent: {
    padding: '6px 10px',
    borderRadius: '8px',
    marginBottom: '6px',
    fontSize: '0.9rem',
    border: '1px solid #1a1a1a',
    backgroundColor: '#ddebc8',
  },
  floatingStickerContainer: {
    position: 'absolute',
    zIndex: 990,
    display: 'flex',
    alignItems: 'flex-start',
  },
  floatingStickerContent: {
    fontSize: '2.5rem',
    cursor: 'grab',
    userSelect: 'none',
    filter: 'drop-shadow(2px 2px 0px #1a1a1a)',
  },
  floatingDeleteBtn: {
    marginLeft: '-8px', // Overlap slightly
    marginTop: '-4px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: '1px solid #1a1a1a',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 991,
    padding: 0,
    lineHeight: 1,
  },
};

if (typeof document !== 'undefined') {
  const styleSheetId = 'screencalendar-styles-pop';
  let styleSheet = document.getElementById(styleSheetId);
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = styleSheetId;
    styleSheet.textContent = `
      button:active {
        transform: translate(2px, 2px);
        box-shadow: none !important;
      }
      /* Scrollbar Styling */
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
      ::-webkit-scrollbar-thumb:hover {
        background: #555; 
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

export default ScreenCalendar;