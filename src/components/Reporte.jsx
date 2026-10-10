function obtenerFechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

function Reporte({ habitos }) {
  const totalHabitos = habitos.length;

  const todosLosRegistros = habitos.flatMap(h => h.historial || []);
  const registrosCumplidos = todosLosRegistros.filter(r => r.cumplido).length;
  const cumplimientoGeneral = todosLosRegistros.length > 0
    ? Math.round((registrosCumplidos / todosLosRegistros.length) * 100)
    : 0;

  const fechaHoy = obtenerFechaHoy();
  const cumplidosHoy = habitos.filter(h =>
    (h.historial || []).some(r => r.fecha === fechaHoy && r.cumplido)
  ).length;

  // Racha actual: días consecutivos (hacia atrás desde hoy) con al menos un hábito cumplido
  let racha = 0;
  const hoy = new Date();
  for (let i = 0; ; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - i);
    const fechaStr = fecha.toISOString().slice(0, 10);
    const cumplioEseDia = habitos.some(h =>
      (h.historial || []).some(r => r.fecha === fechaStr && r.cumplido)
    );
    if (cumplioEseDia) {
      racha++;
    } else {
      break;
    }
  }

  return (
    <div className="reporte">
      <h2>Reporte de Cumplimiento</h2>
      <div className="reporte-metricas">
        <div className="metrica">
          <span className="metrica-valor">{totalHabitos}</span>
          <span className="metrica-titulo">Total de hábitos</span>
        </div>
        <div className="metrica">
          <span className="metrica-valor">{cumplimientoGeneral}%</span>
          <span className="metrica-titulo">Cumplimiento general</span>
        </div>
        <div className="metrica">
          <span className="metrica-valor">{cumplidosHoy}/{totalHabitos}</span>
          <span className="metrica-titulo">Cumplidos hoy</span>
        </div>
        <div className="metrica">
          <span className="metrica-valor">{racha} {racha === 1 ? 'día' : 'días'}</span>
          <span className="metrica-titulo">Racha actual</span>
        </div>
      </div>
    </div>
  );
}

export default Reporte;
