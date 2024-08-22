import React from 'react';
import './App.css';
import ufoImage from './ufo.png'; // Puedes agregar una imagen de OVNI a la carpeta src

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={ufoImage} className="App-logo" alt="ufo" />
        <h1>Welcome to the UFO Experience</h1>
        <p>
          Explore the mysteries of the universe with our amazing app!
        </p>
      </header>
    </div>
  );
}

export default App;

