import { UserModel } from '../src/models/User';
import { CreateUserRequest } from '../src/interface/User';

describe('UserModel', () => {
    const sampleUser: CreateUserRequest = {
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
        department: 'Testing',
        salary: 50000
    };

    describe('create', () => {
        test('should create a new user', async () => {
            const user = await UserModel.create(sampleUser);

            expect(user).toBeDefined();
            expect(user.id).toBeDefined();
            expect(user.name).toBe(sampleUser.name);
            expect(user.email).toBe(sampleUser.email);
            expect(user.age).toBe(sampleUser.age);
            expect(user.department).toBe(sampleUser.department);
            expect(user.salary).toBe(sampleUser.salary);
            expect(user.is_active).toBe(true);
            expect(user.created_at).toBeDefined();
        });

        test('should throw error for duplicate email', async () => {
            await UserModel.create(sampleUser);

            await expect(UserModel.create(sampleUser))
                .rejects
                .toThrow('Email already exists');
        });
    });

    describe('findById', () => {
        test('should find user by ID', async () => {
            const createdUser = await UserModel.create({
                ...sampleUser,
                email: 'findbyid@example.com'
            });

            const foundUser = await UserModel.findById(createdUser.id!);

            expect(foundUser).toBeDefined();
            expect(foundUser!.id).toBe(createdUser.id);
            expect(foundUser!.email).toBe(createdUser.email);
        });

        test('should return null for non-existent ID', async () => {
            const user = await UserModel.findById(99999);
            expect(user).toBeNull();
        });
    });

    describe('findAll', () => {
        beforeAll(async () => {
            // Create test users
            await UserModel.create({
                name: 'Alice Johnson',
                email: 'alice@example.com',
                age: 28,
                department: 'Engineering',
                salary: 70000
            });

            await UserModel.create({
                name: 'Bob Smith',
                email: 'bob@example.com',
                age: 35,
                department: 'Marketing',
                salary: 60000
            });
        });

        test('should return all users', async () => {
            const users = await UserModel.findAll();
            expect(users).toBeDefined();
            expect(users.data.length).toBe(2);
        });

        test('should return empty array for no users', async () => {
            const users = await UserModel.findAll();
            expect(users).toBeDefined();
            expect(users.data.length).toBe(0);
        });
    });
});
