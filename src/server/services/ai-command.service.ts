import OpenAI from "openai";
import { TaskType, TaskStatus, ApprovalSensitivity } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { env } from "@/server/config/env";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

function inferTaskType(command: string): TaskType {
  const c = command.toLowerCase();
  if (c.includes("refund") || c.includes("claim")) return "REFUND";
  if (c.includes("book") || c.includes("appointment")) return "BOOKING";
  if (c.includes("subscription") || c.includes("cancel")) return "SUBSCRIPTION";
  if (c.includes("buy") || c.includes("laptop") || c.includes("product")) return "PURCHASE";
  if (c.includes("bill") || c.includes("expense")) return "BILL_OPTIMIZATION";
  return "EXPENSE";
}

export async function createAndClassifyTask(userId: string, command: string) {
  const defaultType = inferTaskType(command);

  const completion = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "Classify user command into taskType, sensitivity and an execution plan with sequential steps. Return valid compact JSON only."
      },
      { role: "user", content: command }
    ]
  });

  let parsed: { taskType: TaskType; sensitivity: ApprovalSensitivity; steps: string[]; expectedSavings?: number };

  try {
    parsed = JSON.parse(completion.output_text) as typeof parsed;
  } catch {
    parsed = {
      taskType: defaultType,
      sensitivity: "MEDIUM",
      steps: ["Analyze linked accounts", "Prepare recommended actions", "Request approval before high-impact actions"]
    };
  }

  const approvalRequired = parsed.sensitivity !== "LOW";

  const task = await prisma.aiTask.create({
    data: {
      userId,
      command,
      classification: parsed.taskType,
      type: parsed.taskType,
      status: approvalRequired ? TaskStatus.AWAITING_APPROVAL : TaskStatus.APPROVED,
      sensitivity: parsed.sensitivity,
      approvalRequired,
      executionPlan: { steps: parsed.steps },
      expectedSavings: parsed.expectedSavings
    }
  });

  await prisma.aiTaskHistory.create({
    data: {
      userId,
      taskId: task.id,
      event: "TASK_CREATED",
      eventData: { parsed }
    }
  });

  return task;
}

export async function approveTask(taskId: string, userId: string) {
  const task = await prisma.aiTask.update({
    where: { id: taskId, userId },
    data: { status: TaskStatus.APPROVED, approvedAt: new Date() }
  });

  await prisma.aiTaskHistory.create({
    data: { userId, taskId: task.id, event: "TASK_APPROVED" }
  });

  return task;
}
