import React, { useEffect, useState } from 'react';
import './App.css';
import ufoImage from './ovni.png';
import xFilesTheme from './xfiles-theme.mp3';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const playAudio = () => {
    const audio = new Audio(xFilesTheme);
    audio.play().catch(error => {
      console.error("Error al reproducir el audio:", error);
    });
  };

  useEffect(() => {
    playAudio(); // Intenta reproducir al cargar la página
  }, []);

  return (
    <div className="App">
      <div className="sidebar">
        <div className="logo">
          <img src={ufoImage} alt="UFO" className="ufo-image" />
          <h2>UFO Experience</h2>
        </div>
        <nav className="nav">
          <ul>
            <li onClick={() => setActiveSection('home')}>Home</li>
            <li onClick={() => setActiveSection('explore')}>Explore</li>
            <li onClick={() => setActiveSection('contact')}>Contact</li>
          </ul>
        </nav>
      </div>
      <div className="content">
        {activeSection === 'home' && (
          <section>
            <h1>Welcome to the UFO Experience</h1>
            <p>Explore the mysteries of the universe with our amazing app!</p>
            <button onClick={playAudio}>Play Theme</button>
          </section>
        )}
        {activeSection === 'explore' && (
          <section>
            <h1>Explore the Unknown</h1>
            <p>Discover sightings, reports, and evidence of extraterrestrial life.</p>
          </section>
        )}
        {activeSection === 'contact' && (
          <section>
            <h1>Contact the Aliens</h1>
            <p>Want to share your own UFO experience? Get in touch!</p>
            <button onClick={() => alert("You are not alone!")}>
              Send a Message
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;

