import { useState, useEffect } from 'react';
import './App.css';
import habitosIniciales from './habitos.json';
import HabitosCRUD from './components/HabitosCRUD';
import Seguimiento from './components/Seguimiento';
import Reporte from './components/Reporte';

const CLAVE_GUARDADO = 'habitos';

// Copia profunda para no modificar el módulo importado.
function clonarHabitos(lista) {
  return lista.map((h) => ({
    ...h,
    historial: [...(h.historial || [])],
  }));
}

// Al iniciar: usa lo guardado en el navegador; si no hay nada, el JSON original.
function cargarHabitosIniciales() {
  try {
    const guardado = localStorage.getItem(CLAVE_GUARDADO);
    if (guardado) return clonarHabitos(JSON.parse(guardado));
  } catch (e) {
    console.warn('No se pudieron leer los hábitos guardados.', e);
  }
  return clonarHabitos(habitosIniciales);
}

function App() {
  const [habitos, setHabitos] = useState(cargarHabitosIniciales);

  // Cada vez que cambian los hábitos, se guardan en el navegador.
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(habitos));
    } catch (e) {
      console.error('No se pudieron guardar los hábitos.', e);
    }
  }, [habitos]);

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
