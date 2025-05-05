import { Todo } from '../models/index.js';
import * as jsonPlaceHolderApi from '../services/jsonPlaceHolderServices.js';


export const getTodos = async (req, res) => {
    try {
        const response = await Todo.findAll();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch todos', error: error.message });
    }
};

export const getTodosById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await Todo.findOne({ 
            where: { id } 
        });
        if (!response) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        return res.json(response);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving todo', error: error.message });
    }
}

export const getTodosByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await Todo.findAll({
            where:{ userId: id },
        })
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch user todos', error: error.message });
    }
}

export const createTodo = async (req, res) => {
    try {
        const response = await Todo.create(req.body);
        return res.status(201).json(response);
    } catch (error) {
        return res.status(400).json({ message: 'Failed to create todo', error: error.message });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const update = await Todo.update(
            req.body, 
            { where: { id } },
        );
        if(!update[0]){
            return res.status(404).json({ message: 'Todo not found. No changes are made' });
        }
        return res.status(200).json({ message: 'Todo updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update todo', error: error.message });
    }
}

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteData = await Todo.destroy({
            where: { id }
        })
        if(deleteData === 0){
            return res.status(404).json({ message: 'Todo not found' });
        }
        return res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to delete todo', error: error.message });
    }
}

// This is for fetching and saving of data from JSONPlaceholder
export const getAndCreateFromJsonPlaceholder = async (req, res) => {
    try {
        const todos = await jsonPlaceHolderApi.getTodos();
        await Todo.bulkCreate(todos, { ignoreDuplicates: true });
        return res.status(201).json({ message: 'Todos fetched and saved successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to import todos', error: error.message });
    }
}

