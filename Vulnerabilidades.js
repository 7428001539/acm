import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import axios from 'axios';

function Vulnerabilidades(){
  const [vulnerabilidades, setVulnerabilidades] = useState([]);

  //obtener amenazas
  useEffect(() => {
    const fetchVulnerabilidades = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/amenazas');
        setVulnerabilidades(response.data);
      } catch (error) {
        console.error('Error al cargar amenazas:', error);
      }
    };

    fetchVulnerabilidades();
  }, []);

  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'ID_Amenaza' },
    { Header: 'Descripcion', accessor: 'Descripcion'},
    { Header: 'Severidad', accessor: 'Nivel_severidad'},
    { Header: 'Estado', accessor: 'Estado'},
  ], []);


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, vulnerabilidades }, useSortBy); // Añadimos el hook useSortBy para habilitar el ordenamiento

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Vulnerabilidades Detectadas</h1>
      <table {...getTableProps()} style={styles.table}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={styles.th}
                >
                  {column.render('Header')}
                  {/* Icono de ordenación */}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} style={styles.td}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}



const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  th: {
    padding: '12px 15px',
    backgroundColor: '#f4f4f4',
    borderBottom: '2px solid #ddd',
    textAlign: 'left',
    cursor: 'pointer',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #ddd',
  },
};

export default Vulnerabilidades;
