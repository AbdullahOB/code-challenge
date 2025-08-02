import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateBody, validateQuery, validateParams } from '../middleware/validation';
import {
    createUserSchema,
    updateUserSchema,
    userFiltersSchema,
    idParamSchema
} from '../validation/userValidation';

const router = Router();

// GET /api/v1/users/stats - Get user statistics (place before /:id to avoid conflicts)
router.get('/stats', UserController.getUserStats);

// GET /api/v1/users - List all users with filters and pagination
router.get('/',
    validateQuery(userFiltersSchema),
    UserController.getAllUsers
);

// POST /api/v1/users - Create a new user
router.post('/',
    validateBody(createUserSchema),
    UserController.createUser
);

// GET /api/v1/users/:id - Get a specific user by ID
router.get('/:id',
    validateParams(idParamSchema),
    UserController.getUserById
);

// PUT /api/v1/users/:id - Update a user
router.put('/:id',
    validateParams(idParamSchema),
    validateBody(updateUserSchema),
    UserController.updateUser
);

// DELETE /api/v1/users/:id - Soft delete a user
router.delete('/:id',
    validateParams(idParamSchema),
    UserController.deleteUser
);

// DELETE /api/v1/users/:id/hard - Hard delete a user
router.delete('/:id/hard',
    validateParams(idParamSchema),
    UserController.hardDeleteUser
);

// PATCH /api/v1/users/:id/activate - Activate a user
router.patch('/:id/activate',
    validateParams(idParamSchema),
    UserController.activateUser
);

// PATCH /api/v1/users/:id/deactivate - Deactivate a user
router.patch('/:id/deactivate',
    validateParams(idParamSchema),
    UserController.deactivateUser
);

export default router;