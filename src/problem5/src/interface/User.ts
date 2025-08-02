export interface User {
    id?: number;
    name: string;
    email: string;
    age?: number;
    department?: string;
    salary?: number;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    age?: number;
    department?: string;
    salary?: number;
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    age?: number;
    department?: string;
    salary?: number;
    is_active?: boolean;
}

export interface UserFilters {
    name?: string;
    email?: string;
    department?: string;
    is_active?: boolean;
    min_age?: number;
    max_age?: number;
    min_salary?: number;
    max_salary?: number;
    page?: number;
    limit?: number;
    sort_by?: 'name' | 'email' | 'age' | 'salary' | 'created_at';
    sort_order?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        current_page: number;
        total_pages: number;
        total_items: number;
        items_per_page: number;
        has_next: boolean;
        has_prev: boolean;
    };
}