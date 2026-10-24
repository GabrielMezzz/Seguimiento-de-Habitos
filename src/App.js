// App principal: gestiona el estado de los hábitos y la persistencia en JSON.
import { useState, useEffect } from 'react';
import './App.css';
import habitosIniciales from './habitos.json';
import HabitosCRUD from './components/HabitosCRUD';
import Seguimiento from './components/Seguimiento';
import Reporte from './components/Reporte';

// Copia profunda para no modificar el módulo importado.
function clonarHabitos(lista) {
  return (lista || []).map((h) => ({
    ...h,
    historial: [...(h.historial || [])],
  }));
}

function App() {
  const [habitos, setHabitos] = useState([]);
  const [cargado, setCargado] = useState(false);

  // Carga inicial: lee los hábitos desde el servidor (archivo JSON).
  useEffect(() => {
    fetch('/api/habitos')
      .then((r) => r.json())
      .then((data) => {
        // Si el servidor devuelve un array válido, se usa; si no, los datos iniciales.
        setHabitos(clonarHabitos(Array.isArray(data) ? data : habitosIniciales));
        setCargado(true);
      })
      .catch((e) => {
        // Si falla la carga, se usan los datos iniciales del JSON importado.
        console.warn('No se pudieron leer los hábitos del JSON. Se usan los iniciales.', e);
        setHabitos(clonarHabitos(habitosIniciales));
        setCargado(true);
      });
  }, []);

  // Persistencia: cada cambio en `habitos` se guarda en el archivo JSON.
  useEffect(() => {
    if (!cargado) return; // Evita guardar antes de cargar.
    fetch('/api/habitos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habitos),
    }).catch((e) => console.error('No se pudieron guardar los hábitos.', e));
  }, [habitos, cargado]);

  if (!cargado) {
    return (
      <div className="App">
        <div className="app-header">
          <h1>Mis Hábitos</h1>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

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
