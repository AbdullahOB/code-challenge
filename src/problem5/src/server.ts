import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { DatabaseConnection } from './database/connection';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

class Server {
    public app: express.Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || '3000', 10);

        this.initializeDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private async initializeDatabase(): Promise<void> {
        try {
            await DatabaseConnection.initialize();
            console.log('✅ Database connected successfully');
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            process.exit(1);
        }
    }

    private initializeMiddlewares(): void {
        // Security middleware
        this.app.use(helmet());

        // CORS configuration
        this.app.use(cors({
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Logging
        this.app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    }

    private initializeRoutes(): void {
        const apiPrefix = process.env.API_PREFIX || '/api/v1';

        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'success',
                message: 'Server is running',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });

        // API routes
        this.app.use(`${apiPrefix}/users`, userRoutes);

        // API documentation
        this.app.get(apiPrefix, (req, res) => {
            res.json({
                message: 'Express CRUD API',
                version: '1.0.0',
                endpoints: {
                    health: 'GET /health',
                    users: {
                        list: `GET ${apiPrefix}/users`,
                        create: `POST ${apiPrefix}/users`,
                        get: `GET ${apiPrefix}/users/:id`,
                        update: `PUT ${apiPrefix}/users/:id`,
                        delete: `DELETE ${apiPrefix}/users/:id`
                    }
                }
            });
        });
    }

    private initializeErrorHandling(): void {
        // 404 handler
        this.app.use(notFoundHandler);

        // Global error handler
        this.app.use(errorHandler);
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`🚀 Server running on http://localhost:${this.port}`);
            console.log(`📚 API Documentation: http://localhost:${this.port}${process.env.API_PREFIX || '/api/v1'}`);
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}

// Start server
const server = new Server();
server.listen();

export default server;
