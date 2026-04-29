import { NotificationType } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export async function createNotification(userId: string, type: NotificationType, title: string, body: string) {
  return prisma.notification.create({
    data: { userId, type, title, body }
  });
}

export async function sendEmailNotification(email: string, subject: string, body: string) {
  // Integrate SendGrid/Postmark/Resend in production.
  return { delivered: true, preview: { email, subject, body } };
}
