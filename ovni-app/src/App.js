import React, { useEffect } from "react";
import "./App.css";
import ufoImage from "./ovni.png";
import gardenImage from "./garden.jpg"; // Importa la nueva imagen

function App() {
  useEffect(() => {
    const audio = new Audio("xFilesTheme");
    audio.play().catch((error) => {
      console.error("Error al reproducir el audio automáticamente:", error);
    });
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
            <li>Home</li>
            <li>Explore</li>
            <li>Contact</li>
          </ul>
        </nav>
      </div>
      <div className="content">
        <section>
          <h1>Welcome to the UFO Experience</h1>
          <p>Explore the mysteries of the universe with our amazing app!</p>
          <img src={gardenImage} alt="Garden" className="garden-image" />{" "}
          {/* Agrega la imagen central */}
        </section>
      </div>
    </div>
  );
}

export default App;
