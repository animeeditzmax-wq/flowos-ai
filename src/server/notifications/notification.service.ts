import { NotificationType } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export async function createNotification(userId: string, type: NotificationType, title: string, body: string) {
  return prisma.notification.create({
    data: { userId, type, title, body }
  });
}

export async function sendEmailNotification(_email: string, _subject: string, _body: string) {
  // Integrate SendGrid/Postmark/Resend in production.
  return { delivered: true };
}
