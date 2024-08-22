import React, { useEffect } from 'react';
import './App.css';
import ufoImage from './ovni.png';
import xFilesTheme from './xfiles-theme.mp3';

function App() {
  useEffect(() => {
    const audio = new Audio(xFilesTheme);

    audio.play().catch(error => {
      console.error("Error al reproducir el audio automáticamente:", error);
    });

    // Si quieres asegurarte de que el audio se reproduce al cargar la página
    // Puedes incluir un botón para que el usuario inicie el audio manualmente
    const handleAudioPlay = () => {
      audio.play().catch(error => {
        console.error("Error al reproducir el audio manualmente:", error);
      });
    };

    // Agregar un listener para asegurarse de que el audio se reproduce si el usuario interactúa
    document.addEventListener('click', handleAudioPlay);

    return () => {
      document.removeEventListener('click', handleAudioPlay);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={ufoImage} className="App-logo" alt="ufo" />
        <h1 className="App-title">Welcome to the UFO Experience</h1>
        <p className="App-description">
          Explore the mysteries of the universe with our amazing app!
        </p>
        <button className="App-button" onClick={() => alert("You are not alone!")}>
          Contact the Aliens
        </button>
      </header>
    </div>
  );
}

export default App;

