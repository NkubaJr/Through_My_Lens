const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

require('./database');

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/artworks', require('./routes/artworks'));
app.use('/api/upload', require('./routes/upload'));

app.get('/', (req, res) => {
  res.json({ message: 'My Lens API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});