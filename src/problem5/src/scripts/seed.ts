import { DatabaseConnection } from '../database/connection';
import { UserModel } from '../models/User';

const sampleUsers = [
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 30,
        department: 'Engineering',
        salary: 75000
    },
    {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        age: 28,
        department: 'Marketing',
        salary: 65000
    },
    {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        age: 35,
        department: 'Engineering',
        salary: 85000
    },
    {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        age: 32,
        department: 'HR',
        salary: 55000
    },
    {
        name: 'David Brown',
        email: 'david.brown@example.com',
        age: 29,
        department: 'Sales',
        salary: 60000
    },
    {
        name: 'Lisa Davis',
        email: 'lisa.davis@example.com',
        age: 27,
        department: 'Marketing',
        salary: 58000
    },
    {
        name: 'Robert Miller',
        email: 'robert.miller@example.com',
        age: 40,
        department: 'Engineering',
        salary: 95000
    },
    {
        name: 'Emily Garcia',
        email: 'emily.garcia@example.com',
        age: 26,
        department: 'Design',
        salary: 62000
    }
];

async function seed() {
    try {
        console.log('🌱 Starting database seeding...');

        await DatabaseConnection.initialize();

        console.log('Creating sample users...');

        for (const userData of sampleUsers) {
            try {
                const user = await UserModel.create(userData);
                console.log(`✅ Created user: ${user.name} (${user.email})`);
            } catch (error: any) {
                if (error.message.includes('Email already exists')) {
                    console.log(`⚠️  User already exists: ${userData.email}`);
                } else {
                    console.error(`❌ Failed to create user ${userData.email}:`, error.message);
                }
            }
        }

        console.log('✅ Database seeding completed successfully');

        await DatabaseConnection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();