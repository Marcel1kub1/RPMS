import prisma from '@/utils/database';
import { getSessionByToken } from '@/utils/session';
import * as cookie from 'cookie';
import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = { success: boolean; error?: string; requestId?: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const token = cookie.parse(req.headers.cookie || '').session_token;
  const session = token ? await getSessionByToken(token) : null;
  if (!session) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const existing = await prisma.dataDeletionRequest.findFirst({
    where: { userId: session.userId, status: 'pending' },
  });
  if (existing) {
    res.status(202).json({ success: true, requestId: existing.id });
    return;
  }

  const request = await prisma.dataDeletionRequest.create({
    data: {
      id: crypto.randomUUID(),
      userId: session.userId,
      reason: typeof req.body?.reason === 'string' ? req.body.reason.slice(0, 500) : null,
    },
  });

  await prisma.$transaction(async (tx) => {
    await tx.authSession.deleteMany({ where: { userId: session.userId } });
    await tx.discordUser.deleteMany({ where: { robloxUserId: session.userId } });
    await tx.googleUser.deleteMany({ where: { robloxUserId: session.userId } });
    await tx.activitySession.updateMany({
      where: { userId: session.userId },
      data: { chatLog: null },
    });
    await tx.user.update({
      where: { userid: session.userId },
      data: {
        username: 'Deleted user',
        picture: null,
        registered: false,
        isFirstLogin: false,
      },
    });
    await tx.dataDeletionRequest.update({
      where: { id: request.id },
      data: { status: 'completed', processedAt: new Date() },
    });
  });

  res.setHeader('Set-Cookie', 'session_token=; Path=/; HttpOnly; SameSite=lax; Max-Age=0');
  res.status(200).json({ success: true, requestId: request.id });
}
