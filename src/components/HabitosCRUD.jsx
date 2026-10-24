// Componente CRUD de hábitos: alta, edición, eliminación y métricas por hábito.
import React, { useState } from "react";

function obtenerFechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

function fechaMenosDias(dias) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
}

// Calcula las métricas de un hábito a partir de su historial.
function calcularEstadisticas(habito) {
  const historial = habito.historial || [];
  const hoy = obtenerFechaHoy();

  const totalRegistros = historial.length;
  const cumplidos = historial.filter((r) => r.cumplido).length;
  const noCumplidos = totalRegistros - cumplidos;
  const cumplimientoGeneral =
    totalRegistros > 0 ? Math.round((cumplidos / totalRegistros) * 100) : 0;

  // Cumplimiento diario: estado de hoy
  const registroHoy = historial.find((r) => r.fecha === hoy);
  const cumplidoHoy = registroHoy ? registroHoy.cumplido : false;

  // Cumplimiento semanal: últimos 7 días
  const hace7 = fechaMenosDias(6);
  const registrosSemana = historial.filter((r) => r.fecha >= hace7 && r.fecha <= hoy);
  const cumplidosSemana = registrosSemana.filter((r) => r.cumplido).length;
  const cumplimientoSemanal =
    registrosSemana.length > 0
      ? Math.round((cumplidosSemana / registrosSemana.length) * 100)
      : 0;

  // Racha actual (días consecutivos cumplidos hacia atrás desde hoy)
  const fechasCumplidas = new Set(historial.filter((r) => r.cumplido).map((r) => r.fecha));
  let rachaActual = 0;
  for (let i = 0; ; i++) {
    const f = fechaMenosDias(i);
    if (fechasCumplidas.has(f)) rachaActual++;
    else break;
  }

  // Mejor racha histórica
  const fechasOrdenadas = [...historial].sort((a, b) => (a.fecha < b.fecha ? -1 : 1));
  let mejorRacha = 0;
  let rachaTemp = 0;
  let prevFecha = null;
  for (const r of fechasOrdenadas) {
    if (r.cumplido) {
      if (prevFecha) {
        const prev = new Date(prevFecha);
        const curr = new Date(r.fecha);
        const diff = (curr - prev) / (1000 * 60 * 60 * 24);
        if (diff === 1) rachaTemp++;
        else rachaTemp = 1;
      } else {
        rachaTemp = 1;
      }
      if (rachaTemp > mejorRacha) mejorRacha = rachaTemp;
    } else {
      rachaTemp = 0;
    }
    prevFecha = r.fecha;
  }

  return {
    cumplimientoSemanal,
    cumplidoHoy,
    rachaActual,
    mejorRacha,
    cumplimientoGeneral,
    totalRegistros,
    cumplidos,
    noCumplidos,
  };
}

