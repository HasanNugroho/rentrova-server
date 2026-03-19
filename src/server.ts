import app from './app.ts';
import { env, logger } from './config/index.ts';
import './database/prisma/client.ts';
import './database/redis/client.ts';

const server = Bun.serve({
  port: env.PORT,
  fetch: app.fetch,
});

logger.info(`🚀 Server running on http://localhost:${server.port}`);
logger.info(`📚 API Documentation available at http://localhost:${server.port}/docs`);

process.on('SIGINT', async () => {
  logger.info('🛑 Shutting down gracefully...');
  server.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('🛑 Shutting down gracefully...');
  server.stop();
  process.exit(0);
});
