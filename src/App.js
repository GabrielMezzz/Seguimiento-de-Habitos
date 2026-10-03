import { useState, useEffect } from 'react';
import './App.css';
import HabitosCRUD from './HabitosCRUD';
import Seguimiento from './Seguimiento';

function App() {
  const [habitos, setHabitos] = useState(() => {
    const guardado = localStorage.getItem("habitos");
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem("habitos", JSON.stringify(habitos));
  }, [habitos]);

  return (
    <div className="App">
      <HabitosCRUD habitos={habitos} setHabitos={setHabitos} />
      <Seguimiento habitos={habitos} setHabitos={setHabitos} />
    </div>
  );
}

export default App;