import { DatabaseConnection } from '../src/database/connection';

// Set test database path
process.env.DB_PATH = ':memory:';
process.env.NODE_ENV = 'test';

beforeAll(async () => {
    await DatabaseConnection.initialize();
});

afterAll(async () => {
    await DatabaseConnection.close();
});