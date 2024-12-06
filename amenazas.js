const express = require('express');
const router = express.Router();
const db = require('../data-base/db');

router.get('/', (req, res) => {
  	const query = 'SELECT * FROM Amenaza';
  	db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error al obtener amenazas:', err.message);
      return res.status(500).send('Error al obtener amenazas');
    }
    res.json(rows);
  });
});

router.post('/', (req, res) => {
	const {
		ID_tipo_amenaza,
    	Fecha_deteccion,
    	Nivel_severidad,
    	Descripcion,
    	Estado,
	} = req.body;

	if(!ID_tipo_amenaza || !Fecha_deteccion || !Nivel_severidad || !Estado) {
    	return res.status(400).send('Los campos ID_tipo_amenaza, Fecha_deteccion, Nivel_severidad y Estado son obligatorios');
  	}

  	const query = `
  		INSERT INTO Amenaza (ID_tipo_amenaza, Fecha_deteccion, Nivel_severidad, Descripcion, Estado)
    	VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  	`;

  	db.run(
  		query,
    	[ID_tipo_amenaza, Fecha_deteccion, Nivel_severidad, Descripcion, Estado],
    	function (err) {
      		if (err) {
        		console.error('Error al agregar amenaza:', err.message);
        		return res.status(500).send('Error al agregar amenaza');
      		}
    		res.json({ ID_Incidente: this.lastID });
    	}
  	);
});

router.delete('/:id', (req, res) => {
	const { id } = req.params;

	const query = 'DELETE FROM Amenaza WHERE ID_Amenaza = ?';
	db.run(query, [id], function (err) {
    	if(err) {
    		console.error('Error al eliminar amenaza:', err.message);
    		return res.status(500).send('Error al eliminar amenaza');
    	}
    	if(this.changes === 0) {
    		return res.status(404).send('Amenaza no encontrada');
    	}
    	res.json({ message: 'Amenaza eliminada correctamente' });
  	});
});

module.exports = router;