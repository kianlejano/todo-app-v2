import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const url = "https://jsonplaceholder.typicode.com/todos"

export const getTodos = async () => {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        return error
    }
}

export const createTodos = async (req) => {
    try {
        const res = await axios.post(url, req);
        return res.data;   
    } catch (error) {
        return error
    }
}

export const updateTodo = async (id, req) => {
    try {
        const res = await axios.patch(`${url}/${id}`, req);
        return res.data;   
    } catch (error) {
        return error
    }
}

export const deleteTodo = async (id) => {
    try {
        const res = await axios.delete(`${url}/${id}`);
        return res.data;   
    } catch (error) {
        return error
    }
}
