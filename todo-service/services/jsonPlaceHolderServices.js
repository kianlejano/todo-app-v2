import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const getTodos = async () => {
    const url = 'https://jsonplaceholder.typicode.com/todos'
    const res = await axios.get(url);
    return res.data;
}

export { getTodos };
