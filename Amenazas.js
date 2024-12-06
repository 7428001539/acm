import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import axios from 'axios';

function Amenazas(){
  const [amenazas, setAmenazas] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios
  const [nuevaAmenaza, setNuevaAmenaza] = useState({
    ID_tipo_amenaza: '',
    Fecha_deteccion: '',
    Nivel_severidad: '',
    Descripcion: '',
    Estado: '',
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [amenazaToDelete, setAmenazaToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //obtener amenazas
  useEffect(() => {
    const fetchAmenazas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/amenazas');
        setAmenazas(response.data);
      } catch (error) {
        console.error('Error al cargar amenazas:', error);
      }
    };

    fetchAmenazas();
  }, []);

  // Obtener usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/usuarios'); // Endpoint para usuarios
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);


  const agregarAmenaza = async () => {
    if (!nuevaAmenaza.ID_tipo_amenaza || !nuevaAmenaza.Fecha_deteccion || nuevaAmenaza.Nivel_severidad || !nuevaAmenaza.Estado || !nuevaAmenaza.ID_Usuario) {
      alert('Por favor, complete los campos obligatorios: Fecha de Inicio, Descripción, Estado y Usuario.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/amenazas', nuevaAmenaza);
      setAmenazas([...amenazas, { ID_Amenaza: response.data.ID_Amenaza, ...nuevaAmenaza }]);
      setNuevaAmenaza({
        ID_tipo_amenaza: '',
        Fecha_deteccion: '',
        Nivel_severidad: '',
        Descripcion: '',
        Estado: '',
      });
    } catch (error) {
      console.error('Error al agregar amenaza:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const abrirModalEliminar = (id) => {
    console.log('Abrir modal para eliminar amenaza con ID:', id);
    setAmenazaToDelete(id);
    setDeleteModalOpen(true);
  };

  const eliminarAmenaza = async () => {
    if (!amenazaToDelete) {
      console.error('No hay amenaza seleccionada para eliminar.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/amenazas/${amenazaToDelete}`);
      setAmenazas(amenazas.filter((amenazas) => amenazas.ID_Amenaza !== amenazaToDelete));
      setDeleteModalOpen(false);
      setAmenazaToDelete(null);
    } catch (error) {
      console.error('Error al eliminar amenaza:', error);
    }
  };

  const data = useMemo(() => amenazas, [amenazas]);

  const columns = useMemo(() => [
      { Header: 'ID', accessor: 'ID_Amenaza' },
      { Header: 'Descripcion', accessor: 'Descripcion'},
      { Header: 'Severidad', accessor: 'Nivel_severidad'},
      { Header: 'Estado', accessor: 'Estado'},
      { Header: 'Usuario', accessor: 'ID_Usuario' },
      {
        Header: 'Eliminar',
        accessor: 'Eliminar',
        Cell: ({ row }) => (
          <button onClick={() => abrirModalEliminar(row.original.ID_Amenaza)} style={styles.deleteButton}>
            X
          </button>
        ),
      },
    ],
    [amenazas]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data },
    useSortBy
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Incidentes</h1>

      <div style={styles.formContainer}>
        <input
          type="text"
          placeholder="Descripción"
          value={nuevaAmenaza.Descripcion}
          onChange={(e) => setNuevaAmenaza({ ...nuevaAmenaza, Descripcion: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Severidad"
          value={nuevaAmenaza.Nivel_severidad}
          onChange={(e) => setNuevaAmenaza({ ...nuevaAmenaza, Nivel_severidad: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Estado"
          value={nuevaAmenaza.Estado}
          onChange={(e) => setNuevaAmenaza({ ...nuevaAmenaza, Estado: e.target.value })}
          style={styles.input}
        />
        <select
          value={nuevaAmenaza.ID_Usuario}
          onChange={(e) => setNuevaAmenaza({ ...nuevaAmenaza, ID_Usuario: e.target.value })}
          style={styles.input}
        >
          <option value="">Seleccionar Usuario</option>
          {usuarios.map((usuario) => (
            <option key={usuario.ID_Usuario} value={usuario.ID_Usuario}>
              {usuario.Nombre}
            </option>
          ))}
        </select>
        <button onClick={agregarAmenaza} style={styles.addButton} disabled={isSubmitting}>
          {isSubmitting ? 'Agregando...' : 'Agregar Amenaza'}
        </button>
      </div>

      <table {...getTableProps()} style={styles.table}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} style={styles.th}>
                  {column.render('Header')}
                  <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} style={styles.td}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal de confirmación para eliminar */}
      {deleteModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>¿Estás seguro de que deseas eliminar esta amenaza?</h3>
            <button onClick={eliminarAmenaza} style={styles.deleteConfirmButton}>
              Sí, eliminar
            </button>
            <button
              onClick={() => {
                setDeleteModalOpen(false);
                setAmenazaToDelete(null);
              }}
              style={styles.cancelButton}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );

}

const styles = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' },
  formContainer: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%' },
  addButton: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '150px',
    alignSelf: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  th: {
    padding: '12px 15px',
    backgroundColor: '#f4f4f4',
    borderBottom: '2px solid #ddd',
    textAlign: 'left',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
    backgroundColor: '#ffffff',
  },
  deleteButton: {
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '15px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  },
  deleteConfirmButton: {
    padding: '10px 25px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '15px',
    transition: 'background-color 0.3s ease',
  },
  cancelButton: {
    padding: '10px 25px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
};

export default Amenazas;
