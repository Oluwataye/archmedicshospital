import express from 'express';
import { auth, authorize } from '../middleware/auth';
import db from '../db';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Get all departments
router.get('/', auth, asyncHandler(async (req, res) => {
    const departments = await db('departments')
        .select('*')
        .orderBy('name', 'asc');
    res.json(departments);
}));

// Create new department (Admin only)
router.post('/', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { name, description, head_of_department, is_active } = req.body;

    if (!name) {
        throw Errors.badRequest('Department name is required');
    }

    // Check if department already exists
    const existing = await db('departments').where('name', name).first();
    if (existing) {
        throw Errors.conflict('Department with this name already exists');
    }

    const [id] = await db('departments').insert({
        name,
        description,
        head_of_department,
        is_active: is_active !== undefined ? (is_active ? 1 : 0) : 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    const newDepartment = await db('departments').where('name', name).first();

    log.info('Department created', { departmentId: id, name });
    res.status(201).json(newDepartment);
}));

// Update department (Admin only)
router.put('/:id', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { name, description, head_of_department, is_active } = req.body;
    const { id } = req.params;

    const department = await db('departments').where('id', id).first();
    if (!department) {
        throw Errors.notFound('Department');
    }

    // Check name uniqueness if name is changing
    if (name && name !== department.name) {
        const existing = await db('departments').where('name', name).whereNot('id', id).first();
        if (existing) {
            throw Errors.conflict('Department with this name already exists');
        }
    }

    await db('departments').where('id', id).update({
        name: name || department.name,
        description: description !== undefined ? description : department.description,
        head_of_department: head_of_department !== undefined ? head_of_department : department.head_of_department,
        is_active: is_active !== undefined ? (is_active ? 1 : 0) : department.is_active,
        updated_at: new Date().toISOString()
    });

    const updatedDepartment = await db('departments').where('id', id).first();
    log.info('Department updated', { departmentId: id });
    res.json(updatedDepartment);
}));

// Delete department (Admin only)
router.delete('/:id', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { id } = req.params;

    const department = await db('departments').where('id', id).first();
    if (!department) {
        throw Errors.notFound('Department');
    }

    await db('departments').where('id', id).delete();
    log.info('Department deleted', { departmentId: id });
    res.json({ message: 'Department deleted successfully' });
}));

export default router;
