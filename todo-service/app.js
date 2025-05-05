import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import todoRoutes from './routes/todo.route.js';
import sequelize from './config/db.config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())
app.use('/api/todos', todoRoutes);

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    })
    .catch((error) => console.error('Failed to connect to DB:', error));
