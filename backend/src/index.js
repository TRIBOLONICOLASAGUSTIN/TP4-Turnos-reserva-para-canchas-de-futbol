require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const disciplinasRoutes = require('./routes/disciplinas');
const espaciosRoutes = require('./routes/espacios');
const reservasRoutes = require('./routes/reservas');
const adminRoutes = require('./routes/admin');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/disciplinas', disciplinasRoutes);
app.use('/api/espacios', espaciosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`TTC Sport API corriendo en puerto ${PORT}`));
