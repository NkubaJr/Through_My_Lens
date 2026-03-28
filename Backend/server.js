const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const allowedOrigin = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
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
```

---

Now add the Turso and Cloudinary variables to Render. Go to your Render dashboard → `mylens-backend` → **Environment** and add:
```
TURSO_URL = libsql://mylens-nkubajr.aws-ap-south-1.turso.io
TURSO_TOKEN = eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQ3MDY5ODEsImlkIjoiMDE5ZDM0YzYtNzYwMS03NmIxLTgzNjEtZThmMGVmN2ViNjIzIiwicmlkIjoiNjk5NTQyMjEtOWFkYS00ZDE5LWEwNjUtY2Y3Y2ZkZGI0OGE4In0.dxTXiCILdenF51okC280kEkEkJVNhagkU_f-nFEiryyfgsgX1DAFWJ2AkmG1b9AMIdGQsieL26l0kziyf4zUBQ
CLOUDINARY_CLOUD_NAME = dalypvrmm
CLOUDINARY_API_KEY = 738351827722735
CLOUDINARY_API_SECRET = SHtwpQItdd_WqFgkz8jQOCBMRKM