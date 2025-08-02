import { DatabaseConnection } from '../database/connection';

async function migrate() {
    try {
        console.log('🔄 Starting database migration...');

        await DatabaseConnection.initialize();
        console.log('✅ Database migration completed successfully');

        await DatabaseConnection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();