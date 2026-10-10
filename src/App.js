import { useState, useEffect } from 'react';
import './App.css';
import HabitosCRUD from './components/HabitosCRUD';
import Seguimiento from './components/Seguimiento';
import Reporte from './components/Reporte';

function App() {
  const [habitos, setHabitos] = useState([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/api/habitos')
      .then(res => res.json())
      .then(datos => {
        setHabitos(datos);
        setCargado(true);
      });
  }, []);

  useEffect(() => {
    if (!cargado) return;
    fetch('http://localhost:4000/api/habitos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habitos)
    });
  }, [habitos, cargado]);

  return (
    <div className="App">
      <div className="app-header">
        <h1>Mis Hábitos</h1>
        <p>Registra y sigue tu progreso diario</p>
      </div>
      <section>
        <Reporte habitos={habitos} />
      </section>
      <section>
        <HabitosCRUD habitos={habitos} setHabitos={setHabitos} />
      </section>
      <section>
        <Seguimiento habitos={habitos} setHabitos={setHabitos} />
      </section>
    </div>
  );
}

export default App;
