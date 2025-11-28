import React from "react";
import { supabase } from '../supabase'; 

// Fixed paths to be local
import Daily from './Daily';
import Weekly from "./Weekly";
import Monthly from "./Monthly";
import Track from "./Track";
import ScreenCalendar from "./ScreenCalendar"; 
import Bar from "./Bar"; 

// --- HELPER: Generate Calendar for ANY given Date ---
const generateCalendarForDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth(); 
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate(); 

  const calendarData = [];
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarData.push(null); 
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    calendarData.push({ day: i, events: [] }); 
  }
  
  return calendarData;
};

const MAX_EVENTS_IN_MAIN_CELL = 1;

// --- HELPER: GET SURROUNDING MONTHS (Relative to currently viewed date) ---
const getSurroundingMonths = (baseDate) => {
  const months = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1);
    months.push({
      name: d.toLocaleString('default', { month: 'long' }),
      year: d.getFullYear(),
      isCurrent: i === 0,
      dateObject: d 
    });
  }
  return months;
};

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

// --- STYLES ---
const mainPageStyles = {
  loadingScreen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1a1a1a',
    height: '100vh', 
  },
  
  container: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#fffcf7', 
    boxSizing: 'border-box',
    position: 'relative', 
    overflow: 'hidden',   
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

  sectionContainer: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#f5f0e8',
    padding: '40px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  backButton: {
    backgroundColor: '#b8b89a',
    color: '#1a1a1a',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '250px',
    maxHeight: '40vh',
    backgroundColor: '#FBCFE8', 
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
    zIndex: 999,
    overflowY: 'auto',
    animation: 'slideDown 0.3s ease-out',
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '2px solid rgba(0, 0, 0, 0.1)', 
  },
  sidebarTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: 0,
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1a1a1a',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  sidebarContent: {
    padding: '20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
  },
  menuItem: {
    padding: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1a1a1a',
    border: '2px solid #000000', 
    transition: 'all 0.2s',
    textAlign: 'center',
  },
  content: {
    minHeight: '100vh', 
    width: '100%',
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center',
    justifyContent: 'flex-start', 
    padding: '0',
    paddingTop: '20px', 
    boxSizing: 'border-box',
    overflowY: 'auto', 
    paddingBottom: '40px',
    position: 'relative', 
    zIndex: 1,            
  },
  mainContentArea: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center', 
    justifyItems: 'center', 
  },
  headerControlContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '900px', 
    padding: '0 20px',
    boxSizing: 'border-box',
    marginBottom: '5px',
    marginTop: '60px', 
  },
  plannerHeader: {
    fontFamily: "'Pinyon Script', cursive", 
    fontSize: 'clamp(3rem, 5vw, 4.5rem)', 
    fontWeight: '400',
    color: '#1a1a1a',
    textAlign: 'left',
    margin: '0',
    textShadow: '1px 1px 0px rgba(255,255,255,0.5)',
    lineHeight: '1.1',
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  toggleLabel: {
    marginRight: '10px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  toggleSwitch: {
    position: 'relative',
    display: 'inline-block',
    width: '44px',
    height: '24px',
  },
  toggleInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  toggleSlider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc', 
    borderRadius: '24px',
    transition: '.4s',
  },
  calendarContainer: {
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center',    
    justifyContent: 'center',
    width: '100%',
    padding: '0 20px',
    boxSizing: 'border-box',
    marginBottom: '20px', 
  },
  
  calendarWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start', 
    justifyContent: 'center',
    width: '100%',
    maxWidth: '950px', 
    position: 'relative', 
  },
  sideTag: {
    writingMode: 'vertical-rl', 
    backgroundColor: '#FBCFE8',
    color: '#1a1a1a',
    padding: 'clamp(10px, 2vw, 16px) clamp(4px, 1vw, 8px)',
    borderTopRightRadius: '16px',
    borderBottomRightRadius: '16px',
    border: '2px solid #000000',
    borderLeft: 'none', 
    fontFamily: "'Pinyon Script', cursive",
    fontSize: 'clamp(1.2rem, 3vw, 2rem)',
    fontWeight: '400',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '-2px', 
    marginTop: '40px', 
    zIndex: 3, 
    boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer', 
    transition: 'transform 0.2s, background-color 0.2s',
  },
  monthPopup: {
    position: 'absolute',
    top: '40px',
    right: '0px', 
    marginRight: '60px', 
    backgroundColor: '#fffcf7',
    border: '2px solid #000',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 100,
    minWidth: '160px',
    animation: 'slideDown 0.2s ease-out',
  },
  monthPopupItem: {
    padding: '8px 12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1a1a1a',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
  },
  currentMonthItem: {
    backgroundColor: '#FBCFE8',
    borderRadius: '6px',
    borderBottom: 'none',
  },
  calendar: {
    backgroundColor: 'black', 
    borderRadius: '24px',
    padding: 'clamp(16px, 2vw, 24px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '900px',
    cursor: 'pointer', 
    transition: 'transform 0.2s ease, box-shadow 0.2s ease', 
    zIndex: 2, 
    position: 'relative',
  },
  weekHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 'clamp(4px, 1vw, 8px)',
    marginBottom: 'clamp(8px, 1.5vw, 16px)',
    backgroundColor: '#FBCFE8', 
    padding: 'clamp(8px, 1.5vw, 12px)',
    borderRadius: '12px',
  },
  dayHeader: {
    textAlign: 'center',
    fontSize: 'clamp(0.6rem, 1.2vw, 0.85rem)',
    fontWeight: '600',
    color: '#1a1a1a',
    backgroundColor: 'white', 
    border: '1px solid #1a1a1a', 
    borderRadius: '50px', 
    padding: '4px 0', 
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 'clamp(4px, 1vw, 8px)',
    backgroundColor: 'white',
    padding: 'clamp(8px, 1.5vw, 12px)',
    borderRadius: '12px',
  },
  emptyCell: {
    height: 'clamp(40px, 7vw, 60px)', 
  },
  dayCell: {
    height: 'clamp(40px, 7vw, 60px)', 
    backgroundColor: '#f5f0e8',
    borderRadius: 'clamp(8px, 1.5vw, 12px)',
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 'clamp(2px, 1vw, 6px)',
    fontSize: 'clamp(0.7rem, 1.3vw, 0.95rem)',
    fontWeight: '600',
    color: '#1a1a1a',
    border: '2px solid #000000', 
    position: 'relative', 
    overflow: 'hidden', 
  },
  todayCell: {
    backgroundColor: '#fff0f7', 
    borderColor: '#f472b6',      
  },
  dayHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
  },
  todayLabel: {
    fontSize: '0.6rem',
    backgroundColor: '#f472b6',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '12px',
    marginLeft: '6px',
    fontWeight: 'bold',
    display: 'inline-block',
    lineHeight: '1',
  },
  dayNumber: {
    lineHeight: '1',
  },
  barsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr', 
    gap: '12px',
    width: '100%',
    maxWidth: '900px', 
    margin: '0 auto',
    padding: '0 20px', 
    boxSizing: 'border-box',
    paddingBottom: '20px', 
  },
  bar: {
    width: '100%',
    height: 'clamp(45px, 7vh, 60px)', 
    backgroundColor: '#FBCFE8', 
    borderRadius: '16px', 
    border: '2px solid #000000', 
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  barText: {
    fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  eventContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px', 
    overflow: 'hidden',
    marginTop: '2px', 
    width: '100%',
  },
  eventInCell: {
    color: '#333',
    fontSize: 'clamp(0.6rem, 1vw, 0.8rem)',
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
  },
  moreEventsText: {
    fontSize: '0.8rem',
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: '0px',
    lineHeight: 1, 
  },
  reservedLabel: {
    backgroundColor: '#e0e0e0',
    color: '#555',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    padding: '2px 4px',
    borderRadius: '3px',
    textAlign: 'center',
    marginTop: '5px',
  },
};

