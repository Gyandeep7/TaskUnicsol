import express from 'express';
import { Any, getRepository } from 'typeorm';
import { Todo } from '../entities/Todo';
import { validate } from 'class-validator';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const todoRepository = getRepository(Todo);

        const todos = await todoRepository.find();
    
        return res.status(200).json(todos);
      } catch (error) {
        console.error('Error getting todos:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
});

router.get('/:id', async (req, res) => {
    try {
      const todoRepository = getRepository(Todo);
      const { id } = req.params;
  
      const todo = await todoRepository.findOne({ where: { id: id as string } });
  
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
  
      return res.status(200).json(todo);
    } catch (error) {
      console.error('Error getting todo by ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  

router.post('/', async (req, res) => {
    try {
        const todoRepository = getRepository(Todo);
        const { title, description } = req.body;
    
        const newTodo = todoRepository.create({
          title,
          description,
        });

        const validationErrors = await validate(newTodo);
        if (validationErrors.length > 0) {
          return res.status(400).json({ errors: validationErrors.map((error) => error.constraints) });
        }
    
        await todoRepository.save(newTodo);
    
        return res.status(201).json(newTodo);
      } catch (error) {
        console.error('Error creating todo:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
});

router.put('/:id', async (req, res) => {
    try {
        const todoRepository = getRepository(Todo);
        const { id } = req.params;
        const { title, description } = req.body;
    
        const todo = await todoRepository.findOne({ where: { id: id as string } });
    
        if (!todo) {
          return res.status(404).json({ message: 'Todo not found' });
        }
    
        todo.title = title || todo.title;
        todo.description = description || todo.description;

        const validationErrors = await validate(todo);
        if (validationErrors.length > 0) {
          return res.status(400).json({ errors: validationErrors.map((error) => error.constraints) });
        }
    
        await todoRepository.save(todo);
    
        return res.status(200).json(todo);
      } catch (error) {
        console.error('Error updating todo by ID:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
});

router.delete('/:id', async (req, res) => {
    try {
        const todoRepository = getRepository(Todo);
        const { id } = req.params;
        const { title, description } = req.body;
    
        const todo = await todoRepository.findOne({ where: { id: id as string } });
    
        if (!todo) {
          return res.status(404).json({ message: 'Todo not found' });
        }

        const validationErrors = await validate(todo);
        if (validationErrors.length > 0) {
         return res.status(400).json({ errors: validationErrors.map((error) => error.constraints) });
        }
    
        await todoRepository.remove(todo);
    
        return res.status(204).send();
      } catch (error) {
        console.error('Error deleting todo by ID:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    
});

export { router as TodoController };
