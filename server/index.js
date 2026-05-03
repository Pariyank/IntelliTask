const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes); 

app.post('/api/ai/generate-insights', require('./middleware/authMiddleware').protect, async (req, res) => {
  const { role } = req.user;
  const insight = role === 'Manager' 
    ? "Llama AI: Detecting potential 15% velocity drop in Project Alpha. Suggesting task redistribution."
    : "Llama AI: You are most productive between 10 AM and 1 PM. Schedule your 'High' priority tasks then.";
  res.json({ insight });
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(5000, () => console.log("🚀 IntelliTask Server: 5000 | DB: Connected"));
});  