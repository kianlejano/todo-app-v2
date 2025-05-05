import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Todo = sequelize.define('Todo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
    }
},{
    tableName: 'todos',
    timestamps: true,
});

export default Todo;
