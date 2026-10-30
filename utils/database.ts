import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import {
  PrismaClient,
  role,
  workspace,
  user,
  Session,
  SessionType,
  schedule,
  ActivitySession,
  document,
  wallPost,
  inactivityNotice,
  sessionUser,
  Quota,
  Ally,
  allyVisit,
  RoleMember,
  AuthSession,
} from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL
  ? new URL(process.env.DATABASE_URL)
  : null;

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || databaseUrl?.hostname || 'db',
  port: Number(process.env.DATABASE_PORT || databaseUrl?.port || 3306),
  user: process.env.DATABASE_USER || decodeURIComponent(databaseUrl?.username || 'rpms'),
  password:
    process.env.DATABASE_PASSWORD ||
    decodeURIComponent(databaseUrl?.password || ''),
  database:
    process.env.DATABASE_NAME ||
    databaseUrl?.pathname.replace(/^\/+/, '') ||
    'rpms',
  connectionLimit: Number(process.env.DATABASE_CONNECTION_LIMIT || 3),
});

const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export type {
  role,
  workspace,
  user,
  Session,
  SessionType,
  schedule,
  ActivitySession,
  document,
  wallPost,
  inactivityNotice,
  sessionUser,
  Quota,
  Ally,
  allyVisit,
  RoleMember,
  AuthSession,
};

export default prisma;