const BackgroundIllustrations = () => {
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
    <div style={mainPageStyles.backgroundContainer}>
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

const MainPage = ({ username }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [currentView, setCurrentView] = React.useState('main');
  const [showScreenCalendar, setShowScreenCalendar] = React.useState(false);
  const [calendarData, setCalendarData] = React.useState([]); 
  const [isLoading, setIsLoading] = React.useState(true); 
  const [showTasks, setShowTasks] = React.useState(true);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = React.useState(false);

  // --- NEW STATE: DISPLAY DATE (Defaults to Today) ---
  const [displayDate, setDisplayDate] = React.useState(new Date());

  const daysOfWeek = ['SUN', 'MON', 'TUES', 'WEDS', 'THURS', 'FRI', 'SAT'];

  React.useEffect(() => {
    const viewingMonthId = `${displayDate.getFullYear()}-${displayDate.getMonth()}`;

    const getData = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('calendars')
        .select('days')
        .eq('id', viewingMonthId)
        .single(); 

      if (data) {
        setCalendarData(data.days);
      } else {
        console.log(`No data for ${viewingMonthId}. Creating calendar.`);
        const initialData = generateCalendarForDate(displayDate);
        
        await supabase
          .from('calendars')
          .insert({ id: viewingMonthId, days: initialData });
          
        setCalendarData(initialData);
      }
      setIsLoading(false);
    };

    getData();

    const subscription = supabase.channel(`calendar-updates-${viewingMonthId}`)
      .on(
        'postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'calendars', 
          filter: `id=eq.${viewingMonthId}` 
        },
        (payload) => {
          console.log('Real-time update received!', payload);
          setCalendarData(payload.new.days);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
    
  }, [displayDate]); 

  const updateCalendarInSupabase = async (newCalendarData) => {
    setCalendarData(newCalendarData); 
    const viewingMonthId = `${displayDate.getFullYear()}-${displayDate.getMonth()}`;
    
    const { error } = await supabase
      .from('calendars')
      .upsert({ id: viewingMonthId, days: newCalendarData });
      
    if (error) {
      console.error("Error updating Supabase: ", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMonthPicker = () => {
    setIsMonthPickerOpen(!isMonthPickerOpen);
  };

  const handleMonthSelect = (targetDateObject) => {
    setDisplayDate(targetDateObject);
    setIsMonthPickerOpen(false);
  };

  const handleBarClick = (section) => {
    setCurrentView(section);
  };

  const handleBackToMain = () => {
    setCurrentView('main');
  };
  
  const handleOpenCalendar = () => {
    setShowScreenCalendar(true);
  };
  
  const handleCloseCalendar = () => {
    setShowScreenCalendar(false);
  };

  if (currentView === 'daily') {
    const todayDate = new Date().getDate();
    const todaysData = calendarData.find(d => d && d.day === todayDate);
    const eventsForToday = todaysData ? todaysData.events : [];
    return <Daily onBack={handleBackToMain} eventsForToday={eventsForToday} />;
  }

  if (currentView === 'Weekly') {
    return <Weekly onBack={handleBackToMain} />;
  }
  if (currentView === 'Monthly') {
    return <Monthly onBack={handleBackToMain} />;
  }
  if (currentView === 'Track') {
    return <Track onBack={handleBackToMain} />;
  }

  if (showScreenCalendar) {
    return (
      <ScreenCalendar 
        days={calendarData} 
        setDays={updateCalendarInSupabase} 
        onClose={handleCloseCalendar} 
        currentDate={displayDate}
      />
    );
  }
  
  if (isLoading) {
    return (
      <div style={{...mainPageStyles.container, ...mainPageStyles.loadingScreen}}>
        <BackgroundIllustrations />
        Loading Calendar...
      </div>
    );
  }

  const surroundingMonths = getSurroundingMonths(displayDate);
  const currentMonthName = displayDate.toLocaleString('default', { month: 'long' });

  const realToday = new Date();
  const isViewingCurrentRealMonth = 
    displayDate.getMonth() === realToday.getMonth() && 
    displayDate.getFullYear() === realToday.getFullYear();

  return (
    <div style={mainPageStyles.container}>
      <BackgroundIllustrations />

      {/* Sidebar - ITEMS REDUCED TO PROFILE, SETTINGS, THEME */}
      {isSidebarOpen && (
        <>
          <div style={mainPageStyles.overlay} onClick={toggleSidebar}></div>
          <div style={mainPageStyles.sidebar}>
             <div style={mainPageStyles.sidebarHeader}>
              <h3 style={mainPageStyles.sidebarTitle}>Menu</h3>
              <button style={mainPageStyles.closeButton} onClick={toggleSidebar}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div style={mainPageStyles.sidebarContent}>
              <div style={mainPageStyles.menuItem} className="menu-item">Profile</div>
              <div style={mainPageStyles.menuItem} className="menu-item">Settings</div>
              <div style={mainPageStyles.menuItem} className="menu-item">Theme</div>
            </div>
          </div>
        </>
      )}
      
      <div style={mainPageStyles.content}> 
        <Bar />

        <div style={mainPageStyles.mainContentArea} className="main-content-area">
          <div style={mainPageStyles.headerControlContainer}>
            <h1 style={mainPageStyles.plannerHeader}>
              {username ? `${username}'s Planner` : "Planner"}
            </h1>

            <div style={mainPageStyles.toggleContainer}>
              <span style={mainPageStyles.toggleLabel}>Show Tasks:</span>
              <label style={mainPageStyles.toggleSwitch}>
                <input 
                  type="checkbox" 
                  checked={showTasks} 
                  onChange={() => setShowTasks(!showTasks)} 
                  style={mainPageStyles.toggleInput}
                />
                <span className="slider" style={mainPageStyles.toggleSlider}></span>
              </label>
            </div>
          </div>

          <div style={mainPageStyles.calendarContainer}>
            <div style={mainPageStyles.calendarWrapper}>
              
              <div 
                style={mainPageStyles.calendar}
                onClick={handleOpenCalendar}
              >
                <div style={mainPageStyles.weekHeader}>
                  {daysOfWeek.map((day, index) => (
                    <div key={index} style={mainPageStyles.dayHeader}>
                      {day}
                    </div>
                  ))}
                </div>
                
                <div style={mainPageStyles.calendarGrid}>
                  {calendarData.map((data, index) => {
                    const isToday = isViewingCurrentRealMonth && data && data.day === realToday.getDate();
                    
                    return data ? (
                      <div 
                        key={data.day} 
                        style={{
                          ...mainPageStyles.dayCell,
                          ...(isToday ? mainPageStyles.todayCell : {}) 
                        }}
                      >
                        <div style={mainPageStyles.dayHeaderContainer}>
                          <span style={mainPageStyles.dayNumber}>{data.day}</span>
                          {isToday && <span style={mainPageStyles.todayLabel}>Today</span>}
                        </div>
                        
                        {showTasks ? (
                          <div style={mainPageStyles.eventContainer}>
                            {data.events.slice(0, MAX_EVENTS_IN_MAIN_CELL).map((event, i) => (
                              <div key={i} style={mainPageStyles.eventInCell}>
                                {event.content}
                              </div>
                            ))}
                            {data.events.length > MAX_EVENTS_IN_MAIN_CELL && (
                              <div style={mainPageStyles.moreEventsText}>
                                ...
                              </div>
                            )}
                          </div>
                        ) : (
                          data.events.length > 0 && (
                            <div style={mainPageStyles.reservedLabel}>
                              Reserved
                            </div>
                          )
                        )}

                      </div>
                    ) : (
                      <div key={`empty-${index}`} style={mainPageStyles.emptyCell}></div>
                    );
                  })}
                </div>
              </div>

              <div 
                style={mainPageStyles.sideTag} 
                className="side-tag"
                onClick={toggleMonthPicker}
              >
                {currentMonthName}
              </div>

              {isMonthPickerOpen && (
                <div style={mainPageStyles.monthPopup}>
                   {surroundingMonths.map((m, index) => (
                     <div 
                        key={index} 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMonthSelect(m.dateObject);
                        }}
                        style={{
                          ...mainPageStyles.monthPopupItem,
                          ...(m.isCurrent ? mainPageStyles.currentMonthItem : {})
                        }}
                        className="month-item"
                     >
                       <span>{m.name}</span>
                       <span style={{fontSize:'0.75rem', color:'#666', alignSelf:'center'}}>{m.year}</span>
                     </div>
                   ))}
                </div>
              )}

            </div>
          </div>

          <div style={mainPageStyles.barsContainer} className="bars-container">
            <div style={mainPageStyles.bar} className="clickable-bar" onClick={() => handleBarClick('daily')}>
              <span style={mainPageStyles.barText}>Daily</span>
            </div>
            <div style={mainPageStyles.bar} className="clickable-bar" onClick={() => handleBarClick('Weekly')}>
              <span style={mainPageStyles.barText}>Weekly</span>
            </div>
            <div style={mainPageStyles.bar} className="clickable-bar" onClick={() => handleBarClick('Monthly')}>
              <span style={mainPageStyles.barText}>Monthly</span>
            </div>
            <div style={mainPageStyles.bar} className="clickable-bar" onClick={() => handleBarClick('Track')}>
              <span style={mainPageStyles.barText}>Track</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

if (typeof document !== 'undefined') {
  const styleSheetId = 'timetogo-styles';
  let styleSheet = document.getElementById(styleSheetId);
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = styleSheetId;
    styleSheet.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap');

      @keyframes slideDown {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
      }
      
      .side-tag:hover {
        background-color: #f9a8d4 !important; 
        transform: translateX(2px);
      }
      
      .month-item:hover {
        background-color: #fce7f3 !important; 
      }
      
      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2) !important;
      }
      
      button:active {
        transform: translateY(0);
      }

      div[style*="cursor: pointer"]:hover {
        transform: scale(1.01);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
      }
      
      .intro-button:hover {
        background-color: #f472b6 !important;
      }
      
      .menu-item:hover {
        background-color: rgba(255, 255, 255, 0.5) !important;
        transform: scale(1.05);
      }
      
      .clickable-bar:hover {
        background-color: #f472b6 !important; 
        transform: translateY(-4px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2) !important;
      }
      
      .clickable-bar:active {
        transform: translateY(-2px);
      }

      .slider {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        border-radius: 50%;
        transition: .4s;
      }
      
      input:checked + .slider {
        background-color: #a0a082; 
      }
      
      input:checked + .slider::before {
        transform: translateX(20px);
      }
      
      .slider::before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 2px;
        bottom: 0px; 
        background-color: white;
        border-radius: 50%;
        transition: .4s;
      }
      
      input:checked + .slider {
        background-color: #b8b89a; 
      }
      
      input:checked + .slider::before {
        transform: translateX(20px);
      }

      @media (max-width: 767px) {
        button {
          padding: 10px 20px !important;
        }
        
        ${Object.keys(mainPageStyles.backButton).find(key => key === 'padding') ? `
        button[style*="padding: 12px 24px"] {
          padding: 10px 20px !important;
        }
        ` : ''}
      }
      
      @media (max-width: 480px) {
        button {
          padding: 8px 16px !important;
          font-size: 0.85rem !important;
        }

        ${Object.keys(mainPageStyles.backButton).find(key => key === 'padding') ? `
        button[style*="padding: 8px 16px"] {
          padding: 8px 16px !important;
        }
        ` : ''}
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

export default MainPage;