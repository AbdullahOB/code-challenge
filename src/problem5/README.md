# ExpressJS CRUD API with TypeScript

A robust RESTful API built with ExpressJS, TypeScript, and SQLite for managing user resources with comprehensive CRUD operations.

## Features

- 🚀 **Full CRUD Operations** - Create, Read, Update, Delete users
- 🔍 **Advanced Filtering** - Filter by name, email, department, age, salary, etc.
- 📄 **Pagination** - Efficient pagination with customizable page sizes
- 📊 **Sorting** - Sort by any field in ascending or descending order
- ✅ **Input Validation** - Comprehensive validation using Joi
- 🛡️ **Security** - Helmet, CORS, and proper error handling
- 📁 **SQLite Database** - Lightweight, file-based database
- 🧪 **Testing Ready** - Jest setup with test utilities
- 📚 **API Documentation** - Built-in endpoint documentation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite3
- **Validation**: Joi
- **Testing**: Jest
- **Security**: Helmet, CORS
- **Logging**: Morgan

## Project Structure

```
src/
├── controllers/          # Request handlers
├── database/            # Database connection and setup
├── interfaces/          # TypeScript interfaces
├── middleware/          # Custom middleware (validation, error handling)
├── models/             # Data access layer
├── routes/             # API routes definition
├── scripts/            # Database migration and seeding
├── tests/              # Test files and setup
├── validation/         # Joi validation schemas
└── server.ts           # Main application entry point
```

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### 1. Clone the repository

```bash
git clone <repository-url>
cd express-crud-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
PORT=3000
NODE_ENV=development
DB_PATH=./database/app.db
API_PREFIX=/api/v1
CORS_ORIGIN=http://localhost:3000
```

### 4. Build the project

```bash
npm run build
```

### 5. Initialize the database

```bash
npm run db:migrate
```

### 6. Seed sample data (optional)

```bash
npm run db:seed
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Base URL: `/api/v1`

### Users Resource

| Method | Endpoint | Description | Body/Query Parameters |
|--------|----------|-------------|----------------------|
| `GET` | `/users` | List all users | Query filters (see below) |
| `POST` | `/users` | Create new user | `{ name, email, age?, department?, salary? }` |
| `GET` | `/users/:id` | Get user by ID | - |
| `PUT` | `/users/:id` | Update user | `{ name?, email?, age?, department?, salary?, is_active? }` |
| `DELETE` | `/users/:id` | Soft delete user | - |
| `DELETE` | `/users/:id/hard` | Hard delete user | - |
| `PATCH` | `/users/:id/activate` | Activate user | - |
| `PATCH` | `/users/:id/deactivate` | Deactivate user | - |
| `GET` | `/users/stats` | Get user statistics | - |

### Query Parameters for User Listing

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `name` | string | Filter by name (partial match) | `?name=john` |
| `email` | string | Filter by email (partial match) | `?email=@example.com` |
| `department` | string | Filter by department | `?department=Engineering` |
| `is_active` | boolean | Filter by active status | `?is_active=true` |
| `min_age` | number | Minimum age filter | `?min_age=25` |
| `max_age` | number | Maximum age filter | `?max_age=40` |
| `min_salary` | number | Minimum salary filter | `?min_salary=50000` |
| `max_salary` | number | Maximum salary filter | `?max_salary=100000` |
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (default: 10, max: 100) | `?limit=20` |
| `sort_by` | string | Sort field | `?sort_by=created_at` |
| `sort_order` | string | Sort direction (ASC/DESC) | `?sort_order=DESC` |

## API Examples

### Create a User

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "department": "Engineering",
    "salary": 75000
  }'
```

### Get All Users with Filters

```bash
curl "http://localhost:3000/api/v1/users?department=Engineering&min_salary=60000&page=1&limit=10"
```

### Update a User

```bash
curl -X PUT http://localhost:3000/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "salary": 80000,
    "department": "Senior Engineering"
  }'
```

### Get User Statistics

```bash
curl http://localhost:3000/api/v1/users/stats
```

## Response Format

### Success Response

```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": { ... },
  "pagination": { ... } // For list endpoints
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [ ... ] // For validation errors
}
```

### Pagination Response

```json
{
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 50,
    "items_per_page": 10,
    "has_next": true,
    "has_prev": false
  }
}
```

## Testing

### Run all tests

```bash
npm test
```

### Run tests with coverage

```bash
npm run test:coverage
```

## Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Initialize database |
| `npm run db:seed` | Seed sample data |

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request** - Validation errors, malformed requests
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate email addresses
- **500 Internal Server Error** - Server errors

## Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Joi validation schemas
- **SQL Injection Protection** - Parameterized queries
- **Error Sanitization** - Safe error responses

## Database Schema

### Users Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| name | TEXT | NOT NULL |
| email | TEXT | UNIQUE, NOT NULL |
| age | INTEGER | - |
| department | TEXT | - |
| salary | DECIMAL(10,2) | - |
| is_active | BOOLEAN | DEFAULT true |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | AUTO UPDATE |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details