const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const usuariosRouter = require('./routes/usuarios');
const loginRouter = require('./routes/login');
const integracionesRouter = require('./routes/integraciones');
const incidentesRouter = require('./routes/incidentes');
const dispositivosRouter = require('./routes/dispositivos');
const politicasRouter = require('./routes/politicas');
const reportesRouter = require('./routes/reportes');
const rolesRouter = require('./routes/roles'); 
const tipoPoliticaRouter = require('./routes/tipo-politica');
const amenazasRouter = require('./routes/amenazas');

const app = express();

app.use(cors()); 
app.use(bodyParser.json());

app.use('/api/usuarios', usuariosRouter);
app.use('/api/login', loginRouter);
app.use('/api/integraciones', integracionesRouter);
app.use('/api/incidentes', incidentesRouter);
app.use('/api/dispositivos', dispositivosRouter);
app.use('/api/politicas', politicasRouter);
app.use('/api/reportes', reportesRouter);
app.use('/api/roles', rolesRouter); 
app.use('/api/tipo-politica', tipoPoliticaRouter);
app.use('/api/amenazas', amenazasRouter);


app.get('/', (req, res) => {
  res.json({ message: 'Servidor corriendo correctamente' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
