import { useState } from "react";

function HabitosCRUD({ habitos, setHabitos }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [frecuencia, setFrecuencia] = useState("Diaria");
  const [editando, setEditando] = useState(-1);

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
        historial: [], // lo usa Seguimiento.jsx para guardar el cumplimiento
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
            <tr key={index}>
              <td>{h.nombre}</td>
              <td>{h.descripcion}</td>
              <td>{h.frecuencia}</td>
              <td>
                <button onClick={() => editarHabito(index)}>Editar</button>
                <button onClick={() => eliminarHabito(index)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HabitosCRUD;