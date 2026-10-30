import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const databaseUrl =
  process.env.DATABASE_URL ||
  (process.env.MYSQL_HOST
    ? new URL(
        `mysql://${encodeURIComponent(process.env.MYSQL_USER || 'rpms')}:${encodeURIComponent(
          process.env.MYSQL_PASSWORD || '',
        )}@${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT || '3306'}/${encodeURIComponent(
          process.env.MYSQL_DATABASE || 'rpms',
        )}`,
      ).toString()
    : undefined);

if (!databaseUrl) {
  throw new Error(
    'Database configuration is missing. Set DATABASE_URL or MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE.',
  );
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
