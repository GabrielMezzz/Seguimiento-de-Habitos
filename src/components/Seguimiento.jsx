import React, { useState } from "react";

function obtenerFechaHoy() {
  const hoy = new Date();
  return hoy.toISOString().slice(0, 10);
}

function Seguimiento({ habitos, setHabitos }) {
  const [verHistorialDe, setVerHistorialDe] = useState(-1);

  function buscarRegistroHoy(habito) {
    const fechaHoy = obtenerFechaHoy();
    const historial = habito.historial || [];
    return historial.find((registro) => registro.fecha === fechaHoy);
  }

  function marcarCumplimiento(index, cumplido) {
    const listaActualizada = [...habitos];
    const habito = listaActualizada[index];
    if (!habito.historial) habito.historial = [];
    const fechaHoy = obtenerFechaHoy();
    const registroHoy = buscarRegistroHoy(habito);

    if (registroHoy) {
      registroHoy.cumplido = cumplido;
    } else {
      habito.historial.push({ fecha: fechaHoy, cumplido: cumplido });
    }

    setHabitos(listaActualizada);
  }

  function mostrarOcultarHistorial(index) {
    if (verHistorialDe === index) {
      setVerHistorialDe(-1);
    } else {
      setVerHistorialDe(index);
    }
  }

  return (
    <div className="Habitos-container">
      <h2>Seguimiento diario</h2>

      {habitos.length === 0 ? (
        <p>Todavía no hay hábitos registrados.</p>
      ) : (
        <table className="Habitos-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Hoy</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {habitos.map((h, index) => {
              const registroHoy = buscarRegistroHoy(h);

              return (
                <React.Fragment key={index}>
                  <tr>
                    <td>{h.nombre}</td>
                    <td>
                      <button onClick={() => marcarCumplimiento(index, true)}>
                        Cumplido
                      </button>
                      <button onClick={() => marcarCumplimiento(index, false)}>
                        No cumplido
                      </button>
                      {registroHoy && (
                        <p>Hoy: {registroHoy.cumplido ? "SI" : "NO"}</p>
                      )}
                    </td>
                    <td>
                      <button onClick={() => mostrarOcultarHistorial(index)}>
                        Historial
                      </button>
                    </td>
                  </tr>

                  {verHistorialDe === index && (
                    <tr>
                      <td colSpan="3">
                        <strong>Historial de {h.nombre}:</strong>
                        {h.historial.length === 0 ? (
                          <p>Todavía no hay registros.</p>
                        ) : (
                          <ul>
                            {h.historial.map((registro, i) => (
                              <li key={i}>
                                {registro.fecha} - {registro.cumplido ? "Cumplido" : "No cumplido"}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Seguimiento;
