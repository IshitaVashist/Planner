import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Component Imports
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import Bar from './components/Bar'; 
import Profile from './components/Profile';
import Settings from './components/Settings';
import Theme from './components/Theme';

function App() {
  const [username, setUsername] = useState(''); 
  const [showTasks, setShowTasks] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        
        {/* Login */}
        <Route 
          path="/" 
          element={
            username ? <Navigate to="/planner" /> : (
              <LoginPage onLoginSuccess={(name) => setUsername(name)} />
            )
          } 
        />

        {/* Planner - REMOVED <Bar /> HERE so MainPage controls the full view */}
        <Route 
          path="/planner" 
          element={
            username ? (
              <MainPage username={username} showTasks={showTasks} />
            ) : <Navigate to="/" />
          } 
        />

        {/* Profile - kept Bar here for navigation context, remove if Profile has its own header */}
        <Route 
          path="/profile" 
          element={
            username ? (
              <>
                <Bar username={username} showTasks={showTasks} setShowTasks={setShowTasks} />
                <Profile username={username} />
              </>
            ) : <Navigate to="/" />
          } 
        />

        {/* Theme */}
        <Route 
          path="/theme"
          element={
            username ? (
              <>
                <Bar username={username} showTasks={showTasks} setShowTasks={setShowTasks} />
                <Theme 
                  username={username}
                  showTasks={showTasks}
                  setShowTasks={setShowTasks}
                />
              </>
            ) : <Navigate to="/" />
          }
        />

        {/* Settings */}
        <Route 
          path="/settings" 
          element={
            username ? (
              <>
                <Bar username={username} showTasks={showTasks} setShowTasks={setShowTasks} />
                <Settings username={username} />
              </>
            ) : <Navigate to="/" />
          } 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;