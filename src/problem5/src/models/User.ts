import { DatabaseConnection } from '../database/connection';
import { CreateUserRequest, UpdateUserRequest, UserFilters, PaginatedResponse, User } from '../interface/User';

export class UserModel {

    // Create a new user
    static async create(userData: CreateUserRequest): Promise<User> {
        const { name, email, age, department, salary } = userData;

        const sql = `
            INSERT INTO users (name, email, age, department, salary)
            VALUES (?, ?, ?, ?, ?)
        `;

        try {
            const result = await DatabaseConnection.run(sql, [name, email, age, department, salary]);
            const createdUser = await this.findById(result.lastID!);

            if (!createdUser) {
                throw new Error('Failed to retrieve created user');
            }

            return createdUser;
        } catch (error: any) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    // Find user by ID
    static async findById(id: number): Promise<User | null> {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const user = await DatabaseConnection.get(sql, [id]);
        return user || null;
    }

    // Find all users with filters and pagination
    static async findAll(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
        const {
            name,
            email,
            department,
            is_active,
            min_age,
            max_age,
            min_salary,
            max_salary,
            page = 1,
            limit = 10,
            sort_by = 'created_at',
            sort_order = 'DESC'
        } = filters;

        // Build WHERE clause
        const conditions: string[] = [];
        const params: any[] = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }

        if (email) {
            conditions.push('email LIKE ?');
            params.push(`%${email}%`);
        }

        if (department) {
            conditions.push('department LIKE ?');
            params.push(`%${department}%`);
        }

        if (is_active !== undefined) {
            conditions.push('is_active = ?');
            params.push(is_active ? 1 : 0);
        }

        if (min_age) {
            conditions.push('age >= ?');
            params.push(min_age);
        }

        if (max_age) {
            conditions.push('age <= ?');
            params.push(max_age);
        }

        if (min_salary) {
            conditions.push('salary >= ?');
            params.push(min_salary);
        }

        if (max_salary) {
            conditions.push('salary <= ?');
            params.push(max_salary);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Count total items
        const countSql = `SELECT COUNT(*) as total FROM users ${whereClause}`;
        const countResult = await DatabaseConnection.get(countSql, params);
        const totalItems = countResult.total;

        // Calculate pagination
        const offset = (page - 1) * limit;
        const totalPages = Math.ceil(totalItems / limit);

        // Build main query
        const sql = `
            SELECT * FROM users 
            ${whereClause}
            ORDER BY ${sort_by} ${sort_order}
            LIMIT ? OFFSET ?
        `;

        const users = await DatabaseConnection.all(sql, [...params, limit, offset]);

        return {
            data: users,
            pagination: {
                current_page: page,
                total_pages: totalPages,
                total_items: totalItems,
                items_per_page: limit,
                has_next: page < totalPages,
                has_prev: page > 1
            }
        };
    }

    // Update user by ID
    static async update(id: number, updateData: UpdateUserRequest): Promise<User | null> {
        const existingUser = await this.findById(id);
        if (!existingUser) {
            return null;
        }

        const fields: string[] = [];
        const params: any[] = [];

        Object.entries(updateData).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                params.push(value);
            }
        });

        if (fields.length === 0) {
            return existingUser; // No fields to update
        }

        params.push(id); // Add ID for WHERE clause

        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

        try {
            await DatabaseConnection.run(sql, params);
            return await this.findById(id);
        } catch (error: any) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    // Delete user by ID (soft delete - set is_active to false)
    static async softDelete(id: number): Promise<boolean> {
        const sql = 'UPDATE users SET is_active = 0 WHERE id = ?';
        const result = await DatabaseConnection.run(sql, [id]);
        return result.changes! > 0;
    }

    // Hard delete user by ID
    static async hardDelete(id: number): Promise<boolean> {
        const sql = 'DELETE FROM users WHERE id = ?';
        const result = await DatabaseConnection.run(sql, [id]);
        return result.changes! > 0;
    }

    // Check if email exists (for validation)
    static async emailExists(email: string, excludeId?: number): Promise<boolean> {
        let sql = 'SELECT id FROM users WHERE email = ?';
        const params: any[] = [email];

        if (excludeId) {
            sql += ' AND id != ?';
            params.push(excludeId);
        }

        const result = await DatabaseConnection.get(sql, params);
        return !!result;
    }

    // Get user statistics
    static async getStatistics(): Promise<any> {
        const stats = await DatabaseConnection.all(`
            SELECT 
                COUNT(*) as total_users,
                COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users,
                COUNT(CASE WHEN is_active = 0 THEN 1 END) as inactive_users,
                AVG(age) as average_age,
                AVG(salary) as average_salary,
                MIN(salary) as min_salary,
                MAX(salary) as max_salary
            FROM users
        `);

        const departmentStats = await DatabaseConnection.all(`
            SELECT 
                department,
                COUNT(*) as user_count,
                AVG(salary) as avg_salary
            FROM users 
            WHERE department IS NOT NULL AND is_active = 1
            GROUP BY department
            ORDER BY user_count DESC
        `);

        return {
            overview: stats[0],
            by_department: departmentStats
        };
    }
}