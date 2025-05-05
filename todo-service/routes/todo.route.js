import express from 'express';
import { getTodos, createTodo, getAndCreateFromJsonPlaceholder, getTodosByUserId, getTodosById, updateTodo, deleteTodo } from '../controllers/todo.controller.js';

const router = express.Router();

router.get('/', getTodos);
router.get('/:id', getTodosById);
router.get('/user/:id', getTodosByUserId)
router.post('/todos-from-json-placeholder', getAndCreateFromJsonPlaceholder)
router.post('/', createTodo);
router.put('/:id', updateTodo)
router.delete('/:id', deleteTodo)


export default router;
