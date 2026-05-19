const express = require('express');
const cors = require('cors');
const solicitudesRoutes = require('./routes/solicitudes.routes');

require('./config/db');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

app.get('/', (req, res) => {
    res.send('API funcionando');
});

app.listen(3000, () => {
    console.log('Servidor en puerto 3000');
});