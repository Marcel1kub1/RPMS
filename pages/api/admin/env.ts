import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requiredVars = ['NEXTAUTH_URL', 'SESSION_SECRET'];
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (!process.env.DATABASE_URL && !process.env.MYSQL_HOST) {
    missing.push('DATABASE_URL or MYSQL_HOST');
  }
  if (missing.length > 0) {
    return res.status(200).json({ missing });
  } else {
    return res.status(200).json({ missing: [] });
  }
}
