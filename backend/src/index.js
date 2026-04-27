const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/profile',       require('./routes/profile'));
app.use('/api/resources',     require('./routes/resources'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/tasks',         require('./routes/tasks'));
app.use('/api/navigation',    require('./routes/navigation'));
app.use('/api/community',     require('./routes/community'));

app.get('/health', (req, res) => res.json({ status: 'HokieStart API is running' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HokieStart backend running on port ${PORT}`));
