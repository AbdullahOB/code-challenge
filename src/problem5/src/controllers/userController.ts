import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { CreateUserRequest, UpdateUserRequest, UserFilters } from '../interface/User';
import { asyncHandler, createError } from '../middleware/errorHandler';

export class UserController {

    // GET /api/v1/users - List all users with filters and pagination
    static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
        const filters: UserFilters = req.query as any;
        const result = await UserModel.findAll(filters);

        res.status(200).json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: result.data,
            pagination: result.pagination
        });
    });

    // GET /api/v1/users/:id - Get a specific user by ID
    static getUserById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await UserModel.findById(parseInt(id));

        if (!user) {
            throw createError('User not found', 404);
        }

        res.status(200).json({
            status: 'success',
            message: 'User retrieved successfully',
            data: user
        });
    });

    // POST /api/v1/users - Create a new user
    static createUser = asyncHandler(async (req: Request, res: Response) => {
        const userData: CreateUserRequest = req.body;

        // Check if email already exists
        const emailExists = await UserModel.emailExists(userData.email);
        if (emailExists) {
            throw createError('Email already exists', 409);
        }

        const user = await UserModel.create(userData);

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: user
        });
    });

    // PUT /api/v1/users/:id - Update a user
    static updateUser = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const updateData: UpdateUserRequest = req.body;
        const userId = parseInt(id);

        // Check if user exists
        const existingUser = await UserModel.findById(userId);
        if (!existingUser) {
            throw createError('User not found', 404);
        }

        // Check email uniqueness if email is being updated
        if (updateData.email) {
            const emailExists = await UserModel.emailExists(updateData.email, userId);
            if (emailExists) {
                throw createError('Email already exists', 409);
            }
        }

        const updatedUser = await UserModel.update(userId, updateData);

        res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: updatedUser
        });
    });

    // DELETE /api/v1/users/:id - Delete a user (soft delete)
    static deleteUser = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = parseInt(id);

        // Check if user exists
        const existingUser = await UserModel.findById(userId);
        if (!existingUser) {
            throw createError('User not found', 404);
        }

        const deleted = await UserModel.softDelete(userId);

        if (!deleted) {
            throw createError('Failed to delete user', 500);
        }

        res.status(200).json({
            status: 'success',
            message: 'User deactivated successfully'
        });
    });

    // DELETE /api/v1/users/:id/hard - Hard delete a user
    static hardDeleteUser = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = parseInt(id);

        // Check if user exists
        const existingUser = await UserModel.findById(userId);
        if (!existingUser) {
            throw createError('User not found', 404);
        }

        const deleted = await UserModel.hardDelete(userId);

        if (!deleted) {
            throw createError('Failed to delete user', 500);
        }

        res.status(200).json({
            status: 'success',
            message: 'User permanently deleted'
        });
    });

    // GET /api/v1/users/stats - Get user statistics
    static getUserStats = asyncHandler(async (req: Request, res: Response) => {
        const stats = await UserModel.getStatistics();

        res.status(200).json({
            status: 'success',
            message: 'User statistics retrieved successfully',
            data: stats
        });
    });

    // PATCH /api/v1/users/:id/activate - Activate a user
    static activateUser = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = parseInt(id);

        const updatedUser = await UserModel.update(userId, { is_active: true });

        if (!updatedUser) {
            throw createError('User not found', 404);
        }

        res.status(200).json({
            status: 'success',
            message: 'User activated successfully',
            data: updatedUser
        });
    });

    // PATCH /api/v1/users/:id/deactivate - Deactivate a user
    static deactivateUser = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = parseInt(id);

        const updatedUser = await UserModel.update(userId, { is_active: false });

        if (!updatedUser) {
            throw createError('User not found', 404);
        }

        res.status(200).json({
            status: 'success',
            message: 'User deactivated successfully',
            data: updatedUser
        });
    });
}