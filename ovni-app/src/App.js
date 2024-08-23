import React, { useState } from 'react';
import './App.css';
import ufoImage from './ovni.png';
import xFilesTheme from './xfiles-theme.mp3';

function App() {
  const [showOverlay, setShowOverlay] = useState(true);

  const handleClick = () => {
    const audio = new Audio(xFilesTheme);
    audio.play().catch(error => {
      console.error("Error al reproducir el audio:", error);
    });
    setShowOverlay(false);
  };

  return (
    <div className="App">
      {showOverlay && (
        <div className="overlay" onClick={handleClick}>
          <h1>Welcome to the UFO Experience</h1>
          <p>Click anywhere to enter and play the theme</p>
        </div>
      )}
      <div className={`main-content ${showOverlay ? 'blurred' : ''}`}>
        <div className="sidebar">
          <div className="logo">
            <
