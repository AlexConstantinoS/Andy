const express = require('express');
const cors = require('cors');
const solicitudesRoutes = require('./routes/solicitudes.routes');

require('./config/db');

const authRoutes = require('./routes/authRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://andy-sepia.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});