function HabitosCRUD({ habitos, setHabitos }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [frecuencia, setFrecuencia] = useState("Diaria");
  const [editando, setEditando] = useState(-1);
  const [estadisticasDe, setEstadisticasDe] = useState(-1);

  function agregarHabito() {
    if (nombre === "") {
      alert("Escribe un nombre");
      return;
    }

    if (editando === -1) {
      const nuevoHabito = {
        nombre: nombre,
        descripcion: descripcion,
        frecuencia: frecuencia,
        historial: []
      };
      setHabitos([...habitos, nuevoHabito]);
    } else {
      const listaActualizada = [...habitos];
      listaActualizada[editando].nombre = nombre;
      listaActualizada[editando].descripcion = descripcion;
      listaActualizada[editando].frecuencia = frecuencia;
      setHabitos(listaActualizada);
      setEditando(-1);
    }

    setNombre("");
    setDescripcion("");
    setFrecuencia("Diaria");
  }

  function editarHabito(index) {
    setNombre(habitos[index].nombre);
    setDescripcion(habitos[index].descripcion);
    setFrecuencia(habitos[index].frecuencia);
    setEditando(index);
  }

  function eliminarHabito(index) {
    const listaActualizada = habitos.filter((h, i) => i !== index);
    setHabitos(listaActualizada);
  }

  return (
    <div className="Habitos-container">
      <h2>Mis Hábitos</h2>

      <input
        type="text"
        placeholder="Nombre del hábito"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="text"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <select value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)}>
        <option value="Diaria">Diaria</option>
        <option value="Semanal">Semanal</option>
      </select>

      <button onClick={agregarHabito}>
        {editando === -1 ? "Agregar" : "Guardar"}
      </button>

      <table className="Habitos-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Frecuencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {habitos.map((h, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>{h.nombre}</td>
                <td>{h.descripcion}</td>
                <td>{h.frecuencia}</td>
                <td>
                  <button onClick={() => editarHabito(index)}>Editar</button>
                  <button onClick={() => eliminarHabito(index)}>Eliminar</button>
                  <button onClick={() => setEstadisticasDe(estadisticasDe === index ? -1 : index)}>
                    Métricas
                  </button>
                </td>
              </tr>
              {estadisticasDe === index && (
                <tr>
                  <td colSpan="4">
                    {(() => {
                      const stats = calcularEstadisticas(h);
                      const hoy = new Date();
                      const dias = [];
                      for (let i = 6; i >= 0; i--) {
                        const d = new Date(hoy);
                        d.setDate(d.getDate() - i);
                        const f = d.toISOString().slice(0, 10);
                        const reg = (h.historial || []).find((r) => r.fecha === f);
                        dias.push({ fecha: f.slice(5), cumplido: reg ? reg.cumplido : null });
                      }
                      return (
                        <div style={{ padding: "12px", background: "#f9f9f9", borderRadius: "8px" }}>
                          <h4 style={{ marginTop: 0 }}>Métricas de {h.nombre}</h4>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "12px" }}>
                            <div style={{ padding: "8px", background: "#fff", borderRadius: "6px" }}><strong>Tiempo de uso:</strong> {(() => {
                              const hist = h.historial || [];
                              if (hist.length === 0) return "0 días";
                              const fechas = hist.map((r) => new Date(r.fecha)).sort((a, b) => a - b);
                              const dias = Math.round((fechas[fechas.length - 1] - fechas[0]) / (1000 * 60 * 60 * 24)) + 1;
                              return dias + " días";
                            })()}</div>
                            <div style={{ padding: "8px", background: "#fff", borderRadius: "6px" }}><strong>Cumplimiento semanal:</strong> {stats.cumplimientoSemanal}%</div>
                            <div style={{ padding: "8px", background: "#fff", borderRadius: "6px" }}><strong>Cumplimiento diario:</strong> {stats.cumplidoHoy ? "Cumplido hoy" : "No cumplido hoy"}</div>
                            <div style={{ padding: "8px", background: "#fff", borderRadius: "6px" }}><strong>Racha actual:</strong> {stats.rachaActual} días</div>
                            <div style={{ padding: "8px", background: "#fff", borderRadius: "6px" }}><strong>Mejor racha:</strong> {stats.mejorRacha} días</div>
                            <div style={{ padding: "8px", background: "#fff", borderRadius: "6px" }}><strong>Cumplimiento general:</strong> {stats.cumplimientoGeneral}%</div>
                            <div style={{ padding: "8px", background: "#fff", borderRadius: "6px" }}><strong>Total de registros:</strong> {stats.totalRegistros}</div>
                            <div style={{ padding: "8px", background: "#fff", borderRadius: "6px" }}><strong>Días cumplidos:</strong> {stats.cumplidos}</div>
                            <div style={{ padding: "8px", background: "#fff", borderRadius: "6px" }}><strong>Días no cumplidos:</strong> {stats.noCumplidos}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "80px" }}>
                            {dias.map((dia, i) => (
                              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                                <div
                                  style={{
                                    width: "100%",
                                    height: dia.cumplido === null ? "4px" : dia.cumplido ? "60px" : "20px",
                                    background: dia.cumplido === null ? "#ddd" : dia.cumplido ? "#4caf50" : "#f44336",
                                    borderRadius: "3px",
                                  }}
                                />
                                <span style={{ fontSize: "10px", marginTop: "2px" }}>{dia.fecha}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HabitosCRUD;
